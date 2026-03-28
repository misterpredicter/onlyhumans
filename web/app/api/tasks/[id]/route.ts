import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ECONOMICS } from "@/lib/economics";

// GET /api/tasks/:id — Task details + live vote results
// Dual-consumer: serves both the frontend ResultsDashboard and agent API consumers
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Task + options
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
    const options = typeof task.options === "string" ? JSON.parse(task.options) : task.options;

    // 2. Vote aggregation
    const { rows: voteCounts } = await sql`
      SELECT
        COALESCE(v.option_index, CASE WHEN v.choice = 'A' THEN 0 ELSE 1 END) AS option_idx,
        COUNT(*)::int AS count
      FROM votes v
      WHERE v.task_id = ${id}
      GROUP BY option_idx
      ORDER BY option_idx
    `;

    const { rows: totalsRow } = await sql`
      SELECT
        COUNT(*)::int AS total_votes,
        COUNT(DISTINCT nullifier_hash)::int AS unique_humans
      FROM votes
      WHERE task_id = ${id}
    `;

    const totalVotes = totalsRow[0]?.total_votes ?? 0;
    const uniqueHumans = totalsRow[0]?.unique_humans ?? 0;

    // Build votes_by_option map
    const votesByOption: Record<number, number> = {};
    for (const row of voteCounts) {
      votesByOption[row.option_idx] = row.count;
    }

    // Legacy A/B counts
    const votesA = votesByOption[0] ?? 0;
    const votesB = votesByOption[1] ?? 0;

    // Winner + confidence
    let winner: number | string | null = null;
    let confidence = 0;

    if (totalVotes > 0) {
      let maxCount = 0;
      let maxIdx: number | null = null;
      let tied = false;

      for (const [idx, count] of Object.entries(votesByOption)) {
        if (count > maxCount) {
          maxCount = count;
          maxIdx = Number(idx);
          tied = false;
        } else if (count === maxCount) {
          tied = true;
        }
      }

      confidence = maxCount / totalVotes;
      winner = totalVotes < 5 ? null : tied ? "tie" : maxIdx;
    }

    // Shannon entropy agreement score (0 = max disagreement, 1 = total agreement)
    let agreementScore = 0;
    if (totalVotes > 0) {
      const optionCount = Array.isArray(options) && options.length > 0 ? options.length : 2;
      const maxEntropy = Math.log2(optionCount);

      if (maxEntropy > 0) {
        let entropy = 0;
        for (const count of Object.values(votesByOption)) {
          if (count > 0) {
            const p = count / totalVotes;
            entropy -= p * Math.log2(p);
          }
        }
        agreementScore = 1 - entropy / maxEntropy;
      } else {
        agreementScore = 1;
      }
    }

    // 3. Payment totals
    const { rows: paymentRow } = await sql`
      SELECT COALESCE(SUM(amount_usdc), 0)::float AS total_paid
      FROM payments
      WHERE task_id = ${id}
    `;
    const totalPaidUsdc = paymentRow[0]?.total_paid ?? 0;

    // 4. Recent votes with feedback + reputation
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
        r.badge AS reputation_badge
      FROM votes v
      LEFT JOIN reputation r ON r.nullifier_hash = v.nullifier_hash
      WHERE v.task_id = ${id}
      ORDER BY v.created_at DESC
      LIMIT 50
    `;

    // 5. Economics
    const ideaContributorShare = parseFloat(task.idea_contributor_share ?? "0.05");

    // Build dual-consumer response
    const response = {
      // Frontend-facing (matches ResultsDashboard.TaskData)
      task: {
        id: task.id,
        description: task.description,
        option_a_label: task.option_a_label,
        option_b_label: task.option_b_label,
        status: task.status,
        max_workers: task.max_workers,
        bounty_per_vote: parseFloat(task.bounty_per_vote),
        tier: task.tier,
        context: task.context,
        creator_rating_up: task.creator_rating_up ?? 0,
        creator_rating_down: task.creator_rating_down ?? 0,
        options,
        idea_contributor_share: ideaContributorShare,
      },
      results: {
        total_votes: totalVotes,
        votes_a: votesA,
        votes_b: votesB,
        votes_by_option: votesByOption,
        winner,
        confidence,
        verified_workers: uniqueHumans,
        total_paid_usdc: totalPaidUsdc,
      },
      recent_votes: recentVotes.map((v) => ({
        id: v.id,
        nullifier_prefix: (v.nullifier_hash ?? "").slice(0, 8),
        voted_at: v.created_at,
        paid: v.payment_tx_hash ? parseFloat(task.bounty_per_vote) : 0,
        option_index: v.option_index ?? (v.choice === "A" ? 0 : 1),
        feedback_text: v.feedback_text ?? null,
        feedback_rating: v.feedback_rating ?? null,
        reputation_badge: v.reputation_badge ?? "new",
      })),

      // Agent-facing (structured for programmatic consumption)
      consensus: {
        winner,
        confidence,
        distribution: votesByOption,
        total_votes: totalVotes,
        agreement_score: agreementScore,
      },
      provenance: {
        unique_humans: uniqueHumans,
        verification: "world-id-v4",
        nullifier_count: uniqueHumans,
        chain: "base-sepolia",
      },
      meta: {
        created_at: task.created_at,
        tier: task.tier,
        bounty_per_vote: parseFloat(task.bounty_per_vote),
        idea_contributor_share: ideaContributorShare,
      },
      economics: {
        contributor_share: ECONOMICS.CONTRIBUTOR_SHARE,
        platform_fund: ECONOMICS.PLATFORM_FUND,
        founder_share: ECONOMICS.FOUNDER_SHARE,
        idea_contributor_share: ideaContributorShare,
        worker_share_of_90: 1 - ideaContributorShare,
        version: ECONOMICS.VERSION,
      },
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error(`GET /api/tasks/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}
