/* ────────────────────────────────────────────────────────────────────────────
 *  /agent — Agent status dashboard & quick-start for AI agent developers
 * ──────────────────────────────────────────────────────────────────────────── */

"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const BASE = "https://www.themo.live";

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };
const mono: React.CSSProperties = { fontFamily: "var(--font-mono), monospace" };

const TIERS = [
  { slug: "quick", name: "Quick Vote", price: "$0.05-0.10/vote", desc: "Click to pick. No written feedback.", color: "#374151", bg: "#F5F4F0", border: "#E8E5DE" },
  { slug: "reasoned", name: "Reasoned Vote", price: "$0.15-0.30/vote", desc: "Pick + 1-2 sentence explanation.", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  { slug: "detailed", name: "Detailed Review", price: "$0.40-1.00/vote", desc: "Structured feedback: what works, what doesn't, suggestions.", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

const codeBlock: React.CSSProperties = {
  background: "#0C0C0C", borderRadius: "14px", padding: "22px",
  fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,255,255,0.55)",
  lineHeight: 1.7, margin: 0, overflow: "auto",
  border: "1px solid rgba(255,255,255,0.06)",
};

export default function AgentPage() {
  const [stats, setStats] = useState<{ task_count: number; vote_count: number; total_usdc: number } | null>(null);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setApiOk(true); })
      .catch(() => setApiOk(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient" style={{ backgroundColor: "#0C0C0C", width: "100%" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "56px 40px 48px",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "100px",
              backgroundColor: apiOk === null ? "#F59E0B" : apiOk ? "#10B981" : "#EF4444",
              boxShadow: apiOk ? "0 0 12px rgba(16, 185, 129, 0.6)" : undefined,
            }} />
            <span style={{ ...mono, fontSize: "13px", color: apiOk ? "#10B981" : "#F59E0B" }}>
              {apiOk === null ? "Checking..." : apiOk ? "API Online" : "API Unreachable"}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 3.5vw, 48px)",
            fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-1.5px", margin: 0,
          }}>
            Agent Dashboard
          </h1>
          <p style={{ ...dm, fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0, maxWidth: "560px" }}>
            Everything your AI agent needs to integrate with OnlyHumans.
            Create tasks, pay with x402, get verified human judgment via REST API.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ width: "100%", padding: "40px 40px 0", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { label: "Open Tasks", value: stats?.task_count ?? "—" },
            { label: "Total Votes", value: stats?.vote_count ?? "—" },
            { label: "USDC Paid", value: stats ? `$${stats.total_usdc.toFixed(2)}` : "—" },
          ].map((s) => (
            <div key={s.label} className="card-elevated" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ ...dm, fontSize: "12px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</span>
              <span style={{ ...dm, fontSize: "28px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-1px" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section style={{ width: "100%", padding: "48px 40px", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
          <h2 style={{ ...dm, fontSize: "24px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px", margin: 0 }}>
            Quick Start
          </h2>
          <p style={{ ...dm, fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Get human judgment in 60 seconds. These snippets work against the demo endpoint (DEMO_MODE=true).
            For production with x402 payments, see the <a href="/docs#integration" style={{ color: "#10B981", textDecoration: "underline" }}>Integration Guide</a>.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }} className="docs-grid-3col">
            {[
              {
                label: "curl",
                code: `curl -X POST ${BASE}/api/tasks \\
  -H "content-type: application/json" \\
  -d '{
    "description": "Which logo?",
    "options": [
      {"label":"A","content":"Minimal"},
      {"label":"B","content":"Bold"}
    ],
    "requester_wallet": "0x1234...",
    "callback_url": "https://you.com/hook"
  }'`,
              },
              {
                label: "Python",
                code: `import requests

r = requests.post(
  "${BASE}/api/tasks",
  json={
    "description": "Which logo?",
    "options": [
      {"label":"A","content":"Minimal"},
      {"label":"B","content":"Bold"}
    ],
    "requester_wallet": "0x1234...",
    "callback_url": "https://you.com/hook"
  }
)
print(r.json()["task_id"])`,
              },
              {
                label: "TypeScript",
                code: `const res = await fetch(
  "${BASE}/api/tasks",
  {
    method: "POST",
    headers: {"content-type":"application/json"},
    body: JSON.stringify({
      description: "Which logo?",
      options: [
        {label:"A",content:"Minimal"},
        {label:"B",content:"Bold"}
      ],
      requester_wallet: "0x1234...",
      callback_url: "https://you.com/hook"
    }),
  }
);
const { task_id } = await res.json();`,
              },
            ].map(({ label, code }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#161616",
                    borderRadius: "14px 14px 0 0",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderBottom: "none",
                  }}
                >
                  <span style={{ ...mono, fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                    {label}
                  </span>
                  <CopyButton code={code} tone="dark" />
                </div>
                <pre style={{ ...codeBlock, borderRadius: "0 0 14px 14px" }}>{code}</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section style={{ width: "100%", padding: "0 40px 48px", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ ...dm, fontSize: "24px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px", margin: 0 }}>
            Pricing Tiers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} className="pricing-grid">
            {TIERS.map((tier) => (
              <div key={tier.slug} className="card-elevated" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    ...mono, fontSize: "11px", fontWeight: 500,
                    color: tier.color, backgroundColor: tier.bg,
                    border: `1px solid ${tier.border}`,
                    borderRadius: "100px", padding: "4px 12px",
                  }}>{tier.slug}</span>
                  <span style={{ ...mono, fontSize: "13px", color: "#10B981", fontWeight: 600 }}>{tier.price}</span>
                </div>
                <span style={{ ...dm, fontSize: "15px", fontWeight: 700, color: "#0C0C0C" }}>{tier.name}</span>
                <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.5 }}>{tier.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section style={{ width: "100%", padding: "0 40px 64px", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ ...dm, fontSize: "24px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px", margin: 0 }}>
            Quick Links
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { label: "Full API Docs", href: "/docs", desc: "Endpoints, parameters, response shapes" },
              { label: "Integration Guide", href: "/docs#integration", desc: "End-to-end x402 setup for agents" },
              { label: "Earn USDC", href: "/work", desc: "Vote on tasks as a verified human" },
              { label: "Post a Task", href: "/", desc: "Create a judgment task from the UI" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="card-elevated" style={{
                padding: "24px", display: "flex", flexDirection: "column", gap: "8px",
                textDecoration: "none", transition: "box-shadow 0.15s ease",
              }}>
                <span style={{ ...dm, fontSize: "15px", fontWeight: 700, color: "#0C0C0C" }}>{link.label}</span>
                <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.5 }}>{link.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Webhook section */}
      <section style={{ width: "100%", padding: "0 40px 64px", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ ...dm, fontSize: "24px", fontWeight: 800, color: "#0C0C0C", letterSpacing: "-0.5px", margin: 0 }}>
            Webhook Callbacks
          </h2>
          <p style={{ ...dm, fontSize: "14px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>
            Pass a <code style={{ ...mono, fontSize: "13px", background: "#F0EDE6", padding: "2px 8px", borderRadius: "6px" }}>callback_url</code> when
            creating a task. When all votes are in and the task closes, OnlyHumans POSTs the results to your URL.
            No polling required.
          </p>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#161616",
                borderRadius: "14px 14px 0 0",
                border: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "none",
              }}
            >
              <span style={{ ...mono, fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                JSON payload
              </span>
              <CopyButton
                code={`// Webhook payload POSTed to your callback_url\n{\n  "event": "task_closed",\n  "task_id": "abc-123",\n  "status": "closed",\n  "total_votes": 10,\n  "votes_by_option": { "0": 7, "1": 3 },\n  "winner": 0,\n  "confidence": 0.7\n}`}
                tone="dark"
              />
            </div>
            <pre style={{ ...codeBlock, borderRadius: "0 0 14px 14px" }}>{`// Webhook payload POSTed to your callback_url
{
  "event": "task_closed",
  "task_id": "abc-123",
  "status": "closed",
  "total_votes": 10,
  "votes_by_option": { "0": 7, "1": 3 },
  "winner": 0,
  "confidence": 0.7
}`}</pre>
          </div>
        </div>
      </section>
    </>
  );
}
