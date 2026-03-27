const ENDPOINTS = [
  { method: "POST", path: "/api/tasks?total=X", auth: "x402 payment", desc: "Create a judgment task" },
  { method: "GET", path: "/api/tasks", auth: "None", desc: "List open tasks" },
  { method: "GET", path: "/api/tasks/:id", auth: "None", desc: "Task details + live results" },
  { method: "POST", path: "/api/tasks/:id/vote", auth: "World ID nullifier", desc: "Submit vote + trigger payment" },
  { method: "POST", path: "/api/tasks/:id/rate", auth: "None", desc: "Rate feedback or creator" },
  { method: "POST", path: "/api/verify-world-id", auth: "None", desc: "Verify World ID ZKP" },
];

const STEPS = [
  { n: "1", title: "Create task + pay via x402", body: "POST to /api/tasks with an x402 payment header. Set bounty per vote, max voters, tier. USDC on Base Sepolia." },
  { n: "2", title: "Workers verify via World ID", body: "Each worker proves they're a unique human with a World ID zero-knowledge proof. Nullifier hash prevents sybil attacks." },
  { n: "3", title: "Vote + get paid instantly", body: "Workers pick an option, provide feedback (if tier requires), and receive USDC bounty automatically on-chain." },
  { n: "4", title: "Poll results in real-time", body: "GET /api/tasks/:id returns live vote distribution, confidence score, winner, and individual feedback with reputation." },
];

const TIERS = [
  { slug: "quick", name: "Quick Vote", price: "$0.08/vote", desc: "Click to pick. No written feedback required.", color: "#6B7280", bg: "#F0EDE6" },
  { slug: "reasoned", name: "Reasoned Vote", price: "$0.20/vote", desc: "Pick + 1-2 sentence explanation. feedback_text required.", color: "#3B82F6", bg: "#EFF6FF" },
  { slug: "detailed", name: "Detailed Review", price: "$0.50/vote", desc: "Pick + structured feedback (what works, what doesn't, suggestions). feedback_text required.", color: "#8B5CF6", bg: "#F5F3FF" },
];

