"use client";

import { useEffect, useState } from "react";
import { WorldIDVerify } from "@/components/WorldIDVerify";
import { MultiOptionJudgment } from "@/components/MultiOptionJudgment";
import { TierBadge } from "@/components/TierBadge";

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
}

function formatBounty(task: Task): string {
  return `$${parseFloat(String(task.bounty_per_vote)).toFixed(2)}`;
}

export default function WorkPage() {
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
        backgroundColor: "var(--bg)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 24px", gap: "32px",
      }}>
        <div style={{
          width: "100%", maxWidth: "440px",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #E8E5DE",
          borderRadius: "24px", padding: "40px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column", gap: "28px",
        }}>
          {/* Icon + heading */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: "linear-gradient(135deg, #10B981, #3B82F6)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: "22px", height: "22px", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "100px" }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 800,
                color: "#0C0C0C", margin: "0 0 10px", letterSpacing: "-0.4px",
              }}>
                Earn USDC for your judgment
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
                Vote on comparisons. Each verified vote earns USDC directly to your wallet. One person, one vote — no bots.
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
              style={{
                width: "100%", backgroundColor: "#F9F8F5",
                border: "1.5px solid #E8E5DE", borderRadius: "12px",
                padding: "12px 16px",
                fontFamily: "var(--font-mono)", fontSize: "13px", color: "#0C0C0C",
                outline: "none",
              }}
            />
          </div>

          {/* World ID */}
          <WorldIDVerify onVerified={setNullifierHash} />

          {/* Trust signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Your identity is never revealed — World ID uses ZK proofs",
              "USDC sent directly to your wallet via x402 on Base",
              "One vote per task, enforced by nullifier hash",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{
                  width: "16px", height: "16px", marginTop: "2px", flexShrink: 0,
                  backgroundColor: "#D1FAE5", borderRadius: "100px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: "6px", height: "6px", backgroundColor: "#059669", borderRadius: "100px" }} />
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#6B7280", lineHeight: 1.5 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          {[
            { value: "$0.10–$0.50", label: "per vote" },
            { value: "~30 sec", label: "per task" },
            { value: "instant", label: "on-chain payout" },
          ].map((stat, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div style={{ width: "1px", height: "32px", backgroundColor: "#E8E5DE", margin: "0 28px" }} />}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "20px", fontWeight: 800, color: "#0C0C0C" }}>{stat.value}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#9CA3AF" }}>{stat.label}</div>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
        <span style={{ fontFamily: "var(--font-sans)", color: "#9CA3AF" }}>Loading tasks...</span>
      </div>
    );
  }

  // ── Active task ─────────────────────────────────────────────────
  if (activeTask) {
    const options = resolveOptions(activeTask);
    const tier = activeTask.tier ?? "quick";
    const payout = formatBounty(activeTask);

    return (
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => setActiveTask(null)} style={{
          fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
          background: "none", border: "none", cursor: "pointer",
          padding: 0, marginBottom: "24px", display: "flex", alignItems: "center", gap: "4px",
        }}>
          ← Back to tasks
        </button>

        {/* Task header */}
        <div style={{
          backgroundColor: "#FFFFFF", border: "1.5px solid #E8E5DE",
          borderRadius: "20px", padding: "24px 28px",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px",
          marginBottom: "16px",
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "20px", fontWeight: 800,
              color: "#0C0C0C", margin: "0 0 6px", letterSpacing: "-0.3px",
            }}>
              {activeTask.description}
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
              {activeTask.max_workers - activeTask.vote_count} slots remaining
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "26px", fontWeight: 900, color: "#059669", letterSpacing: "-0.5px" }}>
              {payout}
            </span>
            <TierBadge tier={tier} />
          </div>
        </div>

        <div style={{
          backgroundColor: "#FFFFFF", border: "1.5px solid #E8E5DE",
          borderRadius: "20px", padding: "24px 28px",
        }}>
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
  const availableTasks = tasks.filter((t) => !votedTaskIds.has(t.id));

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-sans)", fontSize: "26px", fontWeight: 800,
            color: "#0C0C0C", margin: "0 0 4px", letterSpacing: "-0.5px",
          }}>
            Open tasks
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280", margin: 0 }}>
            {availableTasks.length} available · Earn USDC for your judgment
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: "10px", padding: "8px 14px",
        }}>
          <div style={{ width: "7px", height: "7px", backgroundColor: "#10B981", borderRadius: "100px" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "#065F46" }}>
            World ID verified
          </span>
        </div>
      </div>

      {availableTasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "17px", color: "#6B7280", margin: "0 0 8px" }}>
            No open tasks right now
          </p>
          <a href="/" style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "#10B981" }}>
            Post one to get the pool started
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {availableTasks.map((task) => {
            const tier = task.tier ?? "quick";
            const payout = formatBounty(task);
            const opts = resolveOptions(task);
            const slotsLeft = task.max_workers - (task.vote_count ?? 0);

            return (
              <button
                key={task.id}
                onClick={() => setActiveTask(task)}
                style={{
                  width: "100%", textAlign: "left",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #E8E5DE",
                  borderRadius: "16px", padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "16px",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C4C0B8";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E8E5DE";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700,
                    color: "#0C0C0C", margin: "0 0 4px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {task.description}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#9CA3AF", margin: "0 0 10px" }}>
                    {opts.map((o) => o.label).join(" vs ")}
                  </p>
                  <TierBadge tier={tier} />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 800,
                    color: "#059669", margin: "0 0 2px", letterSpacing: "-0.3px",
                  }}>
                    {payout}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
                    {slotsLeft} left
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
