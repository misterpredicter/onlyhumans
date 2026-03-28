"use client";

import { useEffect, useState } from "react";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";
import { TierBadge } from "@/components/TierBadge";
import { ECONOMICS } from "@/lib/economics";

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
    idea_contributor_share?: number;
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

const BADGE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  platinum: { color: "#475569", bg: "#F8FAFC", border: "#E2E8F0" },
  gold: { color: "#A16207", bg: "#FEFCE8", border: "#FEF08A" },
  silver: { color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  bronze: { color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA" },
  new: { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" },
};

const BAR_GRADIENTS = [
  "linear-gradient(90deg, #3B82F6, #2563EB)",
  "linear-gradient(90deg, #8B5CF6, #7C3AED)",
  "linear-gradient(90deg, #10B981, #059669)",
  "linear-gradient(90deg, #F59E0B, #D97706)",
  "linear-gradient(90deg, #EC4899, #DB2777)",
  "linear-gradient(90deg, #14B8A6, #0D9488)",
];

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };

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
        setError(null);
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
      <div style={{
        backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
        borderRadius: "14px", padding: "24px",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <span style={{ ...dm, fontSize: "14px", color: "#DC2626" }}>{error}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="skeleton" style={{ height: "16px", width: "200px" }} />
          <div className="skeleton" style={{ height: "16px", width: "120px" }} />
        </div>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="skeleton" style={{ height: "14px", width: "100px" }} />
              <div className="skeleton" style={{ height: "14px", width: "80px" }} />
            </div>
            <div className="skeleton" style={{ height: "32px", width: "100%", borderRadius: "100px" }} />
          </div>
        ))}
      </div>
    );
  }

  const { task, results } = data;
  const total = results.total_votes;
  const ideaContributorShare =
    task.idea_contributor_share ?? ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE;

  const options: TaskOption[] =
    Array.isArray(task.options) && task.options.length > 0
      ? task.options
      : [
          { option_index: 0, label: task.option_a_label, content: "" },
          { option_index: 1, label: task.option_b_label, content: "" },
        ];

  const votesByOption: Record<number, number> = results.votes_by_option ?? {
    0: results.votes_a,
    1: results.votes_b,
  };

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
  const feedbackVotes = (data.recent_votes ?? []).filter((v) => v.feedback_text);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stats row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ ...dm, fontSize: "14px", color: "#6B7280" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px" }}>{total}</span> verified votes
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            ...dm, fontSize: "14px", fontWeight: 700, color: "#059669",
          }}>
            ${results.total_paid_usdc.toFixed(2)} USDC
          </span>
          {task.tier && <TierBadge tier={task.tier} />}
        </div>
      </div>

      <EconomicsBreakdown
        taskRevenue={task.bounty_per_vote}
        ideaContributorShare={ideaContributorShare}
        maxWorkers={task.max_workers}
        title="Task economics"
        subtitle="The split is part of the product: contributors can inspect it before committing work."
      />

      {/* Per-option vote bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {options.map((opt, i) => {
          const count = votesByOption[opt.option_index] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const barGradient = BAR_GRADIENTS[i % BAR_GRADIENTS.length];
          const isWinner =
            !results.winner || results.winner === "tie"
              ? false
              : typeof results.winner === "number"
              ? results.winner === opt.option_index
              : (results.winner === "A" && opt.option_index === 0) ||
                (results.winner === "B" && opt.option_index === 1);

          return (
            <div key={opt.option_index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  ...dm, fontSize: "14px", fontWeight: 600,
                  color: isWinner ? "#059669" : "#0C0C0C",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  {opt.label}
                  {isWinner && (
                    <span style={{
                      fontSize: "11px", fontWeight: 600,
                      color: "#059669", backgroundColor: "#F0FDF4",
                      border: "1px solid #D1FAE5",
                      borderRadius: "6px", padding: "1px 8px",
                    }}>
                      winner
                    </span>
                  )}
                </span>
                <span style={{ ...dm, fontSize: "13px", color: "#6B7280", fontWeight: 500 }}>
                  {count} votes ({pct}%)
                </span>
              </div>
              <div style={{
                height: "32px",
                backgroundColor: "#F5F4F0",
                borderRadius: "100px",
                overflow: "hidden",
                position: "relative",
              }}>
                <div
                  className="progress-bar"
                  style={{
                    height: "100%",
                    borderRadius: "100px",
                    background: barGradient,
                    width: `${Math.max(pct, 2)}%`,
                    display: "flex", alignItems: "center", justifyContent: "flex-end",
                    paddingRight: pct > 10 ? "12px" : "0",
                    minWidth: "8px",
                  }}
                >
                  {pct > 10 && (
                    <span style={{
                      fontFamily: "var(--font-sans), sans-serif",
                      fontSize: "12px", fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                    }}>
                      {pct}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner banner */}
      {hasWinner && (
        <div className="animate-fade-in" style={{
          background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
          border: "1px solid #A7F3D0",
          borderRadius: "14px", padding: "18px 20px",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#065F46", margin: "0 0 2px" }}>
              Winner: {winnerLabel}
            </p>
            <p style={{ ...dm, fontSize: "13px", color: "#059669", margin: 0 }}>
              {Math.round(results.confidence * 100)}% of verified humans agree
            </p>
          </div>
        </div>
      )}

      {total === 0 && (
        <div style={{
          textAlign: "center", padding: "24px 12px",
          backgroundColor: "#FAFAF8", borderRadius: "10px",
          border: "1px solid #E8E5DE",
        }}>
          <p style={{ ...dm, fontSize: "14px", color: "#6B7280", margin: "0 0 4px", fontWeight: 600 }}>
            No votes yet
          </p>
          <p style={{ ...dm, fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Share this task to start collecting human preferences
          </p>
        </div>
      )}

      {total > 0 && total < 5 && (
        <div style={{
          textAlign: "center", padding: "12px",
          backgroundColor: "#FAFAF8", borderRadius: "10px",
          border: "1px solid #E8E5DE",
        }}>
          <p style={{ ...dm, fontSize: "13px", color: "#6B7280", margin: 0 }}>
            <span style={{ fontWeight: 600 }}>{5 - total} more votes</span> needed to declare a winner
          </p>
        </div>
      )}

      {/* Creator rating */}
      {((task.creator_rating_up ?? 0) + (task.creator_rating_down ?? 0)) > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", ...dm, fontSize: "13px", color: "#6B7280" }}>
          <span>Task quality:</span>
          <span style={{
            color: "#059669", backgroundColor: "#F0FDF4",
            padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
          }}>
            +{task.creator_rating_up ?? 0}
          </span>
          <span style={{
            color: "#DC2626", backgroundColor: "#FEF2F2",
            padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
          }}>
            -{task.creator_rating_down ?? 0}
          </span>
        </div>
      )}

      {/* Feedback section */}
      {feedbackVotes.length > 0 && (
        <div>
          <button
            onClick={() => setShowFeedback((v) => !v)}
            style={{
              ...dm, fontSize: "13px", fontWeight: 600, color: "#6B7280",
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 0",
              display: "flex", alignItems: "center", gap: "6px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0C0C0C"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
          >
            <span style={{
              transition: "transform 0.2s",
              transform: showFeedback ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block", fontSize: "10px",
            }}>
              ▼
            </span>
            {feedbackVotes.length} feedback response{feedbackVotes.length !== 1 ? "s" : ""}
          </button>

          {showFeedback && (
            <div className="animate-slide-down" style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {feedbackVotes.map((v) => {
                const badge = BADGE_STYLES[v.reputation_badge] ?? BADGE_STYLES.new;
                return (
                  <div key={v.id} style={{
                    backgroundColor: "#FAFAF8", borderRadius: "14px",
                    padding: "16px 18px",
                    border: "1px solid #E8E5DE",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", color: "#9CA3AF" }}>{v.nullifier_prefix}</span>
                        <span style={{
                          fontSize: "11px", fontWeight: 600,
                          color: badge.color, backgroundColor: badge.bg,
                          border: `1px solid ${badge.border}`,
                          borderRadius: "6px", padding: "1px 8px",
                          textTransform: "capitalize",
                        }}>
                          {v.reputation_badge}
                        </span>
                      </div>
                      <span style={{ ...dm, fontSize: "12px", color: "#B8B5AD" }}>
                        {options.find((o) => o.option_index === v.option_index)?.label ?? `#${v.option_index + 1}`}
                      </span>
                    </div>
                    <p style={{ ...dm, fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                      {v.feedback_text}
                    </p>
                    {v.feedback_rating && (
                      <div style={{ marginTop: "8px", display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{
                            fontSize: "14px",
                            color: i < v.feedback_rating! ? "#F59E0B" : "#E5E7EB",
                          }}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Status */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        ...dm, fontSize: "12px", color: "#9CA3AF",
      }}>
        <span style={{
          width: "7px", height: "7px", borderRadius: "100px",
          backgroundColor: task.status === "open" ? "#10B981" : "#9CA3AF",
          boxShadow: task.status === "open" ? "0 0 6px rgba(16, 185, 129, 0.5)" : "none",
          animation: task.status === "open" ? "pulse-soft 2s ease-in-out infinite" : "none",
        }} />
        {task.status === "open"
          ? `Open — ${task.max_workers - total} slots remaining`
          : "Closed"}
      </div>
    </div>
  );
}
