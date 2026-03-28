"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SplitBadge } from "@/components/SplitBadge";
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
  consensus?: {
    agreement_score?: number;
  };
}

interface Props {
  taskId: string;
}

const BADGE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  platinum: { color: "#475569", bg: "#F8FAFC", border: "#E2E8F0" },
  gold: { color: "#A16207", bg: "#FEFCE8", border: "#FDE68A" },
  silver: { color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  bronze: { color: "#C2410C", bg: "#FFF7ED", border: "#FED7AA" },
  new: { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" },
};

const BAR_GRADIENTS = [
  "linear-gradient(90deg, #10B981 0%, #14B8A6 100%)",
  "linear-gradient(90deg, #3B82F6 0%, #6366F1 100%)",
  "linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)",
  "linear-gradient(90deg, #F59E0B 0%, #F97316 100%)",
  "linear-gradient(90deg, #14B8A6 0%, #06B6D4 100%)",
  "linear-gradient(90deg, #84CC16 0%, #22C55E 100%)",
];

function isImage(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

function formatPct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ResultsDashboard({ taskId }: Props) {
  const [data, setData] = useState<TaskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(true);

  useEffect(() => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
          setError("Task not found");
          return;
        }

        setError(null);
        setData(await response.json());
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
      <div style={{ padding: "18px", borderRadius: "20px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", fontSize: "14px" }}>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "grid", gap: "18px" }}>
        <div className="skeleton" style={{ height: "180px", borderRadius: "28px" }} />
        <div className="docs-grid-2col">
          <div className="skeleton" style={{ height: "260px", borderRadius: "26px" }} />
          <div className="skeleton" style={{ height: "260px", borderRadius: "26px" }} />
        </div>
        <div className="skeleton" style={{ height: "320px", borderRadius: "28px" }} />
      </div>
    );
  }

  const { task, results } = data;
  const options =
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
  const total = results.total_votes;
  const agreementScore = data.consensus?.agreement_score ?? results.confidence;
  const feedbackVotes = (data.recent_votes ?? []).filter((vote) => vote.feedback_text);

  const winnerLabel =
    results.winner === null
      ? null
      : results.winner === "tie"
        ? "Tie"
        : typeof results.winner === "number"
          ? options.find((option) => option.option_index === results.winner)?.label ?? `Option ${Number(results.winner) + 1}`
          : results.winner === "A"
            ? options[0]?.label
            : options[1]?.label;

  const statusLabel =
    total === 0 ? "Collecting first vote" : results.winner === null ? "Building confidence" : results.winner === "tie" ? "Currently tied" : "Winner identified";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        className="premium-card"
        style={{
          padding: "28px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,247,0.88) 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "680px" }}>
            <div className="pill-row" style={{ marginBottom: "14px" }}>
              <span className="pill">{task.status === "open" ? "Open task" : "Closed task"}</span>
              {task.tier && <TierBadge tier={task.tier} size="md" />}
            </div>
            <h2 style={{ margin: "0 0 10px", fontSize: "30px", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.05em" }}>{task.description}</h2>
            {task.context && (
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: "#6B7280", maxWidth: "620px" }}>{task.context}</p>
            )}
          </div>

          <div style={{ display: "grid", gap: "10px", minWidth: "250px" }}>
            <SplitBadge compact />
            <div style={{ padding: "14px 16px", borderRadius: "20px", background: "#0C0C0C", color: "#FFFFFF" }}>
              <div className="micro-label" style={{ marginBottom: "8px", color: "rgba(255,255,255,0.52)" }}>
                bounty per vote
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em" }}>${task.bounty_per_vote.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="docs-grid-2col">
        <div
          className="surface-card"
          style={{
            padding: "26px",
            display: "grid",
            gridTemplateColumns: "180px minmax(0, 1fr)",
            gap: "22px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "999px",
              background: `conic-gradient(#10B981 0 ${(results.confidence || 0) * 360}deg, #E8E5DE ${(results.confidence || 0) * 360}deg 360deg)`,
              padding: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div className="micro-label">confidence</div>
              <div style={{ fontSize: "34px", fontWeight: 800, letterSpacing: "-0.06em" }}>{formatPct(results.confidence)}</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>{statusLabel}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <div className="soft-label" style={{ marginBottom: "8px" }}>
                Consensus snapshot
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "6px" }}>
                {winnerLabel ? winnerLabel : results.winner === "tie" ? "No current winner" : "Still collecting signal"}
              </div>
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
                {total === 0
                  ? "No verified votes have landed yet."
                  : results.winner === null
                    ? "The task is live, but there are not enough votes to declare a winner."
                    : results.winner === "tie"
                      ? "Contributors are split. More votes should increase confidence."
                      : `${formatPct(results.confidence)} of verified contributors currently prefer this option.`}
              </div>
            </div>

            <div className="pill-row">
              <span className="pill">{results.verified_workers} verified humans</span>
              <span className="pill">{formatPct(agreementScore)} agreement</span>
              <span className="pill">{Math.max(task.max_workers - total, 0)} slots left</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {[
            { label: "verified votes", value: `${total}`, tone: "#10B981", bg: "rgba(16,185,129,0.08)" },
            { label: "USDC distributed", value: `$${results.total_paid_usdc.toFixed(2)}`, tone: "#1D4ED8", bg: "rgba(59,130,246,0.08)" },
            { label: "task quality", value: `${(task.creator_rating_up ?? 0) - (task.creator_rating_down ?? 0)}`, tone: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
          ].map((item) => (
            <div key={item.label} className="surface-card" style={{ padding: "22px", background: item.bg }}>
              <div className="micro-label" style={{ marginBottom: "10px", color: item.tone }}>
                {item.label}
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em", color: "#0C0C0C" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card" style={{ padding: "24px", display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div className="soft-label" style={{ marginBottom: "8px" }}>
              Distribution
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em" }}>How the verified crowd is leaning</div>
          </div>

          <div className="pill-row">
            <span className="pill">Task ID {taskId.slice(0, 8)}</span>
            <span className="pill">{task.status === "open" ? "Live polling" : "Finalized"}</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {options.map((option, index) => {
            const count = votesByOption[option.option_index] ?? 0;
            const pct = total > 0 ? count / total : 0;
            const isWinner =
              results.winner !== null &&
              results.winner !== "tie" &&
              ((typeof results.winner === "number" && results.winner === option.option_index) ||
                (results.winner === "A" && option.option_index === 0) ||
                (results.winner === "B" && option.option_index === 1));

            return (
              <div
                key={option.option_index}
                style={{
                  padding: "18px",
                  borderRadius: "22px",
                  border: `1px solid ${isWinner ? "rgba(16,185,129,0.26)" : "rgba(12,12,12,0.08)"}`,
                  background: isWinner ? "linear-gradient(180deg, rgba(240,253,244,0.95) 0%, rgba(255,255,255,0.9) 100%)" : "rgba(255,255,255,0.86)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
                  <div>
                    <div className="micro-label" style={{ marginBottom: "6px" }}>
                      option {String.fromCharCode(65 + index)}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em" }}>{option.label}</div>
                  </div>

                  <div className="pill-row">
                    {isWinner && <span className="pill" style={{ color: "#047857", borderColor: "#A7F3D0", background: "#F0FDF4" }}>winner</span>}
                    <span className="pill">{count} votes</span>
                    <span className="pill">{Math.round(pct * 100)}%</span>
                  </div>
                </div>

                <div style={{ height: "16px", borderRadius: "999px", background: "#F1EFE8", overflow: "hidden", marginBottom: "14px" }}>
                  <div className="progress-bar animate-bar-fill" style={{ width: `${Math.max(pct * 100, total > 0 ? 4 : 0)}%`, height: "100%", background: BAR_GRADIENTS[index % BAR_GRADIENTS.length], borderRadius: "999px" }} />
                </div>

                {option.content && (
                  isImage(option.content) ? (
                    <div style={{ position: "relative", width: "100%", height: "220px", borderRadius: "18px", overflow: "hidden", background: "#F1EFE8" }}>
                      <Image src={option.content} alt={option.label} fill className="object-contain" unoptimized />
                    </div>
                  ) : (
                    <div style={{ padding: "14px 16px", borderRadius: "18px", background: "#F8F7F3", border: "1px solid rgba(12,12,12,0.06)", fontSize: "13px", lineHeight: 1.7, color: "#4B5563" }}>
                      {option.content}
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="surface-card" style={{ padding: "24px", display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <div className="soft-label" style={{ marginBottom: "8px" }}>
              Contributor feedback
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em" }}>Why people voted the way they did</div>
          </div>

          <button type="button" className="btn-secondary" onClick={() => setShowFeedback((value) => !value)}>
            {showFeedback ? "Hide" : "Show"} feedback
          </button>
        </div>

        {feedbackVotes.length === 0 ? (
          <div style={{ padding: "18px", borderRadius: "20px", background: "#F8F7F3", border: "1px solid rgba(12,12,12,0.06)", fontSize: "13px", color: "#6B7280" }}>
            No written feedback yet. Use reasoned or detailed tasks to collect explanations in addition to votes.
          </div>
        ) : (
          showFeedback && (
            <div style={{ display: "grid", gap: "12px" }}>
              {feedbackVotes.map((vote) => {
                const badge = BADGE_STYLES[vote.reputation_badge] ?? BADGE_STYLES.new;

                return (
                  <div key={vote.id} style={{ padding: "18px", borderRadius: "20px", border: "1px solid rgba(12,12,12,0.08)", background: "rgba(255,255,255,0.84)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                      <div className="pill-row">
                        <span className="pill" style={{ fontFamily: "var(--font-mono), monospace" }}>{vote.nullifier_prefix}</span>
                        <span className="pill" style={{ color: badge.color, background: badge.bg, borderColor: badge.border, textTransform: "capitalize" }}>
                          {vote.reputation_badge}
                        </span>
                        <span className="pill">{options.find((option) => option.option_index === vote.option_index)?.label ?? `Option ${vote.option_index + 1}`}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: "#8A8F98" }}>{formatDate(vote.voted_at)}</span>
                    </div>

                    <div style={{ fontSize: "14px", lineHeight: 1.8, color: "#374151", whiteSpace: "pre-line" }}>{vote.feedback_text}</div>

                    {vote.feedback_rating && (
                      <div style={{ marginTop: "12px", display: "flex", gap: "2px" }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index} style={{ color: index < vote.feedback_rating! ? "#F59E0B" : "#E5E7EB", fontSize: "14px" }}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
