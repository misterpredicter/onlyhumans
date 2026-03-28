import Link from "next/link";
import { SplitBadge } from "@/components/SplitBadge";

const BASE = "https://themo.live";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "quickstart", label: "Quickstart" },
  { id: "endpoints", label: "Endpoints" },
  { id: "response-shape", label: "Response shape" },
  { id: "economics", label: "Economics" },
  { id: "use-cases", label: "Use cases" },
];

const ENDPOINTS = [
  { method: "POST", path: "/api/tasks?total=5.00", auth: "x402 payment", desc: "Create and fund a task." },
  { method: "GET", path: "/api/tasks", auth: "none", desc: "List open tasks for contributors." },
  { method: "GET", path: "/api/tasks/:id", auth: "none", desc: "Fetch the live consensus report." },
  { method: "POST", path: "/api/tasks/:id/vote", auth: "World ID nullifier", desc: "Submit a verified human vote." },
  { method: "POST", path: "/api/tasks/:id/rate", auth: "none", desc: "Rate task quality or feedback." },
  { method: "POST", path: "/api/verify-world-id", auth: "none", desc: "Verify a World ID proof and persist the nullifier." },
];

const HOW_IT_WORKS = [
  "Agent creates a task and funds it through x402.",
  "Contributors verify with World ID and vote once.",
  "Task detail page becomes a live decision report with confidence and rationale.",
];

const CURL_EXAMPLE = `curl -X POST "${BASE}/api/tasks?total=4.50" \\
  -H "content-type: application/json" \\
  -H "x-payment: <x402 payment header>" \\
  -d '{
    "description": "Which headline makes this product feel more trustworthy?",
    "context": "Audience is SMB founders evaluating analytics vendors.",
    "options": [
      { "label": "Option A", "content": "Analytics that move as fast as your team." },
      { "label": "Option B", "content": "Trust every growth decision with real-time analytics." }
    ],
    "max_workers": 25,
    "bounty_per_vote": 0.18,
    "requester_wallet": "0xabc...",
    "tier": "reasoned"
  }'`;

const JS_EXAMPLE = `const response = await fetch("${BASE}/api/tasks?total=4.50", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-payment": paymentHeader,
  },
  body: JSON.stringify({
    description: "Which onboarding screen is clearer?",
    options: [
      { label: "A", content: "https://cdn.example.com/onboarding-a.png" },
      { label: "B", content: "https://cdn.example.com/onboarding-b.png" },
    ],
    max_workers: 25,
    bounty_per_vote: 0.18,
    requester_wallet: "0xabc...",
    tier: "reasoned",
  }),
});

const { task_id } = await response.json();`;

const RESPONSE_EXAMPLE = `{
  "task": {
    "id": "5ca21d37-...",
    "description": "Which landing page feels more premium?",
    "tier": "reasoned",
    "status": "open",
    "max_workers": 25,
    "bounty_per_vote": 0.18
  },
  "results": {
    "total_votes": 12,
    "votes_by_option": { "0": 8, "1": 4 },
    "winner": 0,
    "confidence": 0.67,
    "verified_workers": 12,
    "total_paid_usdc": 2.16
  },
  "consensus": {
    "winner": 0,
    "confidence": 0.67,
    "distribution": { "0": 8, "1": 4 },
    "agreement_score": 0.31
  },
  "provenance": {
    "unique_humans": 12,
    "verification": "world-id-v4",
    "chain": "base-sepolia"
  }
}`;

const USE_CASES = [
  {
    title: "RLHF and model evaluation",
    body: "Route pairwise comparisons to unique humans instead of anonymous label farms.",
  },
  {
    title: "Creative and conversion testing",
    body: "Score headlines, hero sections, packaging, or visual systems with trustworthy human taste.",
  },
  {
    title: "Agent escalation",
    body: "When autonomous flows hit ambiguity, Human Signal acts like a decision oracle rather than another heuristic.",
  },
  {
    title: "Trust and safety edge cases",
    body: "Collect verified human judgments for moderation and policy decisions where nuance matters.",
  },
];

function methodStyle(method: string): React.CSSProperties {
  const background =
    method === "GET"
      ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
      : "linear-gradient(135deg, #10B981 0%, #059669 100%)";

  return {
    background,
    color: "#FFFFFF",
    fontFamily: "var(--font-mono), monospace",
    fontSize: "11px",
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: "999px",
    display: "inline-flex",
    width: "fit-content",
  };
}

