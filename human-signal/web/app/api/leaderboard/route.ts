import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

function shorten(value: string | null) {
  if (!value) return "unknown";
  if (value.startsWith("0x") && value.length > 12) {
    return `${value.slice(0, 6)}...${value.slice(-4)}`;
  }
  if (value.length > 18) {
    return `${value.slice(0, 8)}...${value.slice(-4)}`;
  }
  return value;
}

export async function GET() {
  try {
    const { rows: workers } = await sql`
      WITH vote_totals AS (
        SELECT task_id, COUNT(*)::int AS total_votes
        FROM votes
        GROUP BY task_id
      ),
      option_totals AS (
        SELECT
          v.task_id,
          COALESCE(v.option_index, CASE WHEN v.choice = 'A' THEN 0 ELSE 1 END) AS option_index,
          COUNT(*)::int AS vote_count
        FROM votes v
        GROUP BY v.task_id, option_index
      ),
      ranked_options AS (
        SELECT
          ot.task_id,
          ot.option_index,
          ot.vote_count,
          DENSE_RANK() OVER (PARTITION BY ot.task_id ORDER BY ot.vote_count DESC) AS vote_rank
        FROM option_totals ot
      ),
      resolved_tasks AS (
        SELECT
          vt.task_id,
          vt.total_votes,
          MAX(CASE WHEN ro.vote_rank = 1 THEN ro.option_index END) AS winner_option_index,
          COUNT(*) FILTER (WHERE ro.vote_rank = 1) AS tied_leaders
        FROM vote_totals vt
        JOIN ranked_options ro ON ro.task_id = vt.task_id
        GROUP BY vt.task_id, vt.total_votes
        HAVING vt.total_votes >= 5
      ),
      worker_performance AS (
        SELECT
          w.nullifier_hash,
          COALESCE(w.wallet_address, w.nullifier_hash) AS identity,
          COALESCE(w.total_earned, 0)::float AS total_earned,
          COUNT(v.id)::int AS total_votes,
          COUNT(r.task_id) FILTER (WHERE r.tied_leaders = 1)::int AS scored_votes,
          COUNT(*) FILTER (
            WHERE r.tied_leaders = 1
              AND COALESCE(v.option_index, CASE WHEN v.choice = 'A' THEN 0 ELSE 1 END) = r.winner_option_index
          )::int AS correct_votes
        FROM workers w
        LEFT JOIN votes v ON v.nullifier_hash = w.nullifier_hash
        LEFT JOIN resolved_tasks r ON r.task_id = v.task_id
        GROUP BY w.nullifier_hash, w.wallet_address, w.total_earned
      )
      SELECT
        nullifier_hash,
        identity,
        total_earned,
        total_votes,
        scored_votes,
        correct_votes,
        CASE
          WHEN scored_votes > 0 THEN ROUND((correct_votes::numeric / scored_votes::numeric) * 100, 1)
          ELSE NULL
        END AS accuracy
      FROM worker_performance
      WHERE total_votes > 0
      ORDER BY total_earned DESC, accuracy DESC NULLS LAST, total_votes DESC
      LIMIT 10
    `;

    const { rows: ideaContributors } = await sql`
      WITH task_activity AS (
        SELECT
          t.id,
          t.requester_wallet,
          COALESCE(t.idea_contributor_share, 0.05)::numeric AS idea_contributor_share,
          COUNT(v.id)::int AS vote_count,
          (COUNT(v.id)::numeric * t.bounty_per_vote::numeric) AS revenue_generated,
          CASE
            WHEN COUNT(pl.id) > 0 THEN COALESCE(SUM(pl.idea_contributor_amount), 0)::numeric
            ELSE (
              COUNT(v.id)::numeric
              * t.bounty_per_vote::numeric
              * 0.9
              * COALESCE(t.idea_contributor_share, 0.05)::numeric
            )
          END AS idea_earnings
        FROM tasks t
        LEFT JOIN votes v ON v.task_id = t.id
        LEFT JOIN platform_ledger pl ON pl.task_id = t.id
        GROUP BY t.id, t.requester_wallet, t.bounty_per_vote, t.idea_contributor_share
      )
      SELECT
        requester_wallet,
        COUNT(*)::int AS task_count,
        COALESCE(SUM(vote_count), 0)::int AS votes_generated,
        COALESCE(SUM(revenue_generated), 0)::float AS revenue_generated,
        COALESCE(SUM(idea_earnings), 0)::float AS idea_earnings,
        ROUND(AVG(idea_contributor_share) * 100, 1) AS avg_take_rate
      FROM task_activity
      GROUP BY requester_wallet
      HAVING COALESCE(SUM(revenue_generated), 0) > 0
      ORDER BY revenue_generated DESC, idea_earnings DESC, task_count DESC
      LIMIT 10
    `;

    return NextResponse.json(
      {
        workers: workers.map((worker, index) => ({
          rank: index + 1,
          nullifier_hash: worker.nullifier_hash,
          label: shorten(worker.identity),
          total_earned: Number(worker.total_earned ?? 0),
          total_votes: Number(worker.total_votes ?? 0),
          scored_votes: Number(worker.scored_votes ?? 0),
          correct_votes: Number(worker.correct_votes ?? 0),
          accuracy: worker.accuracy === null ? null : Number(worker.accuracy),
        })),
        idea_contributors: ideaContributors.map((ideaContributor, index) => ({
          rank: index + 1,
          wallet: ideaContributor.requester_wallet,
          label: shorten(ideaContributor.requester_wallet),
          task_count: Number(ideaContributor.task_count ?? 0),
          votes_generated: Number(ideaContributor.votes_generated ?? 0),
          revenue_generated: Number(ideaContributor.revenue_generated ?? 0),
          idea_earnings: Number(ideaContributor.idea_earnings ?? 0),
          avg_take_rate: Number(ideaContributor.avg_take_rate ?? 0),
        })),
      },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json(
      { workers: [], idea_contributors: [] },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
