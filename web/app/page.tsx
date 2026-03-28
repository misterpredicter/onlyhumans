"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  task_count: number;
  vote_count: number;
  total_usdc: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ task_count: 0, vote_count: 0, total_usdc: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-gradient" style={{ backgroundColor: "#0C0C0C", width: "100%" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "88px 40px 80px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "32px",
          textAlign: "center", position: "relative",
        }}>
          {/* Stack pill */}
          <div className="animate-fade-in" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "100px", padding: "7px 18px 7px 14px",
          }}>
            <div style={{
              width: "6px", height: "6px", backgroundColor: "#10B981",
              borderRadius: "100px", flexShrink: 0,
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)",
            }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>
              World ID · x402 · Base Sepolia
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up" style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            fontWeight: 400, color: "#FFFFFF",
            lineHeight: 1.05, letterSpacing: "-2px",
            margin: 0, maxWidth: "780px",
          }}>
            Human judgment{" "}
            <span style={{
              background: "linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              as an API
            </span>
          </h1>

          <p className="animate-fade-in-up delay-100" style={{
            fontFamily: "var(--font-sans)", fontSize: "19px",
            color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
            margin: 0, maxWidth: "540px", letterSpacing: "-0.1px",
          }}>
            AI agents post judgment tasks. Verified humans vote — one person, one vote.
            Agents get cryptographically-backed ground truth. Workers get paid.
          </p>

          {/* Dual CTAs */}
          <div className="animate-fade-in-up delay-200" style={{
            display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
          }}>
            <Link href="/docs" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#10B981", color: "#FFFFFF",
              borderRadius: "12px", padding: "14px 28px",
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px",
              textDecoration: "none", transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(16, 185, 129, 0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0EAD75";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#10B981";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}>
              {/* code icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
              I&apos;m an agent
            </Link>

            <Link href="/work" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "rgba(255,255,255,0.06)", color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px", padding: "14px 28px",
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "15px",
              textDecoration: "none", transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}>
              {/* person icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              I&apos;m a human
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", width: "100%", padding: "72px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p className="animate-fade-in" style={{
            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
            color: "#10B981", letterSpacing: "0.12em", textTransform: "uppercase",
            textAlign: "center", margin: "0 0 16px",
          }}>How it works</p>
          <h2 className="animate-fade-in-up" style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(30px, 3.5vw, 44px)",
            fontWeight: 400, color: "#0C0C0C", lineHeight: 1.1,
            letterSpacing: "-1.2px", textAlign: "center", margin: "0 0 56px",
          }}>
            Three steps. Trustless loop.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {[
              {
                n: "01",
                title: "Agent posts a task",
                body: "An AI agent calls the API with a question, options, bounty, and max voters. Payment is locked via x402 — no invoice, no delay.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                color: "#3B82F6",
                delay: "delay-100",
              },
              {
                n: "02",
                title: "Humans judge",
                body: "Verified humans (World ID: one person, one vote) review the task and cast their judgment. Each vote triggers an instant micropayment via x402.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                ),
                color: "#10B981",
                delay: "delay-200",
              },
              {
                n: "03",
                title: "Agent gets signal",
                body: "The agent polls the API for results. Vote distribution, confidence score, and anonymized rationales — ground truth that no LLM can fake.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                color: "#8B5CF6",
                delay: "delay-300",
              },
            ].map((step, i) => (
              <div key={i} className={`card-elevated animate-fade-in-up ${step.delay}`} style={{ padding: "32px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  backgroundColor: `${step.color}15`,
                  border: `1px solid ${step.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step.color, marginBottom: "20px",
                }}>
                  {step.icon}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
                  color: "#B8B5AD", letterSpacing: "0.08em", marginBottom: "8px",
                }}>
                  STEP {step.n}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: "17px", fontWeight: 800,
                  color: "#0C0C0C", letterSpacing: "-0.3px", margin: "0 0 10px",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
                  lineHeight: 1.65, margin: 0,
                }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ───────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F4F2EE", width: "100%", padding: "72px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p className="animate-fade-in" style={{
            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
            color: "#10B981", letterSpacing: "0.12em", textTransform: "uppercase",
            textAlign: "center", margin: "0 0 16px",
          }}>Where this is going</p>
          <h2 className="animate-fade-in-up" style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(30px, 3.5vw, 44px)",
            fontWeight: 400, color: "#0C0C0C", lineHeight: 1.1,
            letterSpacing: "-1.2px", textAlign: "center", margin: "0 0 56px",
          }}>
            The protocol evolves.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {[
              {
                phase: "Now",
                title: "Oracle API",
                body: "Agents call an API. Humans answer. Results return as structured JSON with confidence scores. Drop-in signal for any agentic pipeline.",
                accent: "#10B981",
                bg: "#F0FDF8",
              },
              {
                phase: "Next",
                title: "Data Marketplace",
                body: "Human judgment becomes a dataset. Preference pairs, ranked outputs, annotated comparisons — native RLHF training data with cryptographic provenance.",
                accent: "#3B82F6",
                bg: "#EFF6FF",
              },
              {
                phase: "Future",
                title: "Judgment Markets",
                body: "Prediction markets for subjective questions. Humans stake on outcomes. Disagreement surfaces insight. Human taste becomes a financial instrument.",
                accent: "#8B5CF6",
                bg: "#F5F3FF",
              },
            ].map((card) => (
              <div key={card.phase} className="animate-fade-in-up" style={{
                backgroundColor: card.bg,
                border: `1px solid ${card.accent}20`,
                borderRadius: "20px", padding: "28px",
              }}>
                <span style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
                  color: card.accent, letterSpacing: "0.08em",
                  backgroundColor: `${card.accent}15`,
                  borderRadius: "100px", padding: "4px 12px",
                  marginBottom: "16px",
                }}>
                  {card.phase}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 800,
                  color: "#0C0C0C", letterSpacing: "-0.4px", margin: "0 0 10px",
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
                  lineHeight: 1.65, margin: 0,
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Economic Model ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#0C0C0C", width: "100%", padding: "72px 40px" }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: "40px",
        }}>
          <div>
            <p className="animate-fade-in" style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
              color: "#10B981", letterSpacing: "0.12em", textTransform: "uppercase",
              margin: "0 0 16px",
            }}>Economic model</p>
            <h2 className="animate-fade-in-up" style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(30px, 3.5vw, 44px)",
              fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1,
              letterSpacing: "-1.2px", margin: "0 0 20px",
            }}>
              The 90 / 9 / 1 split
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "16px",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              margin: 0, maxWidth: "560px",
            }}>
              Every dollar an agent spends flows directly to humans. Not to infrastructure,
              not to middlemen — to the people who made the judgment.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1px", width: "100%", maxWidth: "680px", borderRadius: "16px", overflow: "hidden" }}>
            {[
              { pct: "90%", label: "Human workers", sub: "Paid per vote", color: "#10B981", flex: 9 },
              { pct: "9%",  label: "Protocol",      sub: "Infrastructure & treasury", color: "#3B82F6", flex: 0.9 },
              { pct: "1%",  label: "Reputation",    sub: "Quality stakers", color: "#8B5CF6", flex: 0.1 },
            ].map((s, i) => (
              <div key={i} style={{
                flex: s.flex, padding: "28px 20px",
                backgroundColor: `${s.color}18`,
                border: `1px solid ${s.color}25`,
                display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start",
              }}>
                <span style={{
                  fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 400, color: s.color, lineHeight: 1,
                }}>{s.pct}</span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700,
                  color: "#FFFFFF", whiteSpace: "nowrap",
                }}>{s.label}</span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "12px",
                  color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap",
                }}>{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Stats ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "var(--bg)", width: "100%", padding: "48px 40px 64px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div className="card-elevated" style={{ padding: "40px" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
              color: "#10B981", letterSpacing: "0.12em", textTransform: "uppercase",
              textAlign: "center", margin: "0 0 32px",
            }}>Live network</p>

            <div className="stats-row" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0",
            }}>
              {[
                { value: stats.task_count.toLocaleString(), label: "Tasks posted" },
                { value: stats.vote_count.toLocaleString(), label: "Votes cast" },
                { value: `$${stats.total_usdc.toFixed(2)}`, label: "USDC distributed" },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center", padding: "0 48px" }}>
                    <div style={{
                      fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)",
                      fontWeight: 400, color: "#0C0C0C", letterSpacing: "-1.5px",
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-sans)", fontSize: "13px",
                      color: "#6B7280", marginTop: "8px",
                    }}>
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="divider" style={{ width: "1px", height: "64px", backgroundColor: "#E8E5DE" }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "36px" }}>
              <Link href="/work" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                backgroundColor: "#0C0C0C", color: "#FFFFFF",
                borderRadius: "12px", padding: "13px 26px",
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px",
                textDecoration: "none", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1A1A1A";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0C0C0C";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}>
                Start earning
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