function Section({
  id,
  kicker,
  title,
  body,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="docs-card surface-card">
      <div style={{ marginBottom: "22px" }}>
        <div className="section-kicker" style={{ marginBottom: "10px" }}>
          {kicker}
        </div>
        <h2 style={{ margin: "0 0 10px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.05em" }}>{title}</h2>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.75, color: "#6B7280", maxWidth: "720px" }}>{body}</p>
      </div>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="page-shell">
      <div className="premium-card" style={{ padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "760px" }}>
            <div className="eyebrow-pill" style={{ color: "#6B7280", background: "rgba(12,12,12,0.04)", borderColor: "rgba(12,12,12,0.08)", marginBottom: "14px" }}>
              <span className="eyebrow-pill__dot" />
              REST API for verified human judgment
            </div>
            <h1 style={{ margin: "0 0 12px", fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.07em" }}>
              Docs that match the product.
            </h1>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.8, color: "#6B7280", maxWidth: "680px" }}>
              Human Signal is the decision layer for judgment calls. These docs cover the mental model, the task lifecycle, and the exact response shape your agent can consume.
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <SplitBadge compact />
            <Link href="/#launch" className="quiet-link">
              Launch a task
            </Link>
          </div>
        </div>
      </div>

      <div className="docs-shell">
        <aside className="docs-sidebar">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="docs-sidebar__link">
              {item.label}
            </a>
          ))}
        </aside>

        <div className="docs-content">
          <Section
            id="overview"
            kicker="Overview"
            title="What Human Signal actually is"
            body="This is not a survey tool and not a moderation inbox. It is an oracle layer for subjective decisions, built for agents and paid for over HTTP."
          >
            <div className="docs-grid-2col">
              <div style={{ display: "grid", gap: "12px" }}>
                {HOW_IT_WORKS.map((step, index) => (
                  <div key={step} style={{ padding: "18px", borderRadius: "20px", background: "#F8F7F3", border: "1px solid rgba(12,12,12,0.06)" }}>
                    <div className="micro-label" style={{ marginBottom: "8px" }}>
                      step 0{index + 1}
                    </div>
                    <div style={{ fontSize: "15px", lineHeight: 1.7, color: "#20242A", fontWeight: 700 }}>{step}</div>
                  </div>
                ))}
              </div>

              <div className="surface-card" style={{ padding: "22px", background: "linear-gradient(180deg, rgba(12,12,12,0.96) 0%, rgba(29,35,43,0.96) 100%)", color: "#FFFFFF" }}>
                <div className="soft-label" style={{ color: "rgba(255,255,255,0.48)", marginBottom: "10px" }}>
                  Base URL
                </div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "14px" }}>{BASE}</div>
                <div style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.7)" }}>
                  The agent flow is straightforward: create a task, poll the report, and continue once the confidence is good enough for your workflow.
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="quickstart"
            kicker="Quickstart"
            title="Create the task, then wait for the report"
            body="The critical integration detail is that task creation is x402-gated. Once funded, the rest of the protocol is normal HTTP."
          >
            <div className="docs-grid-2col">
              <div>
                <div className="soft-label" style={{ marginBottom: "10px" }}>
                  curl
                </div>
                <pre className="docs-code">{CURL_EXAMPLE}</pre>
              </div>
              <div>
                <div className="soft-label" style={{ marginBottom: "10px" }}>
                  JavaScript
                </div>
                <pre className="docs-code">{JS_EXAMPLE}</pre>
              </div>
            </div>
          </Section>

          <Section
            id="endpoints"
            kicker="Reference"
            title="Endpoint surface"
            body="Keep the API small. Human Signal should feel obvious to integrate: funding, listing, voting, and fetching consensus."
          >
            <div>
              <div className="endpoint-grid" style={{ paddingBottom: "12px", color: "#8A8F98", fontSize: "12px", fontWeight: 700 }}>
                <div>Method</div>
                <div>Path</div>
                <div>Auth</div>
                <div>Purpose</div>
              </div>
              {ENDPOINTS.map((endpoint) => (
                <div key={`${endpoint.method}-${endpoint.path}`} className="endpoint-grid endpoint-row">
                  <div>
                    <span style={methodStyle(endpoint.method)}>{endpoint.method}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", color: "#0C0C0C" }}>{endpoint.path}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>{endpoint.auth}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>{endpoint.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="response-shape"
            kicker="Result Model"
            title="What the consensus report looks like"
            body="The task detail route is the core read primitive. It serves both the frontend and agent consumers, so it includes human-facing and programmatic fields."
          >
            <pre className="docs-code">{RESPONSE_EXAMPLE}</pre>
          </Section>

          <Section
            id="economics"
            kicker="Economics"
            title="Simple enough to explain in a sentence"
            body="The split should be visible everywhere because it is part of the product promise, not hidden implementation detail."
          >
            <div className="docs-grid-2col">
              <div className="surface-card" style={{ padding: "22px", background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(255,255,255,0.88))" }}>
                <SplitBadge />
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  "90% routes to contributors, which includes workers and any market-set idea contributor share inside that bucket.",
                  "9% supports the platform and treasury so the protocol can keep operating.",
                  "1% routes to the founder, making the take obvious instead of hidden.",
                ].map((item) => (
                  <div key={item} style={{ padding: "16px 18px", borderRadius: "18px", background: "#F8F7F3", border: "1px solid rgba(12,12,12,0.06)", fontSize: "14px", lineHeight: 1.75, color: "#6B7280" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section
            id="use-cases"
            kicker="Use Cases"
            title="Where this becomes obviously useful"
            body="Any system that hits a subjective boundary can route into Human Signal. The integration value is speed, provenance, and confidence."
          >
            <div className="docs-grid-2col">
              {USE_CASES.map((item) => (
                <div key={item.title} className="surface-card" style={{ padding: "20px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>{item.title}</div>
                  <div style={{ fontSize: "14px", lineHeight: 1.75, color: "#6B7280" }}>{item.body}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
