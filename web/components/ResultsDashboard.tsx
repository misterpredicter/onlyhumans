"use client";

import { useEffect, useState } from "react";
import { TierBadge } from "@/components/TierBadge";

interface TaskOption {
  option_index: number;
  label: string;
  content: string;
}

interface RecentVote {
  id: string;
  nullifier_prefix: string;
  voted_at: string;
  paid: number;
  option_index: number;
  feedback_text: string | null;
  feedback_rating: number | null;
  reputation_badge: string;
}

interface TaskData {
  task: {
    id: string;
    description: string;
    option_a_label: string;
    option_b_label: string;
    status: string;
    max_workers: number;
    bounty_per_vote: number;
    tier?: string;
    context?: string | null;
    creator_rating_up?: number;
    creator_rating_down?: number;
    options?: TaskOption[];
  };
  results: {
    total_votes: number;
    votes_a: number;
    votes_b: number;
    votes_by_option?: Record<number, number>;
    winner: number | string | null;
    confidence: number;
    verified_workers: number;
    total_paid_usdc: number;
  };
  recent_votes?: RecentVote[];
}

const BADGE_COLORS: Record<string, string> = {
  platinum: "text-slate-600 bg-slate-100",
  gold: "text-yellow-700 bg-yellow-50",
  silver: "text-gray-600 bg-gray-100",
  bronze: "text-orange-700 bg-orange-50",
  new: "text-gray-400 bg-gray-50",
};

const BAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

interface Props {
  taskId: string;
}

export function ResultsDashboard({ taskId }: Props) {
  const [data, setData] = useState<TaskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        if (!res.ok) {
          setError("Task not found");
          return;
        }
        setData(await res.json());
      } catch {
        setError("Connection error");
      }
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [taskId]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    );
  }

  const { task, results } = data;
  const total = results.total_votes;

  // Resolve options: prefer task.options (V2), fall back to A/B columns
  const options: TaskOption[] =
    Array.isArray(task.options) && task.options.length > 0
      ? task.options
      : [
          { option_index: 0, label: task.option_a_label, content: "" },
          { option_index: 1, label: task.option_b_label, content: "" },
        ];

  // Resolve vote counts per option
  const votesByOption: Record<number, number> = results.votes_by_option ?? {
    0: results.votes_a,
    1: results.votes_b,
  };

  // Resolve winner label
  const winnerLabel =
    results.winner === null
      ? null
      : results.winner === "tie"
      ? "Tie"
      : typeof results.winner === "number"
      ? options.find((o) => o.option_index === results.winner)?.label ?? `Option ${(results.winner as number) + 1}`
      : results.winner === "A"
      ? options[0]?.label
      : options[1]?.label;

  const hasWinner = total >= 5 && results.winner !== null && results.winner !== "tie";

  // Feedback votes (those with feedback_text)
  const feedbackVotes = (data.recent_votes ?? []).filter((v) => v.feedback_text);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex justify-between text-sm text-gray-500 flex-1">
          <span>
            <span className="font-semibold text-gray-900">{total}</span> verified humans voted
          </span>
          <span>
            <span className="font-semibold text-gray-900">
              ${results.total_paid_usdc.toFixed(2)}
            </span>{" "}
            USDC paid out
          </span>
        </div>
        {task.tier && (
          <div className="ml-3">
            <TierBadge tier={task.tier} showPayout={false} />
          </div>
        )}
      </div>

      {/* Per-option vote bars */}
      {options.map((opt, i) => {
        const count = votesByOption[opt.option_index] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : Math.round(100 / options.length);
        const barColor = BAR_COLORS[i % BAR_COLORS.length];
        const isWinner =
          !results.winner || results.winner === "tie"
            ? false
            : typeof results.winner === "number"
            ? results.winner === opt.option_index
            : (results.winner === "A" && opt.option_index === 0) ||
              (results.winner === "B" && opt.option_index === 1);

        return (
          <div key={opt.option_index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${isWinner ? "text-green-700" : ""}`}>
                {opt.label}
                {isWinner && (
                  <span className="ml-1.5 text-xs text-green-600 font-normal">winner</span>
                )}
              </span>
              <span className="text-gray-500">
                {count} votes ({pct}%)
              </span>
            </div>
            <div className="h-7 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Winner banner */}
      {hasWinner && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-semibold text-green-800">Winner: {winnerLabel}</p>
          <p className="text-sm text-green-600 mt-1">
            {Math.round(results.confidence * 100)}% of verified humans agree
          </p>
        </div>
      )}

      {total < 5 && total > 0 && (
        <p className="text-sm text-gray-400 text-center">
          {5 - total} more votes needed to declare a winner
        </p>
      )}

      {/* Creator rating */}
      {((task.creator_rating_up ?? 0) + (task.creator_rating_down ?? 0)) > 0 && (
        <div className="text-xs text-gray-400">
          Task quality:{" "}
          <span className="text-green-600">👍 {task.creator_rating_up ?? 0}</span>{" "}
          <span className="text-red-500">👎 {task.creator_rating_down ?? 0}</span>
        </div>
      )}

      {/* Feedback section */}
      {feedbackVotes.length > 0 && (
        <div>
          <button
            onClick={() => setShowFeedback((v) => !v)}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            {showFeedback ? "▲" : "▼"} {feedbackVotes.length} feedback response
            {feedbackVotes.length !== 1 ? "s" : ""}
          </button>

          {showFeedback && (
            <div className="mt-3 space-y-3">
              {feedbackVotes.map((v) => (
                <div key={v.id} className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-400">{v.nullifier_prefix}</span>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${
                          BADGE_COLORS[v.reputation_badge] ?? BADGE_COLORS.new
                        }`}
                      >
                        {v.reputation_badge}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Option{" "}
                      {options.find((o) => o.option_index === v.option_index)?.label ??
                        `#${v.option_index + 1}`}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {v.feedback_text}
                  </p>
                  {v.feedback_rating && (
                    <div className="mt-2 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={i < v.feedback_rating! ? "text-yellow-400" : "text-gray-200"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span
          className={`w-2 h-2 rounded-full ${
            task.status === "open" ? "bg-green-400 animate-pulse" : "bg-gray-400"
          }`}
        />
        {task.status === "open"
          ? `Open — ${task.max_workers - total} slots remaining`
          : "Closed"}
      </div>
    </div>
  );
}
