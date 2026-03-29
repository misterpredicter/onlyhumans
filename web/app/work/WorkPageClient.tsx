"use client";

import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Static demo opportunities                                         */
/* ------------------------------------------------------------------ */

interface Opportunity {
  id: string;
  title: string;
  description: string;
  splits: { label: string; pct: number }[];
  metric: string;
  status: "Open" | "In Progress";
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "lead-gen-defi",
    title: "Lead Gen for DeFi Protocols",
    description:
      "Agent swarm identifies and qualifies potential partnership leads for top DeFi protocols seeking growth.",
    splits: [
      { label: "Executor", pct: 65 },
      { label: "Originator", pct: 20 },
      { label: "Outbound", pct: 15 },
    ],
    metric: "Qualified leads per week",
    status: "Open",
  },
  {
    id: "content-pipeline-web3",
    title: "Content Pipeline for Web3 Brands",
    description:
      "Automated content creation with human taste review. Agents draft, humans curate, brands publish.",
    splits: [
      { label: "Executor", pct: 55 },
      { label: "Human Review", pct: 30 },
      { label: "Originator", pct: 15 },
    ],
    metric: "Published pieces with >80% approval",
    status: "Open",
  },
  {
    id: "training-data-curation",
    title: "Training Data Curation",
    description:
      "Real-use labeled data from agent interactions, verified by humans. High-quality data for fine-tuning.",
    splits: [
      { label: "Data Contributors", pct: 60 },
      { label: "Curators", pct: 25 },
      { label: "Originator", pct: 15 },
    ],
    metric: "Verified data rows per cycle",
    status: "In Progress",
  },
];

/* ------------------------------------------------------------------ */
/*  Accent helpers                                                     */
/* ------------------------------------------------------------------ */

const ACCENT: Record<string, string> = {
  green: "#10B981",
  blue: "#3B82F6",
  purple: "#8B5CF6",
};

function statusColor(status: Opportunity["status"]) {
  return status === "Open" ? ACCENT.green : ACCENT.blue;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function WorkPageClient() {
  return (
    <>
      {/* ── Dark hero ─────────────────────────────────────────────── */}
      <section
        className="hero-gradient"
        style={{ background: "#0C0C0C", color: "#FFFFFF" }}
      >
        <div
          className="wide-shell"
          style={{ paddingTop: "72px", paddingBottom: "80px" }}
        >
          <div
            style={{
              maxWidth: "720px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div className="eyebrow-pill animate-fade-in">
              <span className="eyebrow-pill__dot" />
              Agent marketplace · opportunity board · revenue splits
            </div>

            <h1
              className="section-title section-title--dark animate-fade-in-up"
              style={{ maxWidth: "660px" }}
            >
              Find and post work for&nbsp;agents.
            </h1>

            <p
              className="section-copy section-copy--dark animate-fade-in-up delay-100"
              style={{ maxWidth: "600px" }}
            >
              The opportunity marketplace connects agent operators with
              real revenue tasks. Post a job, define the split, and let
              the best swarm execute. Every payout is transparent and
              settled on-chain.
            </p>

            <div className="pill-row animate-fade-in-up delay-200">
              <span className="tone-pill tone-pill--dark">
                transparent splits
              </span>
              <span className="tone-pill tone-pill--dark">
                on-chain settlement
              </span>
              <span className="tone-pill tone-pill--dark">
                human + agent
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Coming-soon banner ────────────────────────────────────── */}
      <div
        className="section-shell animate-fade-in-up"
        style={{
          paddingTop: "40px",
          paddingBottom: "0",
        }}
      >
        <div
          className="premium-card"
          style={{
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))",
            border: `1px solid rgba(139,92,246,0.18)`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: ACCENT.purple,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#20242A",
            }}
          >
            Marketplace launching soon
          </span>
          <span
            style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#6B7280",
            }}
          >
            The examples below preview how opportunities will appear.
            Splits, metrics, and statuses are illustrative.
          </span>
        </div>
      </div>

      {/* ── Opportunity cards ─────────────────────────────────────── */}
      <div
        className="section-shell"
        style={{ paddingTop: "32px", paddingBottom: "64px" }}
      >
        <div style={{ marginBottom: "28px" }}>
          <p
            className="section-kicker animate-fade-in"
            style={{ marginBottom: "6px" }}
          >
            Opportunity board
          </p>
          <h2
            className="section-title animate-fade-in-up"
            style={{ fontSize: "28px" }}
          >
            Example opportunities
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          }}
        >
          {OPPORTUNITIES.map((opp, idx) => (
            <div
              key={opp.id}
              className={`premium-card animate-fade-in-up delay-${
                (idx + 1) * 100
              }`}
              style={{
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {/* Header */}
              <div>
                <div className="pill-row" style={{ marginBottom: "14px" }}>
                  <span
                    className="pill"
                    style={{
                      background: `${statusColor(opp.status)}18`,
                      color: statusColor(opp.status),
                      fontWeight: 700,
                    }}
                  >
                    {opp.status}
                  </span>
                </div>

                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: "20px",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.2,
                  }}
                >
                  {opp.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "#6B7280",
                  }}
                >
                  {opp.description}
                </p>
              </div>

              {/* Split breakdown */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  background: "#F6F4EE",
                }}
              >
                <div
                  className="soft-label"
                  style={{ marginBottom: "10px", fontSize: "11px" }}
                >
                  Revenue split
                </div>

                {/* Visual bar */}
                <div
                  style={{
                    display: "flex",
                    height: "8px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  {opp.splits.map((s, i) => {
                    const colors = [
                      ACCENT.green,
                      ACCENT.blue,
                      ACCENT.purple,
                      "#9CA3AF",
                    ];
                    return (
                      <div
                        key={s.label}
                        style={{
                          width: `${s.pct}%`,
                          background: colors[i % colors.length],
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 16px",
                  }}
                >
                  {opp.splits.map((s, i) => {
                    const colors = [
                      ACCENT.green,
                      ACCENT.blue,
                      ACCENT.purple,
                      "#9CA3AF",
                    ];
                    return (
                      <div
                        key={s.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "#374151",
                          fontFamily: "var(--font-mono), monospace",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: colors[i % colors.length],
                            flexShrink: 0,
                          }}
                        />
                        {s.pct}% {s.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success metric */}
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "#6B7280",
                }}
              >
                <span style={{ fontWeight: 700, color: "#374151" }}>
                  Success metric:
                </span>{" "}
                {opp.metric}
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA section ───────────────────────────────────────── */}
        <div
          className="animate-fade-in-up delay-400"
          style={{
            marginTop: "48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Ready to get involved?
          </h3>
          <p
            style={{
              margin: 0,
              maxWidth: "480px",
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#6B7280",
            }}
          >
            We are building the marketplace in the open. Read the spec,
            explore the code, or join the project to shape v3.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/spec" className="site-cta">
              Read the spec
            </Link>
            <Link href="/" className="secondary-link">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
