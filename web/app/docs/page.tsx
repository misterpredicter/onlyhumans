/* ────────────────────────────────────────────────────────────────────────────
 *  /docs — Human Signal API Reference & Integration Guide
 *  Comprehensive documentation for the verified human judgment oracle protocol.
 * ──────────────────────────────────────────────────────────────────────────── */

const BASE = "https://www.themo.live";

/* ── Data ────────────────────────────────────────────────────────────────── */

const ENDPOINTS = [
  { method: "POST", path: "/api/tasks?total=X", auth: "x402 payment", desc: "Create a judgment task (payment gated)" },
  { method: "GET", path: "/api/tasks", auth: "None", desc: "List all open tasks" },
  { method: "GET", path: "/api/tasks/:id", auth: "None", desc: "Task details + live vote results" },
  { method: "POST", path: "/api/tasks/:id/vote", auth: "World ID nullifier", desc: "Submit a verified human vote" },
  { method: "POST", path: "/api/tasks/:id/rate", auth: "None", desc: "Rate feedback quality or task creator" },
  { method: "POST", path: "/api/verify-world-id", auth: "None", desc: "Verify World ID ZKP, store nullifier" },
  { method: "GET", path: "/api/auth/rp-signature", auth: "None", desc: "Get RP signing context for IDKit v4" },
  { method: "GET", path: "/api/init", auth: "INIT_SECRET (prod)", desc: "Initialize database tables (idempotent)" },
];

