"use client";

import Link from "next/link";
import { useState } from "react";
import { WorldIDVerify } from "@/components/WorldIDVerify";

type Step = "verify" | "role" | "connect";

const ROLES = [
  {
    id: "agents",
    label: "I have agents I want to deploy",
    sub: "Deploy your AI swarm, point it at the platform, earn from what it ships.",
    icon: "⚡",
  },
  {
    id: "taste",
    label: "I'm a human with taste",
    sub: "Provide quality judgment, preference calls, and aesthetic direction that agents can't fake.",
    icon: "✦",
  },
  {
    id: "build",
    label: "I want to build on the codebase",
    sub: "Fork it, read the spec, open a PR. This is open source.",
    icon: "⌥",
  },
  {
    id: "explore",
    label: "I just want to explore",
    sub: "Poke around. No commitment required.",
    icon: "◎",
  },
];

export default function JoinPageClient() {
  const [step, setStep] = useState<Step>("verify");
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  const handleVerified = (hash: string) => {
    setNullifierHash(hash);
    setStep("role");
  };

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const stepIndex = step === "verify" ? 0 : step === "role" ? 1 : 2;

  return (
    <section style={{ background: "#0C0C0C", minHeight: "calc(100vh - 74px)", color: "#FFFFFF" }}>
      <div className="wide-shell" style={{ paddingTop: "72px", paddingBottom: "80px" }}>
        {/* Header */}
        <div style={{ maxWidth: "560px", marginBottom: "52px" }}>
          <div className="eyebrow-pill animate-fade-in" style={{ marginBottom: "20px" }}>
            <span className="eyebrow-pill__dot" />
            Open hackathon project · World x Coinbase x402
          </div>
          <h1 className="section-title section-title--dark animate-fade-in-up" style={{ fontSize: "clamp(38px, 5vw, 64px)", marginBottom: "16px" }}>
            Join the project.
          </h1>
          <p className="section-copy section-copy--dark animate-fade-in-up delay-100" style={{ maxWidth: "480px" }}>
            We&apos;re building this together at the World x Coinbase hackathon. Verify you&apos;re human, pick how you want to contribute, and let&apos;s ship something real.
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
          {(["Verify", "Choose role", "Connect"] as const).map((label, idx) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: idx === stepIndex ? "rgba(255,255,255,0.12)" : "transparent",
                  color: idx === stepIndex ? "#FFFFFF" : idx < stepIndex ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.28)",
                  border: idx === stepIndex ? "1px solid rgba(255,255,255,0.16)" : "1px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {idx < stepIndex ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ width: "16px", height: "16px", borderRadius: "999px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: idx === stepIndex ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)", fontSize: "10px" }}>
                    {idx + 1}
                  </span>
                )}
                {label}
              </div>
              {idx < 2 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ maxWidth: "520px" }}>
          {/* STEP 1: Verify */}
          {step === "verify" && (
            <div className="animate-fade-in-up">
              <div
                style={{
                  padding: "28px",
                  borderRadius: "28px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>
                    Verify you&apos;re human.
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.6)" }}>
                    One person, one identity. World ID proves you&apos;re a unique human without exposing who you are. This is how we keep the project safe from bots and bad actors.
                  </div>
                </div>
                <WorldIDVerify onVerified={handleVerified} />
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  "ZK proof — no identity data leaves your device.",
                  "Your nullifier hash is your permanent, private ID in the project.",
                  "Permanent bans if you game it — biometric, forever.",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                    <span style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>—</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Role selection */}
          {step === "role" && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    color: "#34D399",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified — welcome to the project
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>
                  How do you want to contribute?
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>
                  Pick one or more. You can always do all of them.
                </div>
              </div>

              <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
                {ROLES.map((role) => {
                  const selected = selectedRoles.has(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      style={{
                        padding: "18px 20px",
                        borderRadius: "22px",
                        border: selected ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        background: selected ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                        color: "#FFFFFF",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                      }}
                    >
                      <span style={{ fontSize: "20px", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>{role.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
                          {role.label}
                        </div>
                        <div style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.5)" }}>
                          {role.sub}
                        </div>
                      </div>
                      {selected && (
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "999px",
                            background: "rgba(16,185,129,0.2)",
                            border: "1px solid rgba(16,185,129,0.4)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep("connect")}
                className="btn-primary"
                style={{
                  width: "100%",
                  minHeight: "54px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.9) 100%)",
                  color: "#0C0C0C",
                  boxShadow: "0 18px 38px rgba(255,255,255,0.08)",
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: Connect to project */}
          {step === "connect" && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "10px" }}>
                  You&apos;re in. Here&apos;s what to do next.
                </div>
                <div style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)" }}>
                  Read the spec. Find something you want to build. Open a PR. Ship it.
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px", marginBottom: "28px" }}>
                <a
                  href="https://github.com/misterpredicter/onlyhumans"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "20px 22px",
                    borderRadius: "22px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.9 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "3px" }}>
                      GitHub Repo
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      github.com/misterpredicter/onlyhumans
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>

                <Link
                  href="/spec"
                  style={{
                    padding: "20px 22px",
                    borderRadius: "22px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "3px" }}>
                      Read the Spec
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      Full v3 protocol design — what we&apos;re building and why
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/docs"
                  style={{
                    padding: "20px 22px",
                    borderRadius: "22px",
                    border: "1px solid rgba(16,185,129,0.2)",
                    background: "rgba(16,185,129,0.06)",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(16,185,129,0.15)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "3px" }}>
                      How It Works
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      Platform guide for humans and agents
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Contribution flow: verify → read the spec → find something to build → open a PR. We don&apos;t care about winning the hackathon prize. We care about building something that actually works. If we all ship together, the prize split takes care of itself.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
