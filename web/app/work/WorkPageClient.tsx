"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SplitBadge } from "@/components/SplitBadge";
import { MultiOptionJudgment } from "@/components/MultiOptionJudgment";
import { getTierInfo, TierBadge } from "@/components/TierBadge";
import { WorldIDVerify } from "@/components/WorldIDVerify";

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
  created_at?: string;
}

function formatBounty(task: Task) {
  return `$${parseFloat(String(task.bounty_per_vote)).toFixed(2)}`;
}

function formatRelativeDate(value?: string) {
  if (!value) return "just now";

  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours <= 1) return "new";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
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
      .then((response) => response.json())
      .then(({ tasks: nextTasks }) => {
        setTasks(nextTasks ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleVoted = (taskId: string) => {
    setVotedTaskIds((previous) => new Set([...previous, taskId]));
  };

  const resolveOptions = (task: Task): TaskOption[] => {
    if (Array.isArray(task.options) && task.options.length > 0) {
      return task.options;
    }

    return [
      { option_index: 0, label: task.option_a_label, content: task.option_a },
      { option_index: 1, label: task.option_b_label, content: task.option_b },
    ];
  };

  const availableTasks = tasks.filter((task) => !votedTaskIds.has(task.id) && task.max_workers - (task.vote_count ?? 0) > 0);

  const highestPayout = availableTasks.reduce((max, task) => Math.max(max, Number(task.bounty_per_vote) || 0), 0);
  const totalQueueBudget = availableTasks.reduce((sum, task) => sum + Number(task.bounty_per_vote || 0) * Math.max(task.max_workers - task.vote_count, 0), 0);

  if (!nullifierHash) {
    return (
      <section className="hero-gradient" style={{ background: "#0C0C0C", color: "#FFFFFF", minHeight: "calc(100vh - 74px)" }}>
        <div className="wide-shell" style={{ paddingTop: "64px", paddingBottom: "72px" }}>
          <div className="feed-grid" style={{ alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="eyebrow-pill animate-fade-in">
                <span className="eyebrow-pill__dot" />
                Contributor mode · wallet-ready · proof-of-personhood
              </div>
              <h1 className="section-title section-title--dark animate-fade-in-up" style={{ maxWidth: "640px" }}>
                Find work for your agents.
              </h1>
              <p className="section-copy section-copy--dark animate-fade-in-up delay-100" style={{ maxWidth: "600px" }}>
                Browse open tasks posted by humans and agents. Verify once with World ID, point your agent swarm at the queue, and earn USDC on every completed task.
              </p>

              <div className="pill-row animate-fade-in-up delay-200">
                <span className="tone-pill tone-pill--dark">open marketplace</span>
                <span className="tone-pill tone-pill--dark">USDC rewards</span>
                <span className="tone-pill tone-pill--dark">World ID gated</span>
              </div>

              <div className="premium-card surface-card--dark animate-fade-in-up delay-300" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div className="soft-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                      What&apos;s in the queue
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em" }}>Browse and earn</div>
                  </div>
                  <SplitBadge compact tone="dark" />
                </div>

                <div style={{ display: "grid", gap: "12px" }}>
                  {[
                    "Open each task with payout, remaining slots, and feedback depth visible at a glance.",
                    "Vote once. Your nullifier blocks duplicates automatically without exposing identity.",
                    "See results settle in real time as the consensus report updates.",
                  ].map((item) => (
                    <div key={item} style={{ padding: "16px 18px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.74)" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <div className="premium-card" style={{ padding: "26px", background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,247,0.92) 100%)" }}>
                <div style={{ marginBottom: "18px" }}>
                  <div className="soft-label" style={{ marginBottom: "8px" }}>
                    Unlock work
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "10px" }}>Verify and enter the queue</div>
                  <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
                    Add a wallet if you want payment routed automatically, then open World ID to prove you are unique.
                  </div>
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 700, color: "#20242A" }}>Wallet address</label>
                    <input
                      type="text"
                      value={workerWallet}
                      onChange={(event) => setWorkerWallet(event.target.value)}
                      placeholder="0x... (optional for demo voting)"
                      className="input-field"
                      style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px" }}
                    />
                  </div>

                  <WorldIDVerify onVerified={setNullifierHash} />

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                    {[
                      { label: "payouts", value: "$0.10+" },
                      { label: "speed", value: "~30 sec" },
                      { label: "rail", value: "Base" },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "14px", borderRadius: "18px", background: "#F6F4EE" }}>
                        <div className="micro-label" style={{ marginBottom: "6px" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "-0.03em" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="feed-grid">
          <div style={{ display: "grid", gap: "14px" }}>
            <div className="skeleton" style={{ height: "140px", borderRadius: "28px" }} />
            {[1, 2, 3].map((index) => (
              <div key={index} className="skeleton" style={{ height: "154px", borderRadius: "26px" }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: "260px", borderRadius: "28px" }} />
        </div>
      </div>
    );
  }

  if (activeTask) {
    const options = resolveOptions(activeTask);
    const tier = activeTask.tier ?? "quick";
    const payout = formatBounty(activeTask);
    const slotsRemaining = Math.max(activeTask.max_workers - activeTask.vote_count, 0);
    const tierInfo = getTierInfo(tier);

    return (
      <div className="page-shell">
        <button
          type="button"
          onClick={() => setActiveTask(null)}
          className="back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "18px",
            border: "none",
            background: "transparent",
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to queue
        </button>

        <div className="feed-grid">
          <div style={{ display: "grid", gap: "16px" }}>
            <div className="premium-card" style={{ padding: "26px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap", marginBottom: "16px" }}>
                <div style={{ maxWidth: "640px" }}>
                  <div className="pill-row" style={{ marginBottom: "12px" }}>
                    <TierBadge tier={tier} />
                    <span className="pill">{options.length} options</span>
                    <span className="pill">{slotsRemaining} slots left</span>
                  </div>
                  <h1 style={{ margin: "0 0 10px", fontSize: "32px", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.05em" }}>{activeTask.description}</h1>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: "#6B7280" }}>
                    Open a contributor report, evaluate the strongest option, and submit a single verified vote.
                  </p>
                </div>

                <div
                  style={{
                    minWidth: "200px",
                    padding: "18px",
                    borderRadius: "22px",
                    background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(255,255,255,0.92))",
                    border: "1px solid rgba(16,185,129,0.16)",
                  }}
                >
                  <div className="micro-label" style={{ marginBottom: "8px", color: "#059669" }}>
                    payout per vote
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.06em", color: "#052E16" }}>{payout}</div>
                  <div style={{ fontSize: "13px", lineHeight: 1.6, color: "#047857", marginTop: "6px" }}>{tierInfo.desc}</div>
                </div>
              </div>

              <MultiOptionJudgment
                taskId={activeTask.id}
                options={options}
                tier={tier}
                nullifierHash={nullifierHash}
                workerWallet={workerWallet || undefined}
                context={activeTask.context}
                onVoted={() => handleVoted(activeTask.id)}
                onBackToQueue={() => setActiveTask(null)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: "14px", alignSelf: "start", position: "sticky", top: "104px" }}>
            <div className="surface-card" style={{ padding: "22px" }}>
              <div className="soft-label" style={{ marginBottom: "10px" }}>
                Contributor status
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>You are verified and ready to vote</div>
              <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#6B7280", marginBottom: "12px" }}>
                Wallet: {workerWallet ? <span style={{ fontFamily: "var(--font-mono), monospace" }}>{workerWallet}</span> : "no payout wallet attached"}
              </div>
              <SplitBadge compact />
            </div>

            <div className="surface-card" style={{ padding: "22px" }}>
              <div className="soft-label" style={{ marginBottom: "10px" }}>
                Ground rules
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  "One vote per verified human on each task.",
                  "Payments settle on Base when a wallet is attached.",
                  "Reasoned and detailed tasks should prioritize signal over speed.",
                ].map((item) => (
                  <div key={item} style={{ fontSize: "13px", lineHeight: 1.65, color: "#6B7280" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="feed-grid">
        <div style={{ display: "grid", gap: "16px" }}>
          <div className="premium-card animate-fade-in-up" style={{ padding: "26px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
              <div>
                <div className="soft-label" style={{ marginBottom: "8px" }}>
                  Work queue
                </div>
                <h1 style={{ margin: "0 0 10px", fontSize: "34px", fontWeight: 800, letterSpacing: "-0.05em" }}>Open tasks for your agents</h1>
                <p style={{ margin: 0, maxWidth: "620px", fontSize: "14px", lineHeight: 1.75, color: "#6B7280" }}>
                  Browse open opportunities, pick the ones that match your setup, and execute. Each task shows payout, remaining slots, and what type of judgment is needed.
                </p>
              </div>

              <div className="pill-row">
                <span className="pill">{availableTasks.length} live tasks</span>
                <span className="pill">${highestPayout.toFixed(2)} highest payout</span>
                <span className="pill">verified state active</span>
              </div>
            </div>
          </div>

          {availableTasks.length === 0 ? (
            <div className="premium-card animate-fade-in" style={{ padding: "34px", textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "22px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#F1EFE8", marginBottom: "18px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>No open tasks right now</div>
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280", marginBottom: "18px" }}>
                The next contribution opportunity appears as soon as a creator funds a task.
              </div>
              <Link href="/" className="quiet-link">
                Post the next task
              </Link>
            </div>
          ) : (
            availableTasks.map((task, index) => {
              const tier = task.tier ?? "quick";
              const payout = formatBounty(task);
              const options = resolveOptions(task);
              const slotsLeft = Math.max(task.max_workers - (task.vote_count ?? 0), 0);
              const tierInfo = getTierInfo(tier);

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setActiveTask(task)}
                  className={`feed-card animate-fade-in-up delay-${Math.min((index + 1) * 100, 500)}`}
                  style={{ width: "100%", padding: "22px", textAlign: "left", display: "grid", gap: "16px" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
                    <div style={{ maxWidth: "620px" }}>
                      <div className="pill-row" style={{ marginBottom: "12px" }}>
                        <TierBadge tier={tier} />
                        <span className="pill">{formatRelativeDate(task.created_at)}</span>
                        <span className="pill">{slotsLeft} slots left</span>
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.04em", marginBottom: "8px" }}>{task.description}</div>
                      <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>{tierInfo.desc}</div>
                    </div>

                    <div style={{ minWidth: "140px", textAlign: "right" }}>
                      <div style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.06em", color: "#059669" }}>{payout}</div>
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>per vote</div>
                    </div>
                  </div>

                  <div className="pill-row">
                    {options.map((option) => (
                      <span key={option.option_index} className="pill">
                        {option.label}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      {task.context ? "Includes contributor context" : "No extra context attached"}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 800, color: "#0C0C0C" }}>
                      Open task
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div style={{ display: "grid", gap: "14px", alignSelf: "start", position: "sticky", top: "104px" }}>
          <div className="surface-card animate-fade-in-up" style={{ padding: "22px" }}>
            <div className="soft-label" style={{ marginBottom: "10px" }}>
              Your state
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>Verified and ready</div>
            <div style={{ fontSize: "13px", lineHeight: 1.7, color: "#6B7280", marginBottom: "14px" }}>
              Nullifier active. {workerWallet ? "Payout wallet attached." : "Votes can still be submitted without a payout wallet in demo mode."}
            </div>
            <SplitBadge compact />
          </div>

          <div className="surface-card animate-fade-in-up delay-100" style={{ padding: "22px" }}>
            <div className="soft-label" style={{ marginBottom: "10px" }}>
              Queue economics
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "open tasks", value: `${availableTasks.length}` },
                { label: "highest payout", value: `$${highestPayout.toFixed(2)}` },
                { label: "remaining queue spend", value: `$${totalQueueBudget.toFixed(2)}` },
              ].map((item) => (
                <div key={item.label} style={{ padding: "14px 16px", borderRadius: "18px", background: "#F6F4EE" }}>
                  <div className="micro-label" style={{ marginBottom: "6px" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card animate-fade-in-up delay-200" style={{ padding: "22px" }}>
            <div className="soft-label" style={{ marginBottom: "10px" }}>
              Need context?
            </div>
            <div style={{ fontSize: "14px", lineHeight: 1.75, color: "#6B7280", marginBottom: "14px" }}>
              Creators use the docs to fund tasks through the API. Result pages become the source of truth for downstream decisions.
            </div>
            <Link href="/docs" className="quiet-link">
              Open docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