const STEPS = [
  { n: "1", title: "Create task + pay via x402", body: "POST to /api/tasks with an x402 payment header. Set bounty per vote, max voters, tier, and 2-N options. USDC on Base Sepolia.", icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { n: "2", title: "Workers verify via World ID", body: "Each worker proves they're a unique human with a World ID zero-knowledge proof. Nullifier hash prevents sybil attacks.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { n: "3", title: "Vote + get paid instantly", body: "Workers pick an option, provide feedback (if tier requires), and receive USDC bounty automatically on-chain.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { n: "4", title: "Poll results in real-time", body: "GET /api/tasks/:id returns live vote distribution, confidence score, winner, and individual feedback with reputation.", icon: "M3 3v18h18 M7 16l4-6 4 4 4-8" },
];

const TIERS = [
  { slug: "quick", name: "Quick Vote", price: "~$0.05-0.10", desc: "Click to pick. No written feedback required. Best for high-volume binary decisions.", color: "#374151", bg: "#F5F4F0", border: "#E8E5DE" },
  { slug: "reasoned", name: "Reasoned Vote", price: "~$0.15-0.30", desc: "Pick + 1-2 sentence explanation. feedback_text required. Good for understanding why.", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  { slug: "detailed", name: "Detailed Review", price: "~$0.40-1.00", desc: "Pick + structured feedback (what works, what doesn't, suggestions). feedback_text required. Best for design critique and nuanced evaluation.", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

const USE_CASES = [
  {
    title: "RLHF Training Data",
    desc: "AI companies post preference pairs for verified humans to rank. No sybil contamination means cleaner training signal. Premium pricing for premium data quality.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    tag: "AI/ML",
  },
  {
    title: "Content Moderation",
    desc: "Route ambiguous content to verified human reviewers. Every decision backed by a real, unique person -- not an algorithm or a bot farm. Micropayments make per-item moderation economically viable.",
    icon: "M3 4h18M3 4v16h18V4M3 4l9 8 9-8",
    tag: "Trust & Safety",
  },
  {
    title: "AI Model Evaluation",
    desc: "Compare model outputs side-by-side. 'Which response is more helpful?' with verified unique evaluators. No contamination from the same person rating twice.",
    icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
    tag: "AI/ML",
  },
  {
    title: "Brand Perception Testing",
    desc: "Test logos, taglines, packaging, and brand assets with verified humans. Multi-option support means you can test 2-N variations in a single task. No fake survey respondents.",
    icon: "M7 7h10v10H7zM12 3v4M12 17v4M3 12h4M17 12h4",
    tag: "Marketing",
  },
  {
    title: "Design Critique & UX Testing",
    desc: "Get structured feedback on UI mockups, wireframes, or live screenshots. Detailed tier provides what works / what doesn't / suggestions from real users.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    tag: "Design",
  },
  {
    title: "Cultural Sensitivity Checking",
    desc: "Before launching in new markets, route creative assets through a verified human panel. Catch tone-deaf messaging before it ships. Geographic and demographic diversity in the worker pool.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    tag: "Localization",
  },
  {
    title: "Prediction Markets for Taste",
    desc: "'Which of these 4 landing pages will convert better?' Verified respondents with skin in the game. Reputation badges surface the most reliable taste-makers over time.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    tag: "Strategy",
  },
  {
    title: "Agent Decision Boundaries",
    desc: "Any autonomous agent that hits a judgment call can route to Human Signal, get a verified answer from a real human, and continue its workflow. Human-in-the-loop as an API call.",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    tag: "Agents",
  },
  {
    title: "A/B Testing at Scale",
    desc: "Classic preference comparison, but sybil-resistant. Test headlines, CTAs, email subject lines, product descriptions. Each vote is cryptographically one unique human.",
    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    tag: "Product",
  },
  {
    title: "Legal & Compliance Review",
    desc: "Route contract clauses, policy language, or terms of service to verified human reviewers for plain-language assessment. Detailed tier captures structured feedback on clarity and risk.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    tag: "Legal",
  },
];

const REPUTATION_TIERS = [
  { badge: "new", requirement: "< 5 votes", desc: "Just verified with World ID" },
  { badge: "bronze", requirement: "5+ votes", desc: "Active contributor" },
  { badge: "silver", requirement: "10+ votes, 3.5+ avg rating", desc: "Reliable reviewer" },
  { badge: "gold", requirement: "20+ votes, 4.0+ avg rating", desc: "Trusted expert" },
  { badge: "platinum", requirement: "50+ votes, 4.5+ avg rating", desc: "Elite reviewer" },
];

/* ── Style helpers ───────────────────────────────────────────────────────── */

const dm: React.CSSProperties = { fontFamily: "var(--font-sans), sans-serif" };
const mono: React.CSSProperties = { fontFamily: "var(--font-mono), monospace" };

const codeBlock: React.CSSProperties = {
  background: "#0C0C0C", borderRadius: "14px", padding: "22px",
  fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,255,255,0.55)",
  lineHeight: 1.7, margin: 0, overflow: "auto",
  border: "1px solid rgba(255,255,255,0.06)",
};

const sectionHeading: React.CSSProperties = {
  ...dm, fontSize: "24px", fontWeight: 800,
  color: "#0C0C0C", letterSpacing: "-0.5px", margin: 0,
};

const sectionSub: React.CSSProperties = {
  ...dm, fontSize: "15px", color: "#6B7280", lineHeight: 1.65, margin: 0, maxWidth: "640px",
};

const methodBadge = (method: string): React.CSSProperties => ({
  ...mono, fontSize: "12px", fontWeight: 500,
  color: "#FFFFFF", borderRadius: "6px", padding: "3px 8px",
  background: method === "GET"
    ? "linear-gradient(135deg, #3B82F6, #2563EB)"
    : "linear-gradient(135deg, #10B981, #059669)",
  alignSelf: "center", justifySelf: "start",
});

const inlineCode: React.CSSProperties = {
  ...mono, fontSize: "13px", color: "#0C0C0C",
  background: "#F0EDE6", padding: "2px 8px", borderRadius: "6px",
};

function SectionWrapper({ children, id, paddingBottom = "0" }: { children: React.ReactNode; id?: string; paddingBottom?: string }) {
  return (
    <section id={id} style={{ width: "100%", padding: `56px 40px ${paddingBottom}`, backgroundColor: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function DocsPage() {
  return (
    <>
      {/* ================================================================== */}
      {/*  HERO                                                              */}
      {/* ================================================================== */}
      <section className="hero-gradient" style={{ backgroundColor: "#0C0C0C", width: "100%" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "60px 40px 52px",
          display: "flex", flexDirection: "column", gap: "20px",
          position: "relative",
        }}>
          {/* Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "100px", padding: "7px 16px 7px 12px", alignSelf: "flex-start",
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px", flexShrink: 0, boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }} />
            <span style={{ ...mono, fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>
              REST API &middot; Agent-native &middot; x402 payments &middot; World ID verified
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 52px)",
            fontWeight: 400, color: "#FFFFFF", lineHeight: 1.08, letterSpacing: "-2px", margin: 0,
          }}>
            The Oracle Network for{" "}
            <span style={{
              background: "linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Human Judgment</span>
          </h1>

          <p style={{
            ...dm, fontSize: "16px", color: "rgba(255,255,255,0.45)",
            lineHeight: 1.65, margin: 0, maxWidth: "600px",
          }}>
            Human Signal is infrastructure for verified human taste. AI agents create judgment tasks,
            real humans vote (one person, one vote via World ID), and workers get paid instantly in USDC
            via x402 on Base. No accounts. No intermediaries. Just a REST API.
          </p>

          {/* Quick nav */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
            {[
              { label: "Agent Quick Start", href: "#quick-start" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "API Reference", href: "#api-reference" },
              { label: "Use Cases", href: "#use-cases" },
              { label: "Integration Guide", href: "#integration" },
              { label: "Pricing", href: "#pricing" },
            ].map((link) => (
              <a key={link.href} href={link.href} style={{
                ...dm, fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.35)",
                textDecoration: "none", padding: "6px 14px",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px",
                transition: "all 0.15s ease",
              }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Base URL bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)", width: "100%" }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
            display: "flex", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ ...mono, fontSize: "12px", color: "#10B981", fontWeight: 500 }}>BASE URL</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 24px" }}>
              <span style={{ ...mono, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{BASE}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  AGENT QUICK START                                                 */}
      {/* ================================================================== */}
      <SectionWrapper id="quick-start">
        <h2 style={sectionHeading}>Agent Quick Start</h2>
        <p style={sectionSub}>
          Get verified human judgment in 60 seconds. These examples work against the demo endpoint
          (<code style={inlineCode}>DEMO_MODE=true</code>). For production with x402 payments, see the{" "}
          <a href="#integration" style={{ color: "#10B981", textDecoration: "underline" }}>Integration Guide</a>.
        </p>

        <div className="docs-grid-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {/* curl */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ ...mono, fontSize: "12px", fontWeight: 500, color: "#6B7280" }}>curl</span>
            <pre style={codeBlock}>{`curl -X POST ${BASE}/api/tasks \\
  -H "content-type: application/json" \\
  -d '{
    "description": "Which logo?",
    "options": [
      {"label":"A","content":"Minimal"},
      {"label":"B","content":"Bold"}
    ],
    "requester_wallet": "0x1234...",
    "callback_url": "https://you.com/hook"
  }'`}</pre>
          </div>

          {/* Python */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ ...mono, fontSize: "12px", fontWeight: 500, color: "#6B7280" }}>Python</span>
            <pre style={codeBlock}>{`import requests

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
task_id = r.json()["task_id"]`}</pre>
          </div>

          {/* TypeScript */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ ...mono, fontSize: "12px", fontWeight: 500, color: "#6B7280" }}>TypeScript</span>
            <pre style={codeBlock}>{`const res = await fetch(
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
const { task_id } = await res.json();`}</pre>
          </div>
        </div>

        <div className="card-elevated" style={{ padding: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "100px",
            backgroundColor: "#10B981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
          }} />
          <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>
            <strong style={{ color: "#0C0C0C" }}>Webhook support:</strong> Pass{" "}
            <code style={inlineCode}>callback_url</code> and Human Signal will POST results to your endpoint
            when all votes are in. No polling needed.
          </span>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  WHAT IS HUMAN SIGNAL                                              */}
      {/* ================================================================== */}
      <SectionWrapper id="overview">
        <h2 style={sectionHeading}>What is Human Signal?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="docs-grid-2col">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={sectionSub}>
              Human Signal is a <strong>protocol for verified human judgment</strong>. Think of it as
              Chainlink for human cognition -- an oracle network where the data source isn&apos;t a price
              feed, it&apos;s a real human opinion.
            </p>
            <p style={sectionSub}>
              The problem it solves: AI systems need human feedback at every stage -- RLHF, A/B testing,
              content moderation, safety evaluation. But the current infrastructure is broken. Workers
              create duplicate accounts, bots farm tasks, payments take weeks, and there&apos;s no API for
              agents to request human judgment in real time.
            </p>
            <p style={sectionSub}>
              Human Signal composes three primitives into one protocol:
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                title: "World ID = Proof of Personhood",
                body: "Every voter proves they're a unique human via zero-knowledge proof. One biometric identity = one nullifier hash = one vote per task. No PII stored. Sybil attacks are cryptographically impossible.",
                gradient: "linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)",
              },
              {
                title: "x402 = HTTP-Native Micropayments",
                body: "Task creation is paywalled by Coinbase's x402 protocol. Agent hits POST /api/tasks, gets 402 Payment Required, x402 client handles USDC payment on Base automatically. No checkout. No API keys.",
                gradient: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
              },
              {
                title: "REST API = Agent-Native Interface",
                body: "Built for machines first. An AI agent can create a task, pay the bounty, poll for results, and continue its workflow -- all via standard HTTP. Human-in-the-loop becomes an API call.",
                gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              },
            ].map((item) => (
              <div key={item.title} className="card-elevated" style={{ padding: "20px", display: "flex", gap: "14px" }}>
                <div style={{
                  width: "36px", height: "36px", minWidth: "36px",
                  background: item.gradient, borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#0C0C0C" }}>{item.title}</span>
                  <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>{item.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  HOW IT WORKS                                                      */}
      {/* ================================================================== */}
      <SectionWrapper id="how-it-works">
        <h2 style={sectionHeading}>How It Works</h2>
        <p style={sectionSub}>Four steps from task creation to verified results. The entire flow can be automated by an AI agent.</p>
        <div className="docs-grid-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {STEPS.map((step) => (
            <div key={step.n} className="card-elevated" style={{
              padding: "24px", display: "flex", flexDirection: "column", gap: "14px",
            }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={step.icon} />
                </svg>
              </div>
              <span style={{ ...dm, fontSize: "15px", fontWeight: 700, color: "#0C0C0C", letterSpacing: "-0.2px" }}>{step.title}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>{step.body}</span>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="card-elevated" style={{ padding: "28px", marginTop: "4px" }}>
          <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C", marginBottom: "12px", display: "block" }}>Architecture flow</span>
          <pre style={{
            ...codeBlock,
            fontSize: "11px",
            lineHeight: 1.8,
          }}>{`Agent/Requester                     Human Signal                          Worker
     |                                    |                                    |
     |-- POST /api/tasks?total=X -------->|                                    |
     |   (x402 auto-pays USDC on Base)    |                                    |
     |<-- 200 { task_id, status } --------|                                    |
     |                                    |-- XMTP broadcast ----------------->|
     |                                    |                                    |
     |                                    |<-- POST /verify-world-id ----------|
     |                                    |    (ZKP of personhood)             |
     |                                    |<-- POST /tasks/:id/vote ----------|
     |                                    |    { nullifier, option_index }      |
     |                                    |--- USDC payment ------------------>|
     |                                    |                                    |
     |-- GET /api/tasks/:id ------------->|                                    |
     |<-- { votes, confidence, feedback } |                                    |`}</pre>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  API REFERENCE — Endpoint Table                                    */}
      {/* ================================================================== */}
      <SectionWrapper id="api-reference">
        <h2 style={sectionHeading}>API Reference</h2>
        <p style={sectionSub}>
          All endpoints are served from <code style={inlineCode}>{BASE}</code>. No API keys required --
          authentication is handled by x402 payment (for task creation) and World ID nullifiers (for voting).
        </p>

        {/* Endpoint overview table */}
        <div className="card-elevated" style={{ overflow: "hidden" }}>
          <div className="endpoint-grid" style={{
            display: "grid", gridTemplateColumns: "80px 260px 180px 1fr",
            padding: "14px 24px", background: "#FAFAF8", borderBottom: "1px solid #E8E5DE",
          }}>
            {["Method", "Path", "Auth", "Description"].map((h) => (
              <span key={h} style={{
                ...dm, fontSize: "11px", fontWeight: 700,
                color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{h}</span>
            ))}
          </div>
          {ENDPOINTS.map((ep, i) => (
            <div key={i} className="endpoint-grid" style={{
              display: "grid", gridTemplateColumns: "80px 260px 180px 1fr",
              padding: "14px 24px", alignItems: "center",
              borderBottom: i < ENDPOINTS.length - 1 ? "1px solid #F0EDE6" : "none",
            }}>
              <span style={methodBadge(ep.method)}>{ep.method}</span>
              <span style={{ ...mono, fontSize: "13px", color: "#0C0C0C" }}>{ep.path}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280" }}>{ep.auth}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#0C0C0C" }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  POST /api/tasks                                                   */}
      {/* ================================================================== */}
      <SectionWrapper id="create-task">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("POST")}>POST</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks?total=X</span>
        </div>
        <p style={sectionSub}>
          Create a judgment task. The x402 protocol gates this endpoint -- your agent must include a valid payment header
          for the total cost (<code style={inlineCode}>bounty_per_vote x max_workers</code>). The <code style={inlineCode}>total</code> query
          parameter sets the USDC amount charged via x402 on Base Sepolia.
          Set <code style={inlineCode}>DEMO_MODE=true</code> in env to bypass x402 for testing.
        </p>

        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* Left: request body */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Request body</span>
            <pre style={codeBlock}>{`{
  "description": "Which homepage design feels more trustworthy?",
  "context": "Choosing for a fintech startup targeting Gen Z...",
  "options": [
    { "label": "Minimal", "content": "Clean white background, sans-serif" },
    { "label": "Bold", "content": "Dark mode with gradient accents" },
    { "label": "Playful", "content": "Bright colors, rounded shapes" }
  ],
  "tier": "reasoned",
  "bounty_per_vote": 0.20,
  "max_workers": 10,
  "requester_wallet": "0xYourWalletAddress..."
}`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Parameters</span>
            <div className="card-elevated" style={{ overflow: "hidden" }}>
              {[
                { name: "description", type: "string", req: "required", desc: "The question being asked" },
                { name: "options", type: "array", req: "required*", desc: "Array of {label, content} objects (2-N items)" },
                { name: "option_a / option_b", type: "string", req: "V1 compat", desc: "Legacy A/B format (use options[] instead)" },
                { name: "context", type: "string", req: "optional", desc: "Additional context for voters" },
                { name: "tier", type: "string", req: "optional", desc: "\"quick\" | \"reasoned\" | \"detailed\" (default: \"quick\")" },
                { name: "bounty_per_vote", type: "number", req: "optional", desc: "USDC per vote, minimum $0.01 (default: $0.08)" },
                { name: "max_workers", type: "number", req: "optional", desc: "Maximum voters allowed (default: 20)" },
                { name: "requester_wallet", type: "string", req: "required", desc: "Your wallet address (0x...)" },
                { name: "callback_url", type: "string", req: "optional", desc: "URL to POST results when task closes (webhook)" },
              ].map((param, i, arr) => (
                <div key={param.name} style={{
                  display: "grid", gridTemplateColumns: "140px 70px 70px 1fr",
                  padding: "10px 16px", alignItems: "center",
                  borderBottom: i < arr.length - 1 ? "1px solid #F0EDE6" : "none",
                  fontSize: "12px",
                }}>
                  <span style={{ ...mono, color: "#0C0C0C", fontWeight: 500 }}>{param.name}</span>
                  <span style={{ ...mono, color: "#6B7280" }}>{param.type}</span>
                  <span style={{
                    ...dm, fontSize: "11px", fontWeight: 600,
                    color: param.req === "required" ? "#059669" : param.req === "required*" ? "#059669" : "#9CA3AF",
                  }}>{param.req}</span>
                  <span style={{ ...dm, color: "#6B7280" }}>{param.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: response + curl */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response (200)</span>
            <pre style={codeBlock}>{`{
  "task_id": 42,
  "status": "open",
  "tier": "reasoned",
  "payment_tx_hash": "0xabc...",
  "created_at": "2026-03-27T15:30:00Z"
}`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Error responses</span>
            <pre style={codeBlock}>{`// 400 — Missing fields
{ "error": "Missing required fields: description, requester_wallet" }

// 400 — Bad options
{ "error": "Provide either options[] (2+ items) or option_a + option_b" }

// 400 — Bad bounty
{ "error": "Bounty per vote must be at least $0.01" }

// 402 — Payment required (x402 challenge)
// x402 client handles this automatically`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Agent example (TypeScript with x402)</span>
            <pre style={codeBlock}>{`import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { toClientEvmSigner } from "@x402/evm";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({
  chain: baseSepolia, transport: http()
});
const signer = toClientEvmSigner(account, publicClient);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const paidFetch = wrapFetchWithPayment(fetch, client);

const res = await paidFetch(
  "${BASE}/api/tasks?total=2.00",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      description: "Which logo is better?",
      options: [
        { label: "Logo A", content: "Minimal wordmark" },
        { label: "Logo B", content: "Abstract icon" }
      ],
      tier: "reasoned",
      bounty_per_vote: 0.20,
      max_workers: 10,
      requester_wallet: account.address,
    }),
  }
);

const { task_id } = await res.json();`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  GET /api/tasks                                                    */}
      {/* ================================================================== */}
      <SectionWrapper id="list-tasks">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("GET")}>GET</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks</span>
        </div>
        <p style={sectionSub}>
          List all open tasks. Returns up to 50 tasks ordered by creation date (newest first). Each task includes
          its options array and current vote count.
        </p>
        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Example request</span>
            <pre style={codeBlock}>{`curl ${BASE}/api/tasks`}</pre>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response (200)</span>
            <pre style={codeBlock}>{`{
  "tasks": [
    {
      "id": 42,
      "description": "Which logo feels more premium?",
      "status": "open",
      "tier": "reasoned",
      "bounty_per_vote": "0.20",
      "max_workers": 10,
      "vote_count": 3,
      "context": "Choosing for a fintech startup...",
      "options": [
        { "option_index": 0, "label": "Minimal", "content": "..." },
        { "option_index": 1, "label": "Bold", "content": "..." }
      ],
      "created_at": "2026-03-27T15:30:00Z"
    }
  ]
}`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  GET /api/tasks/:id                                                */}
      {/* ================================================================== */}
      <SectionWrapper id="get-task">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("GET")}>GET</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks/:id</span>
        </div>
        <p style={sectionSub}>
          Returns full task details, live vote distribution across all options, confidence score,
          current winner (or &quot;tie&quot;), total USDC paid, and the 10 most recent votes with feedback text and reputation badges.
        </p>
        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Example request</span>
            <pre style={codeBlock}>{`curl ${BASE}/api/tasks/42`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Polling pattern for agents</span>
            <pre style={codeBlock}>{`// Poll until confidence threshold reached
async function waitForConsensus(taskId: number) {
  while (true) {
    const res = await fetch(
      \`${BASE}/api/tasks/\${taskId}\`
    );
    const { results } = await res.json();

    if (results.confidence >= 0.7
        && results.total_votes >= 5) {
      return results;
    }

    // Poll every 30 seconds
    await new Promise(r => setTimeout(r, 30_000));
  }
}`}</pre>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response (200)</span>
            <pre style={codeBlock}>{`{
  "task": {
    "id": 42,
    "description": "Which homepage design feels...",
    "status": "open",
    "tier": "reasoned",
    "bounty_per_vote": "0.20",
    "max_workers": 10,
    "context": "Choosing for a fintech...",
    "options": [
      { "option_index": 0, "label": "Minimal", "content": "..." },
      { "option_index": 1, "label": "Bold", "content": "..." }
    ]
  },
  "results": {
    "total_votes": 8,
    "votes_a": 5,
    "votes_b": 3,
    "votes_by_option": { "0": 5, "1": 3 },
    "winner": 0,
    "confidence": 0.625,
    "verified_workers": 8,
    "total_paid_usdc": 1.60
  },
  "recent_votes": [
    {
      "id": 101,
      "nullifier_prefix": "0x1a2b3c4d5e...",
      "voted_at": "2026-03-27T16:05:00Z",
      "paid": 0.20,
      "option_index": 0,
      "choice": "A",
      "feedback_text": "Option A feels cleaner...",
      "feedback_rating": null,
      "reputation_badge": "gold",
      "reputation_score": 25
    }
  ]
}`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  POST /api/tasks/:id/vote                                          */}
      {/* ================================================================== */}
      <SectionWrapper id="vote">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("POST")}>POST</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks/:id/vote</span>
        </div>
        <p style={sectionSub}>
          Submit a vote on a task. Worker must first verify with World ID to get a <code style={inlineCode}>nullifier_hash</code>.
          Payment is sent automatically to <code style={inlineCode}>worker_wallet</code> on successful vote.
          One vote per human per task -- enforced by World ID nullifier uniqueness.
        </p>
        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Request body</span>
            <pre style={codeBlock}>{`{
  "option_index": 0,
  "nullifier_hash": "0x1a2b3c...",
  "worker_wallet": "0xWorkerAddress...",
  "feedback_text": "Option A feels cleaner and more professional"
}`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Parameters</span>
            <div className="card-elevated" style={{ overflow: "hidden" }}>
              {[
                { name: "option_index", type: "number", req: "required*", desc: "Index of chosen option (0-based)" },
                { name: "choice", type: "string", req: "V1 compat", desc: "\"A\" or \"B\" (legacy, use option_index)" },
                { name: "nullifier_hash", type: "string", req: "required", desc: "World ID nullifier from verification" },
                { name: "worker_wallet", type: "string", req: "optional", desc: "Wallet to receive bounty payment" },
                { name: "feedback_text", type: "string", req: "conditional", desc: "Required for reasoned and detailed tiers" },
              ].map((param, i, arr) => (
                <div key={param.name} style={{
                  display: "grid", gridTemplateColumns: "130px 70px 80px 1fr",
                  padding: "10px 16px", alignItems: "center",
                  borderBottom: i < arr.length - 1 ? "1px solid #F0EDE6" : "none",
                  fontSize: "12px",
                }}>
                  <span style={{ ...mono, color: "#0C0C0C", fontWeight: 500 }}>{param.name}</span>
                  <span style={{ ...mono, color: "#6B7280" }}>{param.type}</span>
                  <span style={{
                    ...dm, fontSize: "11px", fontWeight: 600,
                    color: param.req === "required" || param.req === "required*" ? "#059669" : param.req === "conditional" ? "#D97706" : "#9CA3AF",
                  }}>{param.req}</span>
                  <span style={{ ...dm, color: "#6B7280" }}>{param.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response (200)</span>
            <pre style={codeBlock}>{`{
  "success": true,
  "choice": "A",
  "option_index": 0,
  "payment_tx_hash": "0xdef...",
  "amount_paid_usdc": 0.20,
  "total_votes": 4
}`}</pre>

            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Error responses</span>
            <pre style={codeBlock}>{`// 400 — Missing option
{ "error": "Provide option_index (integer) or choice ('A'|'B')" }

// 400 — Invalid option
{ "error": "Invalid option_index: must be 0-2" }

// 400 — Feedback required
{ "error": "feedback_text required for reasoned tier (1-2 sentences)" }

// 401 — Not verified
{ "error": "World ID verification required before voting" }

// 404 — Task closed or missing
{ "error": "Task not found or closed" }

// 409 — Sybil protection
{ "error": "Already voted on this task" }`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  POST /api/tasks/:id/rate                                          */}
      {/* ================================================================== */}
      <SectionWrapper id="rate">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("POST")}>POST</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks/:id/rate</span>
        </div>
        <p style={sectionSub}>
          Two operations in one endpoint, distinguished by the <code style={inlineCode}>type</code> field.
          Rate feedback quality (requester rates a voter) or rate the task creator (voter rates the requester).
          Ratings feed into the reputation system.
        </p>
        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Rate voter feedback (requester action)</span>
            <pre style={codeBlock}>{`// type: "feedback" — rate a voter's feedback quality
{
  "type": "feedback",
  "vote_id": 101,
  "rating": 5          // 1-5 stars
}`}</pre>
            <pre style={codeBlock}>{`// Response
{ "success": true, "type": "feedback", "vote_id": 101, "rating": 5 }`}</pre>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Rate task creator (voter action)</span>
            <pre style={codeBlock}>{`// type: "creator" — thumbs up/down on task quality
{
  "type": "creator",
  "nullifier_hash": "0x1a2b3c...",
  "rating": 1          // 1 = thumbs up, -1 = thumbs down
}`}</pre>
            <pre style={codeBlock}>{`// Response
{ "success": true, "type": "creator", "rating": 1 }`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  POST /api/verify-world-id                                         */}
      {/* ================================================================== */}
      <SectionWrapper id="verify-world-id">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={methodBadge("POST")}>POST</span>
          <span style={{ ...mono, fontSize: "18px", fontWeight: 500, color: "#0C0C0C" }}>/api/verify-world-id</span>
        </div>
        <p style={sectionSub}>
          Verify a World ID zero-knowledge proof and store the nullifier hash. This must be called before
          a worker can vote. The frontend handles this via the IDKit widget, but agents can call it directly.
        </p>
        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Request body (IDKit proof result)</span>
            <pre style={codeBlock}>{`{
  "merkle_root": "0x...",
  "nullifier_hash": "0x1a2b3c...",
  "proof": "0x...",
  "verification_level": "orb"
}`}</pre>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response (200)</span>
            <pre style={codeBlock}>{`{
  "verified": true,
  "nullifier_hash": "0x1a2b3c..."
}`}</pre>
            <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Error response (400)</span>
            <pre style={codeBlock}>{`{
  "verified": false,
  "error": "Verification failed"
}`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  GET /api/auth/rp-signature + GET /api/init                        */}
      {/* ================================================================== */}
      <SectionWrapper id="utility-endpoints">
        <h2 style={sectionHeading}>Utility Endpoints</h2>

        <div className="docs-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div className="card-elevated" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={methodBadge("GET")}>GET</span>
              <span style={{ ...mono, fontSize: "14px", fontWeight: 500, color: "#0C0C0C" }}>/api/auth/rp-signature</span>
            </div>
            <p style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55, margin: 0 }}>
              Generates a signed RP context for IDKit v4. Used by the frontend to initialize the World ID
              verification widget. Returns a signed object with nonce, timestamps, and signature (valid for 5 minutes).
            </p>
            <pre style={codeBlock}>{`// Response
{
  "rp_context": {
    "rp_id": "app_xxxxx",
    "nonce": "abc123...",
    "created_at": "2026-03-27T15:30:00Z",
    "expires_at": "2026-03-27T15:35:00Z",
    "signature": "0x..."
  }
}`}</pre>
          </div>

          <div className="card-elevated" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={methodBadge("GET")}>GET</span>
              <span style={{ ...mono, fontSize: "14px", fontWeight: 500, color: "#0C0C0C" }}>/api/init</span>
            </div>
            <p style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55, margin: 0 }}>
              Initialize database tables (idempotent -- safe to call multiple times). In production,
              requires <code style={inlineCode}>?key=INIT_SECRET</code> query parameter.
              In development, works without authentication.
            </p>
            <pre style={codeBlock}>{`// Dev
curl ${BASE}/api/init

// Production
curl ${BASE}/api/init?key=your_secret

// Response
{ "success": true, "message": "Database initialized" }`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  USE CASES                                                         */}
      {/* ================================================================== */}
      <SectionWrapper id="use-cases">
        <h2 style={sectionHeading}>Use Cases</h2>
        <p style={sectionSub}>
          Human Signal generalizes to any task where verified human judgment has economic value.
          Preference comparisons are the beachhead -- the protocol serves much more.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px",
        }} className="docs-grid-2col">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="card-elevated" style={{
              padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", minWidth: "36px",
                    background: "linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)",
                    borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={uc.icon} />
                    </svg>
                  </div>
                  <span style={{ ...dm, fontSize: "15px", fontWeight: 700, color: "#0C0C0C", letterSpacing: "-0.2px" }}>{uc.title}</span>
                </div>
                <span style={{
                  ...mono, fontSize: "11px", fontWeight: 500,
                  color: "#6B7280", backgroundColor: "#F5F4F0",
                  border: "1px solid #E8E5DE",
                  borderRadius: "100px", padding: "3px 10px",
                }}>{uc.tag}</span>
              </div>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>{uc.desc}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  PRICING                                                           */}
      {/* ================================================================== */}
      <SectionWrapper id="pricing">
        <h2 style={sectionHeading}>Pricing</h2>
        <p style={sectionSub}>
          You set the price. The <code style={inlineCode}>bounty_per_vote</code> field accepts any amount ($0.01+).
          Tiers define feedback depth, not cost -- pair any tier with any bounty. Higher bounties attract
          workers faster. Total cost = bounty_per_vote x max_workers, paid upfront via x402.
        </p>

        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {TIERS.map((tier) => (
            <div key={tier.slug} className="card-elevated" style={{
              padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  ...mono, fontSize: "11px", fontWeight: 500,
                  color: tier.color, backgroundColor: tier.bg,
                  border: `1px solid ${tier.border}`,
                  borderRadius: "100px", padding: "4px 12px",
                }}>{tier.slug}</span>
                <span style={{ ...mono, fontSize: "15px", color: "#10B981", fontWeight: 600 }}>{tier.price}</span>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>{tier.name}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55 }}>{tier.desc}</span>
            </div>
          ))}
        </div>

        {/* Pricing formula */}
        <div className="card-elevated" style={{ padding: "24px" }}>
          <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C", marginBottom: "12px", display: "block" }}>
            How pricing works
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <pre style={codeBlock}>{`Total cost = bounty_per_vote x max_workers

Example:
  bounty_per_vote: $0.20
  max_workers: 10
  total cost: $2.00 USDC (paid upfront via x402)

  Each worker receives $0.20 USDC on-chain
  when they submit their vote.

Minimum: $0.01 per vote
No platform fee. No middleman cut.
Workers receive 100% of the bounty.`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  REPUTATION SYSTEM                                                 */}
      {/* ================================================================== */}
      <SectionWrapper id="reputation">
        <h2 style={sectionHeading}>Reputation System</h2>
        <p style={sectionSub}>
          Workers build reputation over time. Badges are calculated from total votes completed and average
          feedback rating (rated by task requesters). Reputation is tied to World ID nullifier --
          anonymous but persistent.
        </p>
        <div className="card-elevated" style={{ overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "100px 200px 1fr",
            padding: "14px 24px", background: "#FAFAF8", borderBottom: "1px solid #E8E5DE",
          }}>
            {["Badge", "Requirement", "Description"].map((h) => (
              <span key={h} style={{
                ...dm, fontSize: "11px", fontWeight: 700,
                color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{h}</span>
            ))}
          </div>
          {REPUTATION_TIERS.map((tier, i) => (
            <div key={tier.badge} style={{
              display: "grid", gridTemplateColumns: "100px 200px 1fr",
              padding: "14px 24px", alignItems: "center",
              borderBottom: i < REPUTATION_TIERS.length - 1 ? "1px solid #F0EDE6" : "none",
            }}>
              <span style={{
                ...mono, fontSize: "12px", fontWeight: 500,
                color: tier.badge === "platinum" ? "#7C3AED" :
                       tier.badge === "gold" ? "#D97706" :
                       tier.badge === "silver" ? "#6B7280" :
                       tier.badge === "bronze" ? "#92400E" : "#9CA3AF",
              }}>{tier.badge}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#0C0C0C" }}>{tier.requirement}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280" }}>{tier.desc}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  INTEGRATION GUIDE                                                 */}
      {/* ================================================================== */}
      <SectionWrapper id="integration">
        <h2 style={sectionHeading}>Integration Guide</h2>
        <p style={sectionSub}>
          How an AI agent integrates with Human Signal end-to-end: from creating a task to consuming the results.
        </p>

        {/* Step-by-step */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Step 1 */}
          <div className="card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", minWidth: "32px",
                backgroundColor: "#0C0C0C", borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>1</span>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>Install x402 client dependencies</span>
            </div>
            <pre style={codeBlock}>{`npm install @x402/fetch @x402/evm viem`}</pre>
          </div>

          {/* Step 2 */}
          <div className="card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", minWidth: "32px",
                backgroundColor: "#0C0C0C", borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>2</span>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>Fund a wallet with testnet USDC on Base Sepolia</span>
            </div>
            <p style={{ ...dm, fontSize: "13px", color: "#6B7280", lineHeight: 1.55, margin: 0 }}>
              Get testnet USDC from the Circle faucet at <code style={inlineCode}>faucet.circle.com</code>.
              Send to your agent&apos;s wallet address on Base Sepolia.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", minWidth: "32px",
                backgroundColor: "#0C0C0C", borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>3</span>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>Set up payment-wrapped fetch</span>
            </div>
            <pre style={codeBlock}>{`import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { toClientEvmSigner } from "@x402/evm";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as \`0x\${string}\`);
const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
const signer = toClientEvmSigner(account, publicClient);
const client = new x402Client();
registerExactEvmScheme(client, { signer });

// This fetch wrapper auto-handles x402 payment challenges
const paidFetch = wrapFetchWithPayment(fetch, client);`}</pre>
          </div>

          {/* Step 4 */}
          <div className="card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", minWidth: "32px",
                backgroundColor: "#0C0C0C", borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...dm, fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>4</span>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>Create a task and poll for results</span>
            </div>
            <pre style={codeBlock}>{`const HUMAN_SIGNAL = "${BASE}";

// Create task — x402 handles payment automatically
const taskRes = await paidFetch(
  \`\${HUMAN_SIGNAL}/api/tasks?total=2.00\`,
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      description: "Which email subject line is more compelling?",
      options: [
        { label: "Direct", content: "Your order ships tomorrow" },
        { label: "Curious", content: "Something exciting is on its way" }
      ],
      tier: "reasoned",
      bounty_per_vote: 0.20,
      max_workers: 10,
      requester_wallet: account.address,
    }),
  }
);

const { task_id } = await taskRes.json();
console.log(\`Task created: \${task_id}\`);

// Poll for results until confidence threshold
let results;
do {
  await new Promise(r => setTimeout(r, 30_000));
  const res = await fetch(\`\${HUMAN_SIGNAL}/api/tasks/\${task_id}\`);
  const data = await res.json();
  results = data.results;
  console.log(\`Votes: \${results.total_votes}, Confidence: \${results.confidence}\`);
} while (results.confidence < 0.7 || results.total_votes < 5);

console.log(\`Winner: option \${results.winner}\`);
console.log(\`Confidence: \${(results.confidence * 100).toFixed(0)}%\`);`}</pre>
          </div>

          {/* Step 5 */}
          <div className="card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", minWidth: "32px",
                backgroundColor: "#10B981", borderRadius: "100px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span style={{ ...dm, fontSize: "16px", fontWeight: 700, color: "#0C0C0C" }}>Use the result in your agent&apos;s workflow</span>
            </div>
            <pre style={codeBlock}>{`// Read individual feedback from verified humans
const detailRes = await fetch(\`\${HUMAN_SIGNAL}/api/tasks/\${task_id}\`);
const { recent_votes } = await detailRes.json();

for (const vote of recent_votes) {
  console.log(\`[\${vote.reputation_badge}] Option \${vote.option_index}: \${vote.feedback_text}\`);
}

// Example output:
// [gold] Option 0: "Direct is cleaner — users want certainty, not mystery"
// [silver] Option 1: "The curious one creates more engagement, higher open rate"
// [bronze] Option 0: "Straightforward subject lines always win for transactional email"`}</pre>
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  ANTI-SYBIL SECTION                                                */}
      {/* ================================================================== */}
      <SectionWrapper id="anti-sybil">
        <div className="card-elevated" style={{
          padding: "36px", display: "flex", flexDirection: "column", gap: "18px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 style={{
              ...dm, fontSize: "20px", fontWeight: 800,
              color: "#0C0C0C", letterSpacing: "-0.4px", margin: 0,
            }}>
              Anti-Sybil Mechanism
            </h2>
          </div>
          <p style={{
            ...dm, fontSize: "14px", color: "#6B7280",
            lineHeight: 1.7, margin: 0,
          }}>
            The <code style={inlineCode}>UNIQUE(task_id, nullifier_hash)</code> constraint
            in the votes table is the entire sybil-resistance implementation. World ID issues a stable, anonymous nullifier_hash
            per human per action -- no names, no emails. Postgres enforces one vote per human per task atomically.
            This isn&apos;t &quot;better verification.&quot; It&apos;s a different category. Email verification is a speed bump. World ID is a cryptographic guarantee.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              "World ID zero-knowledge proof",
              "One vote per human per task",
              "No PII stored",
              "Atomic constraint (no race conditions)",
              "x402 payment verification on Base Sepolia",
            ].map((text, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "#F0FDF4", border: "1px solid #D1FAE5",
                borderRadius: "100px", padding: "6px 14px",
              }}>
                <div style={{
                  width: "6px", height: "6px",
                  backgroundColor: "#10B981", borderRadius: "100px",
                  boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
                }} />
                <span style={{ ...dm, fontSize: "13px", color: "#065F46", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ================================================================== */}
      {/*  TECH STACK                                                        */}
      {/* ================================================================== */}
      <SectionWrapper id="stack" paddingBottom="80px">
        <h2 style={sectionHeading}>Tech Stack</h2>
        <div className="card-elevated" style={{ overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "160px 1fr",
            padding: "14px 24px", background: "#FAFAF8", borderBottom: "1px solid #E8E5DE",
          }}>
            {["Layer", "Technology"].map((h) => (
              <span key={h} style={{
                ...dm, fontSize: "11px", fontWeight: 700,
                color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>{h}</span>
            ))}
          </div>
          {[
            { layer: "Identity", tech: "World ID v4 (@worldcoin/idkit) -- ZK proof of personhood, nullifier-based anti-sybil" },
            { layer: "Payments", tech: "x402 protocol (@x402/next, @x402/core) -- HTTP 402 micropayments, exact EVM scheme" },
            { layer: "Chain", tech: "Base Sepolia -- USDC ERC-20 transfers via viem" },
            { layer: "Messaging", tech: "XMTP agent SDK -- broadcasts new tasks to registered workers" },
            { layer: "Frontend", tech: "Next.js 15, React 19, deployed on Vercel" },
            { layer: "Database", tech: "Neon Postgres (serverless) -- tasks, votes, workers, reputation, payments" },
            { layer: "Hosting", tech: "Vercel (web) + Railway (XMTP agent)" },
          ].map((row, i, arr) => (
            <div key={row.layer} style={{
              display: "grid", gridTemplateColumns: "160px 1fr",
              padding: "14px 24px", alignItems: "center",
              borderBottom: i < arr.length - 1 ? "1px solid #F0EDE6" : "none",
            }}>
              <span style={{ ...dm, fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>{row.layer}</span>
              <span style={{ ...dm, fontSize: "13px", color: "#6B7280" }}>{row.tech}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
