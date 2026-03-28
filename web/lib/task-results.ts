import { sql } from "@/lib/db";
import {
  CONTRIBUTOR_SHARE,
  ECONOMICS,
  FOUNDER_SHARE,
  PLATFORM_FUND,
} from "@/lib/economics";

interface TaskOption {
  option_index: number;
  label: string;
  content: string;
}

interface RecentVote {
  id: string;
  nullifier_prefix: string;
  voted_at: string | null;
  paid: number;
  option_index: number;
  feedback_text: string | null;
  feedback_rating: number | null;
  reputation_badge: string;
}

export interface TaskResultsPayload {
  task: {
    id: string;
    description: string;
    option_a_label: string;
    option_b_label: string;
    status: string;
    max_workers: number;
    bounty_per_vote: number;
    tier: string;
    context: string | null;
    creator_rating_up: number;
    creator_rating_down: number;
    options: TaskOption[];
    idea_contributor_share: number;
  };
  results: {
    total_votes: number;
    votes_a: number;
    votes_b: number;
    votes_by_option: Record<number, number>;
    winner: number | "tie" | null;
    confidence: number;
    verified_workers: number;
    total_paid_usdc: number;
  };
  recent_votes: RecentVote[];
  consensus: {
    winner: number | "tie" | null;
    confidence: number;
    distribution: Record<number, number>;
    total_votes: number;
    agreement_score: number;
  };
  provenance: {
    unique_humans: number;
    verification: string;
    nullifier_count: number;
    chain: string;
  };
  meta: {
    created_at: string | null;
    completed_at: string | null;
    tier: string;
    bounty_per_vote: number;
    idea_contributor_share: number;
  };
  economics: {
    contributor_share: number;
    platform_fund: number;
    founder_share: number;
    early_collaborator_share: number;
    founder_pool_share: number;
    idea_contributor_share: number;
    worker_share_of_90: number;
    version: number;
  };
}

