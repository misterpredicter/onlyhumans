"use client";

import { useEffect, useState } from "react";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";
import { WorldIDVerify } from "@/components/WorldIDVerify";
import { MultiOptionJudgment } from "@/components/MultiOptionJudgment";
import { TierBadge } from "@/components/TierBadge";
import { ECONOMICS, calculateWorkerPayout } from "@/lib/economics";

interface TaskOption {
  option_index: number;
  label: string;
  content: string;
}

interface Task {
  id: string;
  description: string;
  option_a: string;
  option_b: string;
  option_a_label: string;
  option_b_label: string;
  bounty_per_vote: number;
  max_workers: number;
  vote_count: number;
  tier?: string;
  context?: string | null;
  options?: TaskOption[];
  idea_contributor_share?: number | string | null;
}

function formatBounty(task: Task): string {
  const ideaContributorShare = Number(
    task.idea_contributor_share ?? ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
  );
  return `$${calculateWorkerPayout(parseFloat(String(task.bounty_per_vote)), ideaContributorShare).toFixed(2)}`;
}

export default function WorkPageClient() {
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);
  const [workerWallet, setWorkerWallet] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [votedTaskIds, setVotedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(({ tasks: t }) => { setTasks(t ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleVoted = (taskId: string) => {
    setVotedTaskIds((prev) => new Set([...prev, taskId]));
    setTimeout(() => setActiveTask(null), 2500);
  };

  const resolveOptions = (task: Task): TaskOption[] => {
    if (Array.isArray(task.options) && task.options.length > 0) return task.options;
    return [
      { option_index: 0, label: task.option_a_label, content: task.option_a },
      { option_index: 1, label: task.option_b_label, content: task.option_b },
    ];
  };

  // ── Verification gate ───────────────────────────────────────────
  if (!nullifierHash) {
    return (
      <div style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#0C0C0C",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 24px", gap: "40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle background gradient */}
        <div style={{
          position: "absolute", top: "-30%", left: "-20%",
          width: "140%", height: "160%",
          background: "radial-gradient(ellipse at 40% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 60% 60%, rgba(59, 130, 246, 0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div className="animate-fade-in-up" style={{
          width: "100%", maxWidth: "440px",
          backgroundColor: "#FFFFFF",
          borderRadius: "28px", padding: "44px 36px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12), 0 24px 80px rgba(0,0,0,0.24)",
          display: "flex", flexDirection: "column", gap: "28px",
          position: "relative",
        }}>
          {/* Icon + heading */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div className="animate-float" style={{
              width: "60px", height: "60px",
              background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
              borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 800,
                color: "#0C0C0C", margin: "0 0 10px", letterSpacing: "-0.5px",
              }}>
                Earn USDC for your judgment
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
                Vote on comparisons. Each verified vote earns USDC directly to your wallet.
              </p>
            </div>
          </div>

          {/* Wallet */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "#374151" }}>
              Your wallet address
            </label>
            <input
              type="text"
              value={workerWallet}
              onChange={(e) => setWorkerWallet(e.target.value)}
              placeholder="0x... (optional — skip to vote without payment)"
              className="input-field"
              style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}
            />
          </div>

          {/* World ID */}
          <WorldIDVerify onVerified={setNullifierHash} />

          {/* Trust signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { text: "Your identity is never revealed — World ID uses ZK proofs", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
              { text: "USDC sent directly to your wallet via x402 on Base", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
              { text: "One vote per task, enforced by nullifier hash", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{
                  width: "28px", height: "28px", marginTop: "0px", flexShrink: 0,
                  backgroundColor: "#F0FDF4", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-in-up delay-200 stats-row" style={{ display: "flex", alignItems: "center", gap: "0" }}>
          {[
            { value: "$0.07-$0.45", label: "worker pay" },
            { value: "~30 sec", label: "per task" },
            { value: "visible", label: "split before you vote" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div className="divider" style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.1)", margin: "0 32px" }} />}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.3px" }}>{stat.value}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        maxWidth: "680px", margin: "0 auto", padding: "40px 24px",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <div className="skeleton" style={{ height: "28px", width: "180px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "16px", width: "240px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              backgroundColor: "#FFFFFF", border: "1px solid #E8E5DE",
              borderRadius: "16px", padding: "20px 24px",
            }}>
              <div className="skeleton" style={{ height: "18px", width: "60%", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "12px" }} />
              <div className="skeleton" style={{ height: "22px", width: "80px", borderRadius: "100px" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Active task ─────────────────────────────────────────────────
  if (activeTask) {
    const options = resolveOptions(activeTask);
    const tier = activeTask.tier ?? "quick";
    const payout = formatBounty(activeTask);
    const ideaContributorShare = Number(
      activeTask.idea_contributor_share ?? ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
    );

    return (
      <div className="animate-fade-in" style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => setActiveTask(null)} style={{
          fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
          background: "none", border: "none", cursor: "pointer",
          padding: "4px 0", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px",
          transition: "color 0.15s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#0C0C0C"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to tasks
        </button>

        {/* Task header */}
        <div className="card-elevated" style={{
          padding: "28px 32px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px",
          marginBottom: "16px",
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 800,
              color: "#0C0C0C", margin: "0 0 6px", letterSpacing: "-0.4px",
            }}>
              {activeTask.description}
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
              {activeTask.max_workers - activeTask.vote_count} slots remaining
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "28px", fontWeight: 900,
              color: "#059669", letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              {payout}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#9CA3AF" }}>
              to you
            </span>
            <TierBadge tier={tier} />
          </div>
        </div>

        <div className="card-elevated" style={{ padding: "28px 32px" }}>
          <div style={{ marginBottom: "18px" }}>
            <EconomicsBreakdown
              taskRevenue={parseFloat(String(activeTask.bounty_per_vote))}
              ideaContributorShare={ideaContributorShare}
              maxWorkers={activeTask.max_workers}
              title="What this vote pays"
              subtitle="The split is transparent before you commit your attention."
            />
          </div>
          <MultiOptionJudgment
            taskId={activeTask.id}
            options={options}
            tier={tier}
            nullifierHash={nullifierHash}
            workerWallet={workerWallet || undefined}
            context={activeTask.context}
            onVoted={() => handleVoted(activeTask.id)}
          />
        </div>
      </div>
    );
  }

  // ── Task list ───────────────────────────────────────────────────
  const availableTasks = tasks.filter((t) => !votedTaskIds.has(t.id) && (t.max_workers - (t.vote_count ?? 0)) > 0);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "28px", fontWeight: 800,
            color: "#0C0C0C", margin: "0 0 4px", letterSpacing: "-0.6px",
          }}>
            Open tasks
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280", margin: 0 }}>
            {availableTasks.length} available
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5",
          borderRadius: "12px", padding: "8px 14px",
        }}>
          <div style={{
            width: "7px", height: "7px", backgroundColor: "#10B981", borderRadius: "100px",
            boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
          }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "#065F46" }}>
            Verified
          </span>
        </div>
      </div>

      {availableTasks.length === 0 ? (
        <div className="animate-fade-in" style={{
          textAlign: "center", padding: "80px 40px",
          backgroundColor: "#FFFFFF", border: "1px solid #E8E5DE",
          borderRadius: "20px",
        }}>
          <div style={{
            width: "56px", height: "56px", margin: "0 auto 20px",
            backgroundColor: "#F5F4F0", borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 600, color: "#374151", margin: "0 0 6px" }}>
            No open tasks right now
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#9CA3AF", margin: "0 0 20px" }}>
            Check back soon or create one to get the pool started
          </p>
          <a href="/" style={{
            fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
            color: "#FFFFFF", backgroundColor: "#10B981",
            textDecoration: "none", padding: "10px 20px", borderRadius: "10px",
            display: "inline-block",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#059669";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#10B981";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Post a task
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {availableTasks.map((task, idx) => {
            const tier = task.tier ?? "quick";
            const payout = formatBounty(task);
            const opts = resolveOptions(task);
            const slotsLeft = task.max_workers - (task.vote_count ?? 0);
            const ideaContributorShare = Number(
              task.idea_contributor_share ?? ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
            );

            return (
              <button
                key={task.id}
                onClick={() => setActiveTask(task)}
                className="card-interactive animate-fade-in-up"
                style={{
                  width: "100%", textAlign: "left",
                  padding: "22px 24px",
                  display: "flex", alignItems: "center", gap: "16px",
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700,
                    color: "#0C0C0C", margin: "0 0 5px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    letterSpacing: "-0.2px",
                  }}>
                    {task.description}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#9CA3AF", margin: "0 0 10px" }}>
                    {opts.map((o) => o.label).join(" vs ")}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <TierBadge tier={tier} />
                    <span style={{
                      fontFamily: "var(--font-sans)", fontSize: "11px", color: "#B8B5AD",
                    }}>
                      {slotsLeft} slots left
                    </span>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <EconomicsBreakdown
                      taskRevenue={parseFloat(String(task.bounty_per_vote))}
                      ideaContributorShare={ideaContributorShare}
                      compact={true}
                      showFooter={false}
                      title="Visible economics"
                    />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "24px", fontWeight: 800,
                    color: "#059669", margin: "0 0 2px", letterSpacing: "-0.3px",
                    lineHeight: 1,
                  }}>
                    {payout}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "#B8B5AD", margin: 0 }}>
                    to you
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
