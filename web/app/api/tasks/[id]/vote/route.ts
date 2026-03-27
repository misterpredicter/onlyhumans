import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { payWorker } from "@/lib/payments";

// POST /api/tasks/:id/vote — submit vote + trigger payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { nullifier_hash, worker_wallet, feedback_text } = body;

    // Accept option_index (V2) or choice (V1 backward compat)
    let option_index: number;
    let choice: "A" | "B";

    if (typeof body.option_index === "number") {
      option_index = body.option_index;
      choice = option_index === 1 ? "B" : "A"; // 0→A, 1→B, 2+→A
    } else if (body.choice === "A" || body.choice === "B") {
      choice = body.choice;
      option_index = choice === "A" ? 0 : 1;
    } else {
      return NextResponse.json(
        { error: "Provide option_index (integer) or choice ('A'|'B')" },
        { status: 400 }
      );
    }

    if (!nullifier_hash) {
      return NextResponse.json(
        { error: "Missing required field: nullifier_hash" },
        { status: 400 }
      );
    }

    // 1. Verify nullifier exists (worker verified with World ID)
    const { rows: workers } = await sql`
      SELECT nullifier_hash FROM workers WHERE nullifier_hash = ${nullifier_hash}
    `;
    if (workers.length === 0) {
      return NextResponse.json(
        { error: "World ID verification required before voting" },
        { status: 401 }
      );
    }

    // 2. Anti-sybil: check for duplicate vote on this task
    const { rows: existing } = await sql`
      SELECT id FROM votes WHERE task_id = ${id} AND nullifier_hash = ${nullifier_hash}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Already voted on this task" },
        { status: 409 }
      );
    }

    // 3. Get task (includes tier for feedback validation)
    const { rows: tasks } = await sql`
      SELECT * FROM tasks WHERE id = ${id} AND status = 'open'
    `;
    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found or closed" }, { status: 404 });
    }
    const task = tasks[0];
    const tier = task.tier ?? "quick";

    // 4. Validate feedback requirement per tier
    if (tier === "reasoned" && !feedback_text?.trim()) {
      return NextResponse.json(
        { error: "feedback_text required for reasoned tier (1-2 sentences)" },
        { status: 400 }
      );
    }
    if (tier === "detailed" && !feedback_text?.trim()) {
      return NextResponse.json(
        { error: "feedback_text required for detailed tier" },
        { status: 400 }
      );
    }

    // 5. Pay worker (best-effort — vote still counts if payment fails)
    let txHash: string | null = null;
    if (worker_wallet) {
      try {
        txHash = await payWorker(worker_wallet as `0x${string}`, parseFloat(task.bounty_per_vote));
        await sql`
          UPDATE workers
          SET total_earned = total_earned + ${task.bounty_per_vote},
              wallet_address = ${worker_wallet}
          WHERE nullifier_hash = ${nullifier_hash}
        `;
        await sql`
          INSERT INTO payments (type, wallet_address, amount_usdc, tx_hash, task_id)
          VALUES ('worker_payout', ${worker_wallet}, ${task.bounty_per_vote}, ${txHash}, ${id})
        `;
      } catch (e) {
        console.error("Payment failed (vote still counts):", e);
      }
    }

    // 6. Insert vote with option_index + feedback (UNIQUE constraint prevents duplicates atomically)
    await sql`
      INSERT INTO votes (task_id, nullifier_hash, choice, option_index, feedback_text, payment_tx_hash)
      VALUES (${id}, ${nullifier_hash}, ${choice}, ${option_index}, ${feedback_text ?? null}, ${txHash})
    `;

    // 7. Upsert reputation for this voter
    await sql`
      INSERT INTO reputation (nullifier_hash, total_votes, total_detailed, badge)
      VALUES (
        ${nullifier_hash},
        1,
        ${tier === "detailed" ? 1 : 0},
        'new'
      )
      ON CONFLICT (nullifier_hash) DO UPDATE SET
        total_votes = reputation.total_votes + 1,
        total_detailed = reputation.total_detailed + ${tier === "detailed" ? 1 : 0},
        badge = CASE
          WHEN reputation.total_votes + 1 >= 50 AND reputation.avg_rating >= 4.5 THEN 'platinum'
          WHEN reputation.total_votes + 1 >= 20 AND reputation.avg_rating >= 4.0 THEN 'gold'
          WHEN reputation.total_votes + 1 >= 10 AND reputation.avg_rating >= 3.5 THEN 'silver'
          WHEN reputation.total_votes + 1 >= 5 THEN 'bronze'
          ELSE 'new'
        END
    `;

    // 8. Check if task should be closed (max_workers reached)
    const { rows: voteTotals } = await sql`
      SELECT COUNT(*)::int AS total FROM votes WHERE task_id = ${id}
    `;
    const totalVotes = voteTotals[0]?.total ?? 0;

    if (totalVotes >= task.max_workers) {
      await sql`UPDATE tasks SET status = 'closed' WHERE id = ${id}`;
    }

    return NextResponse.json({
      success: true,
      choice,
      option_index,
      payment_tx_hash: txHash,
      amount_paid_usdc: txHash ? parseFloat(task.bounty_per_vote) : 0,
      total_votes: totalVotes,
    });
  } catch (error) {
    // Catch unique constraint violation (race condition double-vote)
    if (String(error).includes("unique") || String(error).includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Already voted on this task" },
        { status: 409 }
      );
    }
    console.error(`POST /api/tasks/${id}/vote error:`, error);
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}
