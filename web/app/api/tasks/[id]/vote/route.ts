import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { calculateSplit } from "@/lib/economics";
import { payWorker } from "@/lib/payments";
import { deliverTaskCompletionCallback } from "@/lib/task-callbacks";

// POST /api/tasks/:id/vote — submit vote + trigger payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { nullifier_hash, worker_wallet, feedback_text } = body;

    let option_index: number;
    let choice: "A" | "B";

    if (typeof body.option_index === "number") {
      option_index = body.option_index;
      choice = option_index === 0 ? "A" : "B";
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

    const { rows: workers } = await sql`
      SELECT nullifier_hash FROM workers WHERE nullifier_hash = ${nullifier_hash}
    `;
    if (workers.length === 0) {
      return NextResponse.json(
        { error: "World ID verification required before voting" },
        { status: 401 }
      );
    }

    const { rows: existing } = await sql`
      SELECT id FROM votes WHERE task_id = ${id} AND nullifier_hash = ${nullifier_hash}
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Already voted on this task" },
        { status: 409 }
      );
    }

    const { rows: tasks } = await sql`
      SELECT t.*, (SELECT COUNT(*)::int FROM votes v WHERE v.task_id = t.id) AS current_votes
      FROM tasks t
      WHERE t.id = ${id} AND t.status = 'open'
    `;
    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found or closed" }, { status: 404 });
    }

    const task = tasks[0];
    const tier = task.tier ?? "quick";

    if (task.current_votes >= task.max_workers) {
      await sql`
        UPDATE tasks
        SET status = 'closed', closed_at = COALESCE(closed_at, NOW())
        WHERE id = ${id} AND status = 'open'
      `;
      return NextResponse.json({ error: "Task is full — no more slots available" }, { status: 409 });
    }

    const { rows: taskOptions } = await sql`
      SELECT MAX(option_index) AS max_idx FROM task_options WHERE task_id = ${id}
    `;
    const maxOptionIndex = taskOptions[0]?.max_idx ?? 1;
    if (option_index < 0 || option_index > maxOptionIndex) {
      return NextResponse.json(
        { error: `Invalid option_index: must be 0-${maxOptionIndex}` },
        { status: 400 }
      );
    }

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

    const bounty = parseFloat(task.bounty_per_vote);
    const ideaShare = parseFloat(task.idea_contributor_share ?? "0.05");
    const split = calculateSplit(bounty, ideaShare);

    let txHash: string | null = null;
    if (worker_wallet && !/^0x[a-fA-F0-9]{40}$/.test(worker_wallet)) {
      return NextResponse.json(
        { error: "worker_wallet must be a valid Ethereum address (0x...)" },
        { status: 400 }
      );
    }

    if (worker_wallet) {
      try {
        txHash = await payWorker(worker_wallet as `0x${string}`, split.worker);
        await sql`
          UPDATE workers
          SET total_earned = total_earned + ${split.worker},
              wallet_address = ${worker_wallet}
          WHERE nullifier_hash = ${nullifier_hash}
        `;
        await sql`
          INSERT INTO payments (type, wallet_address, amount_usdc, tx_hash, task_id)
          VALUES ('worker_payout', ${worker_wallet}, ${split.worker}, ${txHash}, ${id})
        `;
      } catch (error) {
        console.error("Payment failed (vote still counts):", error);
      }
    }

    const { rows: voteRows } = await sql`
      INSERT INTO votes (task_id, nullifier_hash, choice, option_index, feedback_text, payment_tx_hash)
      VALUES (${id}, ${nullifier_hash}, ${choice}, ${option_index}, ${feedback_text ?? null}, ${txHash})
      RETURNING id
    `;
    const voteId = voteRows[0]?.id;

    await sql`
      INSERT INTO platform_ledger (
        vote_id, task_id, bounty_per_vote, worker_amount,
        idea_contributor_amount, platform_amount, founder_amount,
        early_collaborator_amount, idea_contributor_share
      )
      VALUES (
        ${voteId}, ${id}, ${bounty}, ${split.worker},
        ${split.idea_contributor}, ${split.platform}, ${split.founder},
        ${split.early_collaborator}, ${ideaShare}
      )
    `;

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

    const { rows: voteTotals } = await sql`
      SELECT COUNT(*)::int AS total FROM votes WHERE task_id = ${id}
    `;
    const totalVotes = voteTotals[0]?.total ?? 0;

    if (totalVotes >= task.max_workers) {
      await sql`
        UPDATE tasks
        SET status = 'closed', closed_at = COALESCE(closed_at, NOW())
        WHERE id = ${id}
      `;

      if (task.callback_url) {
        const callbackResult = await deliverTaskCompletionCallback(id, task.callback_url);
        if (!callbackResult.ok) {
          console.error("Webhook callback failed:", callbackResult.error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      choice,
      option_index,
      payment_tx_hash: txHash,
      amount_paid_usdc: txHash ? split.worker : 0,
      nullifier_hash: nullifier_hash.slice(0, 8),
      total_votes: totalVotes,
      economics: {
        worker_received: split.worker,
        idea_contributor_accrued: split.idea_contributor,
        platform_accrued: split.platform,
        founder_accrued: split.founder,
        early_collaborator_accrued: split.early_collaborator,
      },
    });
  } catch (error) {
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
