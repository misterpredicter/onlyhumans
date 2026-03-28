"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";
import { LeaderboardPanel } from "@/components/LeaderboardPanel";
import { SplitBadge } from "@/components/SplitBadge";
import { TaskCreator } from "@/components/TaskCreator";

interface Stats {
  task_count: number;
  vote_count: number;
  total_usdc: number;
}

const STORY_STEPS = [
  {
    title: "Create a task like an API call",
    body: "Set the judgment prompt, attach the options, configure revenue per vote, and let x402 lock the spend at creation time.",
    accent: "#10B981",
  },
  {
    title: "Verified humans do the hard part",
    body: "World ID enforces one-person-one-vote. Real contributors add taste, context, and disagreement that models cannot hallucinate, and the split is visible before they commit.",
    accent: "#3B82F6",
  },
  {
    title: "Consensus flows back into the stack",
    body: "Your task page becomes a live report with distribution, confidence, and contributor rationale ready for humans or agents to consume.",
    accent: "#8B5CF6",
  },
];

const USE_CASES = [
  "RLHF pair ranking for model outputs",
  "Creative direction and landing-page testing",
  "Trust and safety edge-case escalation",
  "Agent handoff when a judgment boundary appears",
];

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ task_count: 0, vote_count: 0, total_usdc: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero-gradient" style={{ background: "#0C0C0C", color: "#FFFFFF" }}>
        <div className="wide-shell" style={{ paddingTop: "72px" }}>
          <div className="hero-shell">
            <div className="hero-copy">
              <div className="eyebrow-pill animate-fade-in">
                <span className="eyebrow-pill__dot" />
                World ID verified · x402 funded · live consensus API
              </div>

              <div className="animate-fade-in-up">
                <h1 className="section-title section-title--dark" style={{ maxWidth: "760px" }}>
                  Verified human judgment, packaged like infrastructure.
                </h1>
              </div>

              <p className="section-copy section-copy--dark animate-fade-in-up delay-100" style={{ maxWidth: "620px" }}>
                OnlyHumans gives agents a clean escape hatch for taste, preference, and ambiguity. Post a task, pay through
                x402, route it to unique humans, and get a structured result back with confidence.
              </p>

              <div className="hero-actions animate-fade-in-up delay-200">
                <Link href="#launch" className="primary-link">
                  Launch a task
                </Link>
                <Link href="/docs" className="secondary-link">
                  Read the docs
                </Link>
                <Link href="/work" className="secondary-link">
                  Earn USDC
                </Link>
              </div>

              <div className="pill-row animate-fade-in-up delay-300">
                {[
                  "No accounts required for agents",
                  "One person, one vote",
                  "Results stream into your product instantly",
                ].map((item) => (
                  <span key={item} className="tone-pill tone-pill--dark">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-in-up delay-200">
              <div className="premium-card surface-card--dark" style={{ padding: "26px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap", marginBottom: "18px" }}>
                  <div>
                    <div className="soft-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                      protocol snapshot
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em" }}>What judges need in 10 seconds</div>
                  </div>
                  <SplitBadge compact tone="dark" />
                </div>

                <div style={{ display: "grid", gap: "14px", marginBottom: "18px" }}>
                  <div style={{ padding: "18px", borderRadius: "22px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="micro-label" style={{ color: "rgba(255,255,255,0.52)", marginBottom: "8px" }}>
                      example task
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.25, marginBottom: "10px" }}>
                      Which landing page makes the company feel more premium?
                    </div>
                    <div className="pill-row">
                      <span className="tone-pill tone-pill--dark">$0.18 revenue / vote</span>
                      <span className="tone-pill tone-pill--dark">20 contributors</span>
                      <span className="tone-pill tone-pill--dark">reasoned feedback</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                    {[
                      { label: "tasks", value: stats.task_count.toLocaleString() },
                      { label: "votes", value: stats.vote_count.toLocaleString() },
                      { label: "revenue", value: formatMoney(stats.total_usdc) },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "16px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="micro-label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.05em" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "18px", borderRadius: "22px", background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(59,130,246,0.16))", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "8px" }}>Why this matters</div>
                  <div style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.72)" }}>
                    OnlyHumans is not another survey tool. It is an execution layer for decisions that models cannot safely fake: taste, credibility, clarity, and edge-case judgment.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="section-shell">
          <div className="metric-grid">
            {[
              { label: "tasks launched", value: stats.task_count.toLocaleString(), sub: "Requests routed into the network" },
              { label: "verified votes", value: stats.vote_count.toLocaleString(), sub: "Unique human decisions recorded" },
              { label: "revenue processed", value: formatMoney(stats.total_usdc), sub: "Spend already routed through the protocol" },
            ].map((metric) => (
              <div key={metric.label} className="metric-card premium-card animate-fade-in-up">
                <div className="soft-label">{metric.label}</div>
                <p className="metric-card__value">{metric.value}</p>
                <p className="metric-card__label">{metric.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell">
          <p className="section-kicker">How it works</p>
          <h2 className="section-title" style={{ fontSize: "clamp(34px, 4vw, 52px)", marginBottom: "14px" }}>
            Three moves. Zero ambiguity about the flow.
          </h2>
          <p className="section-copy" style={{ maxWidth: "680px", marginBottom: "24px" }}>
            The homepage should be enough for a judge or developer to understand the product. This is the loop: fund, verify, resolve.
          </p>

          <div className="story-grid">
            {STORY_STEPS.map((step, index) => (
              <div key={step.title} className={`surface-card animate-fade-in-up delay-${(index + 1) * 100}`} style={{ padding: "22px" }}>
                <div
                    style={{
                      width: "42px",
                      height: "42px",
                    borderRadius: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${step.accent}16`,
                    color: step.accent,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  0{index + 1}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>{step.title}</div>
                <div style={{ fontSize: "14px", lineHeight: 1.75, color: "#6B7280" }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell">
          <div className="feed-grid">
            <div className="premium-card" style={{ padding: "26px" }}>
              <p className="section-kicker">Built for pressure</p>
              <h2 className="section-title" style={{ fontSize: "clamp(32px, 3.4vw, 46px)", marginBottom: "12px" }}>
                When agents hit a judgment boundary, the handoff needs taste.
              </h2>
              <p className="section-copy" style={{ marginBottom: "20px" }}>
                The product needs to feel native to both sides: a programmable interface for builders and a premium, trustworthy feed for contributors.
              </p>

              <div style={{ display: "grid", gap: "12px" }}>
                {USE_CASES.map((item) => (
                  <div key={item} style={{ padding: "16px 18px", borderRadius: "18px", background: "#F8F7F3", border: "1px solid rgba(12,12,12,0.06)", fontSize: "14px", fontWeight: 700, color: "#20242A" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div className="surface-card" style={{ padding: "22px", background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(255,255,255,0.88))" }}>
                <div className="soft-label" style={{ marginBottom: "8px" }}>
                  Agent mode
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>Clean docs and copy-pasteable endpoints</div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
                  The docs page acts like a proper product surface, not a hackathon note dump.
                </div>
              </div>

              <div className="surface-card" style={{ padding: "22px", background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(255,255,255,0.88))" }}>
                <div className="soft-label" style={{ marginBottom: "8px" }}>
                  Contributor mode
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>A feed worth scrolling</div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
                  Verification feels like opening a door, then the work queue keeps momentum with payout, context, and clear next actions.
                </div>
              </div>

              <div className="surface-card" style={{ padding: "22px", background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(255,255,255,0.88))" }}>
                <div className="soft-label" style={{ marginBottom: "8px" }}>
                  Results mode
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>Consensus rendered like a report</div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#6B7280" }}>
                  Task pages show confidence, distribution, and contributor reasoning so the output feels decision-ready.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-shell">
          <div className="feed-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <p className="section-kicker">Economics</p>
                <h2 className="section-title" style={{ fontSize: "clamp(34px, 4vw, 52px)", marginBottom: "12px" }}>
                  The split is visible because the split is the market.
                </h2>
                <p className="section-copy">
                  90% goes to contributors. 9% funds the platform. 1% goes to the founder. Inside the 90%, idea contributors set their own take rate and workers decide whether the task is worth their attention.
                </p>
              </div>

              <div className="callout-card" style={{ background: "#F5F9F6", color: "#0F5132" }}>
                <div style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
                  Why this is different
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.75 }}>
                  No hidden margin. No tokenomics maze. No governance theatre. Just a fixed constitution and a visible market inside it.
                </div>
              </div>

              <div className="pill-row">
                <span className="pill">Workers choose with attention</span>
                <span className="pill">Idea contributors price their framing</span>
                <span className="pill">Leaderboards create pressure</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <EconomicsBreakdown
                taskRevenue={0.18}
                ideaContributorShare={0.05}
                maxWorkers={20}
                title="Example task split"
                subtitle="At a 5% idea take, workers receive 85.5% of total revenue overall."
              />
              <Link href="/economics" className="secondary-link" style={{ alignSelf: "flex-start" }}>
                See the full economics
              </Link>
            </div>
          </div>
        </div>

        <div className="section-shell">
          <LeaderboardPanel title="Competitive pressure" limit={4} />
        </div>

        <div id="launch" className="section-shell">
          <div className="feed-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <p className="section-kicker">Launch</p>
                <h2 className="section-title" style={{ fontSize: "clamp(34px, 4vw, 52px)", marginBottom: "12px" }}>
                  Post a task that feels worth answering.
                </h2>
                <p className="section-copy">
                  The creation flow should feel consequential, not utilitarian. You are commissioning judgment from real people and funding it upfront.
                </p>
              </div>

              <div className="callout-card">
                <div style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
                  What good creators do
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.75, color: "#065F46" }}>
                  Give contributors enough context to understand the tradeoff. Pay enough to attract care. Use reasoned or detailed tasks when the “why” matters as much as the vote itself.
                </div>
              </div>

              <div className="pill-row">
                <span className="pill">Task creation is x402-gated</span>
                <span className="pill">Results page updates live</span>
                <span className="pill">Judges may demo on mobile</span>
              </div>
            </div>

            <div>
              <TaskCreator />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