export interface TaskCompletionEvent {
  event: "task.completed";
  task_id: string;
  completed_at: string | null;
  results: TaskResultsPayload;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toInt(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  const parsed = typeof value === "string" ? parseInt(value, 10) : Number.NaN;
  return Number.isInteger(parsed) ? parsed : fallback;
}

function toTimestamp(value: unknown) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseOptions(raw: unknown): TaskOption[] {
  if (Array.isArray(raw)) {
    return raw.map((option, index) => {
      const parsed = option as Partial<TaskOption> | null;

      return {
        option_index: toInt(parsed?.option_index, index),
        label: parsed?.label ?? `Option ${index + 1}`,
        content: parsed?.content ?? "",
      };
    });
  }

  if (typeof raw === "string") {
    try {
      return parseOptions(JSON.parse(raw));
    } catch {
      return [];
    }
  }

  return [];
}

export async function getTaskResults(taskId: string): Promise<TaskResultsPayload | null> {
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
    WHERE t.id = ${taskId}
  `;

  if (tasks.length === 0) {
    return null;
  }

  const task = tasks[0];
  const options = parseOptions(task.options);

  const { rows: voteCounts } = await sql`
    SELECT
      COALESCE(v.option_index, CASE WHEN v.choice = 'A' THEN 0 ELSE 1 END) AS option_idx,
      COUNT(*)::int AS count
    FROM votes v
    WHERE v.task_id = ${taskId}
    GROUP BY option_idx
    ORDER BY option_idx
  `;

  const votesByOption: Record<number, number> = {};
  for (const row of voteCounts) {
    votesByOption[toInt(row.option_idx)] = toInt(row.count);
  }

  const { rows: totalsRow } = await sql`
    SELECT
      COUNT(*)::int AS total_votes,
      COUNT(DISTINCT nullifier_hash)::int AS unique_humans
    FROM votes
    WHERE task_id = ${taskId}
  `;

  const totalVotes = toInt(totalsRow[0]?.total_votes);
  const uniqueHumans = toInt(totalsRow[0]?.unique_humans);
  const votesA = votesByOption[0] ?? 0;
  const votesB = votesByOption[1] ?? 0;

  let winner: number | "tie" | null = null;
  let confidence = 0;

  if (totalVotes > 0) {
    let maxCount = 0;
    let maxIndex: number | null = null;
    let tied = false;

    for (const [index, count] of Object.entries(votesByOption)) {
      if (count > maxCount) {
        maxCount = count;
        maxIndex = Number(index);
        tied = false;
      } else if (count === maxCount) {
        tied = true;
      }
    }

    confidence = maxCount / totalVotes;
    winner = totalVotes < 5 ? null : tied ? "tie" : maxIndex;
  }

  let agreementScore = 0;
  if (totalVotes > 0) {
    const optionCount = options.length > 0 ? options.length : 2;
    const maxEntropy = Math.log2(optionCount);

    if (maxEntropy > 0) {
      let entropy = 0;
      for (const count of Object.values(votesByOption)) {
        if (count > 0) {
          const probability = count / totalVotes;
          entropy -= probability * Math.log2(probability);
        }
      }
      agreementScore = 1 - entropy / maxEntropy;
    } else {
      agreementScore = 1;
    }
  }

  const { rows: paymentRows } = await sql`
    SELECT COALESCE(SUM(amount_usdc), 0)::float AS total_paid
    FROM payments
    WHERE task_id = ${taskId}
  `;
  const totalPaidUsdc = toNumber(paymentRows[0]?.total_paid);

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
    WHERE v.task_id = ${taskId}
    ORDER BY v.created_at DESC
    LIMIT 50
  `;

  const ideaContributorShare = toNumber(
    task.idea_contributor_share,
    ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
  );
  const bountyPerVote = toNumber(task.bounty_per_vote);

  return {
    task: {
      id: task.id,
      description: task.description,
      option_a_label: task.option_a_label,
      option_b_label: task.option_b_label,
      status: task.status,
      max_workers: toInt(task.max_workers),
      bounty_per_vote: bountyPerVote,
      tier: task.tier ?? "quick",
      context: task.context ?? null,
      creator_rating_up: toInt(task.creator_rating_up),
      creator_rating_down: toInt(task.creator_rating_down),
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
    recent_votes: recentVotes.map((vote) => ({
      id: vote.id,
      nullifier_prefix: (vote.nullifier_hash ?? "").slice(0, 8),
      voted_at: toTimestamp(vote.created_at),
      paid: vote.payment_tx_hash ? bountyPerVote : 0,
      option_index: toInt(vote.option_index, vote.choice === "A" ? 0 : 1),
      feedback_text: vote.feedback_text ?? null,
      feedback_rating: vote.feedback_rating === null ? null : toInt(vote.feedback_rating),
      reputation_badge: vote.reputation_badge ?? "new",
    })),
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
      created_at: toTimestamp(task.created_at),
      completed_at: toTimestamp(task.closed_at),
      tier: task.tier ?? "quick",
      bounty_per_vote: bountyPerVote,
      idea_contributor_share: ideaContributorShare,
    },
    economics: {
      contributor_share: CONTRIBUTOR_SHARE,
      platform_fund: PLATFORM_FUND,
      founder_share: FOUNDER_SHARE,
      early_collaborator_share: ECONOMICS.EARLY_COLLABORATOR,
      founder_pool_share: FOUNDER_SHARE + ECONOMICS.EARLY_COLLABORATOR,
      idea_contributor_share: ideaContributorShare,
      worker_share_of_90: 1 - ideaContributorShare,
      version: ECONOMICS.VERSION,
    },
  };
}

export async function buildTaskCompletionEvent(taskId: string): Promise<TaskCompletionEvent | null> {
  const results = await getTaskResults(taskId);
  if (!results) {
    return null;
  }

  return {
    event: "task.completed",
    task_id: taskId,
    completed_at: results.meta.completed_at,
    results,
  };
}