export default function DocsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0C0C0C", width: "100%" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "56px 40px 48px",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A",
            borderRadius: "100px", padding: "6px 16px 6px 12px", alignSelf: "flex-start",
          }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "100px", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 400, color: "#71717A" }}>
              REST API &middot; Agent-native &middot; x402 payments
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 4vw, 48px)",
            fontWeight: 400, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: "-1.5px", margin: 0,
          }}>
            API Reference
          </h1>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "16px", color: "#71717A",
            lineHeight: 1.6, margin: 0, maxWidth: "560px",
          }}>
            Integrate Human Signal into your agent, CLI, or application. Create judgment tasks,
            collect verified human preferences, and pay workers — all via REST.
          </p>
        </div>

        {/* Base URL bar */}
        <div style={{ borderTop: "1px solid #1F1F1F", backgroundColor: "#111111", width: "100%" }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
            display: "flex", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", borderRight: "1px solid #1F1F1F" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#10B981", fontWeight: 500 }}>BASE URL</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 24px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#A3A3A3" }}>
                https://themo.live
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ width: "100%", padding: "48px 40px 0", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 700,
            color: "#0C0C0C", letterSpacing: "-0.3px", margin: 0,
          }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {STEPS.map((step) => (
              <div key={step.n} style={{
                background: "#FFFFFF", border: "1.5px solid #E8E5DE", borderRadius: "16px",
                padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
              }}>
                <div style={{
                  width: "32px", height: "32px", background: "#0C0C0C", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{step.n}</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 700, color: "#0C0C0C" }}>{step.title}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280", lineHeight: 1.5 }}>{step.body}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Endpoints table ──────────────────────────────────── */}
      <section style={{ width: "100%", padding: "48px 40px 0", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{
            fontFamily: "var(--font-sans)", fontSize: "22px", fontWeight: 700,
            color: "#0C0C0C", letterSpacing: "-0.3px", margin: 0,
          }}>
            Endpoints
          </h2>
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E8E5DE", borderRadius: "16px", overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "80px 240px 160px 1fr",
              padding: "12px 24px", background: "#F5F4F0", borderBottom: "1px solid #E8E5DE",
            }}>
              {["Method", "Path", "Auth", "Description"].map((h) => (
                <span key={h} style={{
                  fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700,
                  color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px",
                }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {ENDPOINTS.map((ep, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "80px 240px 160px 1fr",
                padding: "14px 24px", alignItems: "center",
                borderBottom: i < ENDPOINTS.length - 1 ? "1px solid #F0EDE6" : "none",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500,
                  color: "#FFFFFF", borderRadius: "4px", padding: "2px 8px",
                  backgroundColor: ep.method === "GET" ? "#3B82F6" : "#10B981",
                  alignSelf: "center", justifySelf: "start",
                }}>{ep.method}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#0C0C0C" }}>{ep.path}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280" }}>{ep.auth}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#0C0C0C" }}>{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Create Task detail ───────────────────────────────── */}
      <section style={{ width: "100%", padding: "48px 40px 0", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* Left: endpoint detail */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500,
                color: "#FFFFFF", background: "#10B981", borderRadius: "4px", padding: "2px 8px",
              }}>POST</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks?total=X</span>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
              lineHeight: 1.6, margin: 0,
            }}>
              Create a judgment task. The x402 protocol gates this endpoint — your agent must include
              a valid payment header for the total cost (bounty_per_vote x max_workers). USDC on Base Sepolia.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Request body</span>
              <pre style={{
                background: "#0C0C0C", borderRadius: "12px", padding: "20px",
                fontFamily: "var(--font-mono)", fontSize: "12px", color: "#A3A3A3",
                lineHeight: 1.7, margin: 0, overflow: "auto",
              }}>{`{
  "description": "Which logo feels more premium?",
  "context": "Choosing for a fintech startup...",
  "options": [
    { "label": "Minimal", "content": "Black text" },
    { "label": "Bold", "content": "Gradient icon" }
  ],
  "tier": "reasoned",
  "bounty_per_vote": 0.20,
  "max_workers": 10,
  "requester_wallet": "0x..."
}`}</pre>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response</span>
              <pre style={{
                background: "#0C0C0C", borderRadius: "12px", padding: "20px",
                fontFamily: "var(--font-mono)", fontSize: "12px", color: "#A3A3A3",
                lineHeight: 1.7, margin: 0, overflow: "auto",
              }}>{`{
  "task_id": 42,
  "status": "open",
  "tier": "reasoned",
  "payment_tx_hash": "0xabc..."
}`}</pre>
            </div>
          </div>

          {/* Right: tiers + curl */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Feedback tiers</span>
            {TIERS.map((tier) => (
              <div key={tier.slug} style={{
                background: "#FFFFFF", border: "1.5px solid #E8E5DE", borderRadius: "12px",
                padding: "20px", display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500,
                      color: tier.color, backgroundColor: tier.bg,
                      borderRadius: "100px", padding: "3px 10px",
                    }}>{tier.slug}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600, color: "#0C0C0C" }}>{tier.name}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#10B981", fontWeight: 500 }}>{tier.price}</span>
                </div>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280", lineHeight: 1.5 }}>{tier.desc}</span>
              </div>
            ))}

            <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C", marginTop: "8px" }}>
              Quick example (curl)
            </span>
            <pre style={{
              background: "#0C0C0C", borderRadius: "12px", padding: "20px",
              fontFamily: "var(--font-mono)", fontSize: "11px", color: "#A3A3A3",
              lineHeight: 1.7, margin: 0, overflow: "auto",
            }}>{`# List open tasks
curl https://themo.live/api/tasks

# Get task results
curl https://themo.live/api/tasks/42`}</pre>
          </div>
        </div>
      </section>

      {/* ── Vote endpoint detail ─────────────────────────────── */}
      <section style={{ width: "100%", padding: "48px 40px 0", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500,
                color: "#FFFFFF", background: "#10B981", borderRadius: "4px", padding: "2px 8px",
              }}>POST</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks/:id/vote</span>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
              lineHeight: 1.6, margin: 0,
            }}>
              Submit a vote on a task. Worker must first verify with World ID to get a nullifier_hash.
              Payment is sent automatically to worker_wallet on successful vote.
              One vote per human per task — enforced by nullifier uniqueness.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Request body</span>
              <pre style={{
                background: "#0C0C0C", borderRadius: "12px", padding: "20px",
                fontFamily: "var(--font-mono)", fontSize: "12px", color: "#A3A3A3",
                lineHeight: 1.7, margin: 0, overflow: "auto",
              }}>{`{
  "option_index": 0,
  "nullifier_hash": "0x1a2b3c...",
  "worker_wallet": "0x...",
  "feedback_text": "Option A feels cleaner"
}`}</pre>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 500,
                color: "#FFFFFF", background: "#3B82F6", borderRadius: "4px", padding: "2px 8px",
              }}>GET</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 500, color: "#0C0C0C" }}>/api/tasks/:id</span>
            </div>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
              lineHeight: 1.6, margin: 0,
            }}>
              Returns full task details, live vote distribution across all options, confidence score,
              current winner, total USDC paid, and recent votes with feedback and reputation badges.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: "#0C0C0C" }}>Response shape</span>
              <pre style={{
                background: "#0C0C0C", borderRadius: "12px", padding: "20px",
                fontFamily: "var(--font-mono)", fontSize: "12px", color: "#A3A3A3",
                lineHeight: 1.7, margin: 0, overflow: "auto",
              }}>{`{
  "task": { "id": 42, "description": "...", ... },
  "results": {
    "total_votes": 8,
    "votes_by_option": { "0": 5, "1": 3 },
    "winner": 0,
    "confidence": 0.625,
    "total_paid_usdc": 1.60
  },
  "recent_votes": [
    {
      "option_index": 0,
      "feedback_text": "Cleaner lines...",
      "reputation_badge": "gold"
    }
  ]
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Anti-sybil section ───────────────────────────────── */}
      <section style={{ width: "100%", padding: "48px 40px 64px", backgroundColor: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "#FFFFFF", border: "1.5px solid #E8E5DE", borderRadius: "16px",
            padding: "32px", display: "flex", flexDirection: "column", gap: "16px",
          }}>
            <h2 style={{
              fontFamily: "var(--font-sans)", fontSize: "18px", fontWeight: 700,
              color: "#0C0C0C", letterSpacing: "-0.3px", margin: 0,
            }}>
              Anti-sybil mechanism
            </h2>
            <p style={{
              fontFamily: "var(--font-sans)", fontSize: "14px", color: "#6B7280",
              lineHeight: 1.65, margin: 0,
            }}>
              The <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#0C0C0C", background: "#F0EDE6", padding: "2px 6px", borderRadius: "4px" }}>UNIQUE(task_id, nullifier_hash)</code> constraint
              in the votes table is the entire sybil-resistance implementation. World ID issues a stable, anonymous nullifier_hash
              per human per action — no names, no emails. Postgres enforces one vote per human per task atomically.
            </p>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "100px" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280" }}>World ID zero-knowledge proof</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "100px" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280" }}>One vote per human per task</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "100px" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280" }}>No PII stored</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "100px" }} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#6B7280" }}>x402 payment verification on Base Sepolia</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
