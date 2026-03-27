import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/tasks/:id — task details + live results (N-option aware)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch task with options
    const { rows: tasks } = await sql`
      SELECT
        t.*,
        COALESCE((
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT('option_index', o.option_index, 'label', o.label, 'content', o.content)
            ORDER BY o.option_index
          )
          FROM task_options o WHERE o.task_id = t.id
        ), '[]'::json) AS options
      FROM tasks t
      WHERE t.id = ${id}
    `;

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    const task = tasks[0];

    // Aggregate vote counts by option_index (handles both old choice-only and new option_index votes)
    const { rows: voteCounts } = await sql`
      SELECT
        COALESCE(v.option_index, CASE WHEN v.choice = 'A' THEN 0 ELSE 1 END) AS option_idx,
        COUNT(*)::int AS count
      FROM votes v
      WHERE v.task_id = ${id}
      GROUP BY option_idx
      ORDER BY option_idx
    `;

    const totalVotes = voteCounts.reduce((sum, r) => sum + r.count, 0);

    // Build per-option breakdown
    const votesByOption: Record<number, number> = {};
    for (const row of voteCounts) {
      votesByOption[row.option_idx] = row.count;
    }

    // Determine winner (option_index with most votes)
    let winnerIndex: number | null = null;
    let maxVotes = 0;
    let tied = false;
    for (const [idx, count] of Object.entries(votesByOption)) {
      if (count > maxVotes) {
        maxVotes = count;
        winnerIndex = Number(idx);
        tied = false;
      } else if (count === maxVotes) {
        tied = true;
      }
    }
    const winner = totalVotes === 0 ? null : tied ? "tie" : winnerIndex;
    const confidence = totalVotes === 0 ? 0 : maxVotes / totalVotes;
    const totalPaid = parseFloat(task.bounty_per_vote) * totalVotes;

    // Recent votes with feedback and reputation badge
    const { rows: recentVotes } = await sql`
      SELECT
        v.id,
        v.nullifier_hash,
        v.created_at,
        v.payment_tx_hash,
        v.option_index,
        v.choice,
        v.feedback_text,
        v.feedback_rating,
        r.badge AS reputation_badge,
        r.score AS reputation_score
      FROM votes v
      LEFT JOIN reputation r ON r.nullifier_hash = v.nullifier_hash
      WHERE v.task_id = ${id}
      ORDER BY v.created_at DESC
      LIMIT 10
    `;

    // Legacy A/B compat fields for old result consumers
    const votesA = votesByOption[0] ?? 0;
    const votesB = votesByOption[1] ?? 0;

    return NextResponse.json({
      task,
      results: {
        total_votes: totalVotes,
        votes_a: votesA,
        votes_b: votesB,
        votes_by_option: votesByOption,
        winner,
        confidence,
        verified_workers: totalVotes,
        total_paid_usdc: totalPaid,
      },
      recent_votes: recentVotes.map((v) => ({
        id: v.id,
        nullifier_prefix: v.nullifier_hash?.slice(0, 10) + "...",
        voted_at: v.created_at,
        paid: v.payment_tx_hash ? parseFloat(task.bounty_per_vote) : 0,
        option_index: v.option_index ?? (v.choice === "A" ? 0 : 1),
        choice: v.choice,
        feedback_text: v.feedback_text ?? null,
        feedback_rating: v.feedback_rating ?? null,
        reputation_badge: v.reputation_badge ?? "new",
        reputation_score: v.reputation_score ?? 0,
      })),
    });
  } catch (error) {
    console.error(`GET /api/tasks/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
