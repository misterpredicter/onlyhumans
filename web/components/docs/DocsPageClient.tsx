"use client";

import { useEffect, useState } from "react";
import { EconomicsBreakdown } from "@/components/EconomicsBreakdown";

const BASE_URL = "https://www.themo.live";
const LOCAL_URL = "http://localhost:3000";

type StatusResponse = {
  status: string;
  tasks_active: number;
  tasks_completed: number;
  avg_response_time_seconds: number;
  verified_workers_available: number;
  pricing: {
    quick: string;
    reasoned: string;
    detailed: string;
  };
  economics: {
    contributor_share: string;
    platform_fund: string;
    founder: string;
  };
};

type EndpointDoc = {
  id: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
  note?: string;
  requestType: string;
  responseType: string;
  exampleRequest: string;
  exampleResponse: string;
};

type SdkSnippet = {
  title: string;
  subtitle: string;
  code: string;
};

const surfaceStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(12,12,12,0.08)",
  borderRadius: "24px",
  boxShadow: "0 24px 80px rgba(12, 12, 12, 0.06)",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif",
  fontSize: "clamp(30px, 4vw, 46px)",
  lineHeight: 1,
  letterSpacing: "-0.06em",
  margin: 0,
  color: "#101114",
};

const sectionCopy: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: 1.7,
  color: "#61656D",
  margin: 0,
  maxWidth: "760px",
};

const codeStyle: React.CSSProperties = {
  margin: 0,
  padding: "20px",
  borderRadius: "18px",
  background:
    "linear-gradient(180deg, rgba(7,10,15,0.98) 0%, rgba(12,12,12,0.98) 100%)",
  color: "#E7EDF6",
  fontFamily: "var(--font-mono), monospace",
  fontSize: "12px",
  lineHeight: 1.7,
  overflowX: "auto",
  border: "1px solid rgba(255,255,255,0.08)",
};

const endpointDocs: EndpointDoc[] = [
  {
    id: "create-task",
    method: "POST",
    path: "/api/tasks",
    summary:
      "Create a judgment task. The x402 charge is derived from `bounty_per_vote * max_workers`, so you no longer need `?total=` in the URL.",
    note:
      "If the deployment is running with x402 enabled, a plain curl call will return a payment challenge. Use the TypeScript snippet below for production, or run locally with `DEMO_MODE=true` for a zero-friction curl flow.",
    requestType: `type CreateTaskRequest = {
  description: string;
  options:
    | Array<{ label: string; content: string }>
    | never;
  option_a?: string;
  option_b?: string;
  option_a_label?: string;
  option_b_label?: string;
  context?: string | null;
  max_workers?: number; // default 20
  bounty_per_vote?: number; // default 0.08
  requester_wallet: \`0x\${string}\`;
  tier?: "quick" | "reasoned" | "detailed";
  callback_url?: string | null;
  idea_contributor_share?: number; // 0.01 to 0.20
};`,
    responseType: `type CreateTaskResponse = {
  task_id: string;
  status: "open";
  tier: "quick" | "reasoned" | "detailed";
  idea_contributor_share: number;
  payment_tx_hash: string | null;
  created_at: string;
  callback_url: string | null;
  total_cost_usdc: number;
  results_url: string;
  task_url: string;
};`,
    exampleRequest: `curl -sX POST ${BASE_URL}/api/tasks \\
  -H "content-type: application/json" \\
  -d '{
    "description": "Which hero headline makes agents trust this product faster?",
    "context": "We are deciding what to ship on the docs homepage.",
    "options": [
      { "label": "A", "content": "Human judgment as an API" },
      { "label": "B", "content": "Verified humans in your agent loop" }
    ],
    "tier": "reasoned",
    "bounty_per_vote": 0.20,
    "max_workers": 3,
    "requester_wallet": "0x1111111111111111111111111111111111111111",
    "callback_url": "https://agent.example.com/hooks/human-signal",
    "idea_contributor_share": 0.05
  }'`,
    exampleResponse: `{
  "task_id": "36cf5808-fb72-48e3-b7f6-f57d640f3aa2",
  "status": "open",
  "tier": "reasoned",
  "idea_contributor_share": 0.05,
  "payment_tx_hash": "0x4baf...c8a1",
  "created_at": "2026-03-27T22:14:51.184Z",
  "callback_url": "https://agent.example.com/hooks/human-signal",
  "total_cost_usdc": 0.6,
  "results_url": "${BASE_URL}/api/tasks/36cf5808-fb72-48e3-b7f6-f57d640f3aa2",
  "task_url": "${BASE_URL}/task/36cf5808-fb72-48e3-b7f6-f57d640f3aa2"
}`,
  },
  {
    id: "get-task",
    method: "GET",
    path: "/api/tasks/[id]",
    summary:
      "Get structured results for humans or agents. This is the payload you poll, store, or receive via `callback_url`.",
    requestType: `// No request body.
// Path param:
type GetTaskParams = {
  id: string;
};`,
    responseType: `type GetTaskResponse = {
  task: {
    id: string;
    description: string;
    status: string;
    max_workers: number;
    bounty_per_vote: number;
    tier: "quick" | "reasoned" | "detailed";
    context: string | null;
    options: Array<{ option_index: number; label: string; content: string }>;
    idea_contributor_share: number;
  };
  results: {
    total_votes: number;
    votes_a: number;
    votes_b: number;
    votes_by_option: Record<number, number>;
    winner: number | "tie" | null;
    confidence: number;
    verified_workers: number;
    total_paid_usdc: number;
  };
  recent_votes: Array<{
    id: string;
    nullifier_prefix: string;
    voted_at: string | null;
    paid: number;
    option_index: number;
    feedback_text: string | null;
    feedback_rating: number | null;
    reputation_badge: string;
  }>;
  consensus: {
    winner: number | "tie" | null;
    confidence: number;
    distribution: Record<number, number>;
    total_votes: number;
    agreement_score: number;
  };
  provenance: {
    unique_humans: number;
    verification: "world-id-v4";
    nullifier_count: number;
    chain: "base-sepolia";
  };
  meta: {
    created_at: string | null;
    completed_at: string | null;
    tier: string;
    bounty_per_vote: number;
    worker_payout_per_vote: number;
    idea_contributor_share: number;
  };
  economics: {
    contributor_share: number;
    platform_fund: number;
    founder_share: number;
    idea_contributor_share: number;
    worker_share_of_90: number;
    worker_payout_per_vote: number;
    version: number;
  };
};`,
    exampleRequest: `curl -s ${BASE_URL}/api/tasks/36cf5808-fb72-48e3-b7f6-f57d640f3aa2`,
    exampleResponse: `{
  "task": {
    "id": "36cf5808-fb72-48e3-b7f6-f57d640f3aa2",
    "description": "Which hero headline makes agents trust this product faster?",
    "status": "closed",
    "max_workers": 3,
    "bounty_per_vote": 0.2,
    "tier": "reasoned",
    "context": "We are deciding what to ship on the docs homepage.",
    "options": [
      { "option_index": 0, "label": "A", "content": "Human judgment as an API" },
      { "option_index": 1, "label": "B", "content": "Verified humans in your agent loop" }
    ],
    "idea_contributor_share": 0.05
  },
  "results": {
    "total_votes": 3,
    "votes_a": 2,
    "votes_b": 1,
    "votes_by_option": { "0": 2, "1": 1 },
    "winner": null,
    "confidence": 0.6666666667,
    "verified_workers": 3,
    "total_paid_usdc": 0.513
  },
  "consensus": {
    "winner": null,
    "confidence": 0.6666666667,
    "distribution": { "0": 2, "1": 1 },
    "total_votes": 3,
    "agreement_score": 0.0817
  },
  "provenance": {
    "unique_humans": 3,
    "verification": "world-id-v4",
    "nullifier_count": 3,
    "chain": "base-sepolia"
  },
  "meta": {
    "created_at": "2026-03-27T22:14:51.184Z",
    "completed_at": "2026-03-27T22:19:07.401Z",
    "tier": "reasoned",
    "bounty_per_vote": 0.2,
    "worker_payout_per_vote": 0.171,
    "idea_contributor_share": 0.05
  },
  "economics": {
    "contributor_share": 0.9,
    "platform_fund": 0.09,
    "founder_share": 0.01,
    "idea_contributor_share": 0.05,
    "worker_share_of_90": 0.95,
    "worker_payout_per_vote": 0.171,
    "version": 1
  }
}`,
  },
  {
    id: "submit-vote",
    method: "POST",
    path: "/api/tasks/[id]/vote",
    summary:
      "Submit a verified human vote. Requires a World ID-backed nullifier already stored by `/api/verify-world-id`.",
    requestType: `type VoteRequest = {
  nullifier_hash: string;
  worker_wallet?: \`0x\${string}\`;
  option_index?: number;
  choice?: "A" | "B"; // backward compatibility
  feedback_text?: string;
};`,
    responseType: `type VoteResponse = {
  success: true;
  choice: "A" | "B";
  option_index: number;
  payment_tx_hash: string | null;
  amount_paid_usdc: number;
  nullifier_hash: string; // prefix only
  total_votes: number;
  economics: {
    worker_received: number;
    idea_contributor_accrued: number;
    platform_accrued: number;
    founder_accrued: number;
  };
};`,
    exampleRequest: `curl -sX POST ${BASE_URL}/api/tasks/36cf5808-fb72-48e3-b7f6-f57d640f3aa2/vote \\
  -H "content-type: application/json" \\
  -d '{
    "nullifier_hash": "0xworldid-nullifier",
    "worker_wallet": "0x2222222222222222222222222222222222222222",
    "option_index": 0,
    "feedback_text": "A lands faster for an agent developer because it names the category immediately."
  }'`,
    exampleResponse: `{
  "success": true,
  "choice": "A",
  "option_index": 0,
  "payment_tx_hash": "0xd13c...9fa1",
  "amount_paid_usdc": 0.171,
  "nullifier_hash": "0xworldi",
  "total_votes": 3,
  "economics": {
    "worker_received": 0.171,
    "idea_contributor_accrued": 0.009,
    "platform_accrued": 0.018,
    "founder_accrued": 0.002
  }
}`,
  },
  {
    id: "init-db",
    method: "GET",
    path: "/api/init",
    summary:
      "Initialize the database tables. In production this requires `?key=` matching `INIT_SECRET`; in development it is open.",
    requestType: `// No request body.
// Optional query param in production:
type InitQuery = {
  key?: string;
};`,
    responseType: `type InitResponse =
  | { success: true; message: string }
  | { error: string; detail?: string };`,
    exampleRequest: `curl -s ${LOCAL_URL}/api/init`,
    exampleResponse: `{
  "success": true,
  "message": "Database initialized"
}`,
  },
];

const sdkSnippets: SdkSnippet[] = [
  {
    title: "Python / requests",
    subtitle: "Good for demo mode, local integration tests, or a payment proxy.",
    code: `import requests

task = {
    "description": "Which checkout flow feels safer?",
    "options": [
        {"label": "A", "content": "Single-page checkout"},
        {"label": "B", "content": "Step-by-step checkout"},
    ],
    "tier": "reasoned",
    "bounty_per_vote": 0.20,
    "max_workers": 3,
    "requester_wallet": "0x1111111111111111111111111111111111111111",
    "callback_url": "https://agent.example.com/hooks/human-signal",
}

res = requests.post(f"{BASE_URL}/api/tasks", json=task, timeout=15)
print(res.status_code, res.json())`,
  },
  {
    title: "TypeScript / fetch + x402",
    subtitle: "Production path with automatic payment handling.",
    code: `import { toClientEvmSigner } from "@x402/evm";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const account = privateKeyToAccount(process.env.BUYER_PRIVATE_KEY as \`0x\${string}\`);
const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
const signer = toClientEvmSigner(account, publicClient);
const client = new x402Client();
registerExactEvmScheme(client, { signer });
const paidFetch = wrapFetchWithPayment(fetch, client);

const res = await paidFetch("${BASE_URL}/api/tasks", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    description: "Which launch email gets more replies?",
    options: [
      { label: "A", content: "Short and direct" },
      { label: "B", content: "Long and story-driven" }
    ],
    tier: "reasoned",
    bounty_per_vote: 0.20,
    max_workers: 5,
    requester_wallet: "0x1111111111111111111111111111111111111111",
    callback_url: "https://agent.example.com/hooks/human-signal"
  }),
});

const task = await res.json();`,
  },
  {
    title: "curl",
    subtitle: "Fastest way to see the shape of the API.",
    code: `curl -sX POST ${BASE_URL}/api/tasks \\
  -H "content-type: application/json" \\
  -d '{
    "description": "Which agent onboarding headline is stronger?",
    "options": [
      { "label": "A", "content": "Human judgment as an API" },
      { "label": "B", "content": "Verified humans for your agent stack" }
    ],
    "requester_wallet": "0x1111111111111111111111111111111111111111"
  }'

curl -s ${BASE_URL}/api/tasks/<task_id>`,
  },
  {
    title: "LangChain Tool",
    subtitle: "Conceptual wrapper for agent frameworks.",
    code: `import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const humanSignalTool = new DynamicStructuredTool({
  name: "get_verified_human_judgment",
  description: "Route a subjective decision to verified humans and return consensus.",
  schema: z.object({
    description: z.string(),
    options: z.array(z.object({
      label: z.string(),
      content: z.string(),
    })).min(2),
  }),
  func: async ({ description, options }) => {
    const createRes = await fetch("${BASE_URL}/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        description,
        options,
        tier: "reasoned",
        bounty_per_vote: 0.20,
        max_workers: 5,
        requester_wallet: process.env.HUMAN_SIGNAL_WALLET,
        callback_url: process.env.HUMAN_SIGNAL_CALLBACK_URL,
      }),
    });

    return await createRes.json();
  },
});`,
  },
];

function CodePanel({
  label,
  code,
}: {
  label: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      style={{
        ...surfaceStyle,
        padding: "16px",
        background: "rgba(14, 16, 20, 0.98)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.58)",
          }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px",
            background: copied ? "#D2F6E9" : "rgba(255,255,255,0.05)",
            color: copied ? "#0C7A53" : "#F5F7FA",
            padding: "7px 12px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={codeStyle}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  const palette =
    method === "POST"
      ? { bg: "#DDF5EA", color: "#0C7A53", border: "#B5E8CE" }
      : { bg: "#E5EEFF", color: "#2453D4", border: "#C9D9FF" };

  return (
    <span
      style={{
        fontFamily: "var(--font-mono), monospace",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "6px 10px",
        borderRadius: "999px",
        background: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        fontWeight: 700,
      }}
    >
      {method}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: EndpointDoc }) {
  return (
    <article
      id={endpoint.id}
      style={{
        ...surfaceStyle,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <MethodBadge method={endpoint.method} />
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "15px",
              color: "#11131A",
              fontWeight: 600,
            }}
          >
            {endpoint.path}
          </span>
        </div>
        <p style={{ ...sectionCopy, maxWidth: "unset" }}>{endpoint.summary}</p>
        {endpoint.note ? (
          <div
            style={{
              borderRadius: "18px",
              padding: "14px 16px",
              background: "#FFF6D9",
              color: "#6A5716",
              border: "1px solid #F2DD95",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            {endpoint.note}
          </div>
        ) : null}
      </div>

      <div className="docs-code-grid">
        <CodePanel label="Request Body" code={endpoint.requestType} />
        <CodePanel label="Response Body" code={endpoint.responseType} />
      </div>

      <div className="docs-code-grid">
        <CodePanel label="Example Request" code={endpoint.exampleRequest} />
        <CodePanel label="Example Response" code={endpoint.exampleResponse} />
      </div>
    </article>
  );
}

function formatRuntime(seconds: number) {
  if (seconds <= 0) {
    return "No closed tasks yet";
  }

  if (seconds < 60) {
    return `${seconds}s average`;
  }

  const minutes = Math.round(seconds / 60);
  return `${minutes}m average`;
}

export function DocsPageClient() {
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  const defaults = {
    status: "operational",
    tasks_active: 0,
    tasks_completed: 0,
    avg_response_time_seconds: 0,
    verified_workers_available: 0,
    pricing: {
      quick: "$0.08/vote",
      reasoned: "$0.20/vote",
      detailed: "$0.50/vote",
    },
    economics: {
      contributor_share: "90%",
      platform_fund: "9%",
      founder: "1%",
    },
  };
  const liveStatus = {
    ...defaults,
    ...(status && !(status as any).error ? status : {}),
    pricing: status?.pricing ?? defaults.pricing,
    economics: status?.economics ?? defaults.economics,
  };

  const statusExample = `{
  "status": "${liveStatus.status}",
  "tasks_active": ${liveStatus.tasks_active},
  "tasks_completed": ${liveStatus.tasks_completed},
  "avg_response_time_seconds": ${liveStatus.avg_response_time_seconds},
  "verified_workers_available": ${liveStatus.verified_workers_available},
  "pricing": {
    "quick": "${liveStatus.pricing.quick}",
    "reasoned": "${liveStatus.pricing.reasoned}",
    "detailed": "${liveStatus.pricing.detailed}"
  },
  "economics": {
    "contributor_share": "${liveStatus.economics.contributor_share}",
    "platform_fund": "${liveStatus.economics.platform_fund}",
    "founder": "${liveStatus.economics.founder}"
  }
}`;

  return (
    <>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 18% 18%, rgba(16,185,129,0.22), transparent 32%), radial-gradient(circle at 82% 10%, rgba(58,130,246,0.18), transparent 28%), linear-gradient(180deg, #080B10 0%, #10131A 72%, #131721 100%)",
          color: "#F6F8FB",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "64px 28px 56px",
            display: "grid",
            gap: "28px",
          }}
          className="docs-hero-grid"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                alignSelf: "flex-start",
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#5DE2A9",
                  boxShadow: "0 0 16px rgba(93,226,169,0.8)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Agent Onboarding
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(44px, 7vw, 84px)",
                lineHeight: 0.94,
                letterSpacing: "-0.07em",
                margin: 0,
                maxWidth: "760px",
              }}
            >
              From zero to verified human judgment in under five minutes.
            </h1>

            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.75,
                color: "rgba(246,248,251,0.72)",
                margin: 0,
                maxWidth: "700px",
              }}
            >
              OnlyHumans gives your agent a clean API for subjective calls. Create a task,
              collect votes from verified humans, receive structured consensus plus provenance,
              and optionally get the final result pushed back to your callback.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                "World ID verified workers",
                "x402-paid task creation",
                "Polling or callback delivery",
              ].map((pill) => (
                <span
                  key={pill}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "13px",
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              ...surfaceStyle,
              padding: "24px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,247,252,0.94) 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#5B6473",
                  }}
                >
                  Live Status
                </p>
                <h2
                  style={{
                    margin: "8px 0 0",
                    fontSize: "28px",
                    lineHeight: 1,
                    letterSpacing: "-0.05em",
                    color: "#11131A",
                  }}
                >
                  {liveStatus.status}
                </h2>
              </div>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "999px",
                  background: "#19B77B",
                  boxShadow: "0 0 18px rgba(25,183,123,0.5)",
                }}
              />
            </div>

            <div className="docs-metric-grid" style={{ marginBottom: "18px" }}>
              {[
                { label: "Active tasks", value: String(liveStatus.tasks_active) },
                { label: "Completed tasks", value: String(liveStatus.tasks_completed) },
                {
                  label: "Response time",
                  value: formatRuntime(liveStatus.avg_response_time_seconds),
                },
                {
                  label: "Verified workers",
                  value: String(liveStatus.verified_workers_available),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: "18px",
                    padding: "16px",
                    background: "#F7F9FC",
                    border: "1px solid #E5EBF4",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#687385" }}>{item.label}</p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      lineHeight: 1.1,
                      color: "#0F1117",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                borderRadius: "18px",
                padding: "16px",
                background: "#0F1218",
                color: "#EDF2F8",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "rgba(237,242,248,0.64)" }}>Pricing</span>
                <span style={{ fontSize: "13px", color: "rgba(237,242,248,0.9)" }}>
                  {liveStatus.pricing.quick} / {liveStatus.pricing.reasoned} / {liveStatus.pricing.detailed}
                </span>
              </div>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "rgba(237,242,248,0.64)" }}>Economics</span>
                <span style={{ fontSize: "13px", color: "rgba(237,242,248,0.9)" }}>
                  {liveStatus.economics.contributor_share} contributors / {liveStatus.economics.platform_fund} platform / {liveStatus.economics.founder} founder pool
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 28px" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div style={{ ...surfaceStyle, padding: "24px" }}>
            <p
              style={{
                margin: "0 0 10px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6C7280",
              }}
            >
              Economics
            </p>
            <h2 style={{ ...sectionTitle, fontSize: "clamp(28px, 3.2vw, 42px)" }}>
              The split is the market.
            </h2>
            <p style={{ ...sectionCopy, marginTop: "14px" }}>
              OnlyHumans keeps the constitution fixed at 90/9/1. Inside the 90%, idea contributors choose their own rate and workers decide whether the task is worth their attention.
            </p>
            <div style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              {[
                "90% goes to contributors: workers plus whoever framed the task.",
                "9% funds platform development: infra, features, growth.",
                "1% goes to the founder. Skin in the game, not hidden rent.",
                "Workers can inspect the split before they vote.",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#19B77B", marginTop: "8px", flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "#61656D" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <EconomicsBreakdown
            taskRevenue={0.2}
            ideaContributorShare={0.05}
            maxWorkers={10}
            title="Reference task split"
            subtitle="Default example: $0.20 revenue per vote, 10 contributors, 5% idea take inside the contributor pool."
          />
        </div>
      </section>

      <section style={{ padding: "40px 28px 0" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 10px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6C7280",
              }}
            >
              Getting Started
            </p>
            <h2 style={sectionTitle}>Two commands. That is the whole mental model.</h2>
            <p style={{ ...sectionCopy, marginTop: "14px" }}>
              First create a task. Then check its results. If you pass a `callback_url`, you do not
              even need to poll after that.
            </p>
          </div>

          <div className="docs-code-grid">
            <CodePanel
              label="1. Create Task"
              code={`curl -sX POST ${BASE_URL}/api/tasks \\
  -H "content-type: application/json" \\
  -d '{
    "description": "Which docs hero makes agent developers trust us faster?",
    "options": [
      { "label": "A", "content": "Human judgment as an API" },
      { "label": "B", "content": "Verified humans in your agent loop" }
    ],
    "tier": "quick",
    "bounty_per_vote": 0.08,
    "max_workers": 3,
    "requester_wallet": "0x1111111111111111111111111111111111111111",
    "callback_url": "https://agent.example.com/hooks/human-signal"
  }'`}
            />
            <CodePanel
              label="2. Check Results"
              code={`curl -s ${BASE_URL}/api/tasks/<task_id>`}
            />
          </div>

          <div
            style={{
              ...surfaceStyle,
              padding: "20px 24px",
              background:
                "linear-gradient(90deg, rgba(16,185,129,0.08) 0%, rgba(58,130,246,0.06) 100%)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                lineHeight: 1.6,
                color: "#101114",
              }}
            >
              That&apos;s it. You just got verified human judgment.
            </p>
          </div>

          <div className="docs-feature-grid">
            {[
              {
                title: "Unique humans only",
                body: "Every vote is tied to a World ID nullifier, so your agent is buying real human disagreement instead of bot noise.",
              },
              {
                title: "Async by default",
                body: "Add `callback_url` on task creation and OnlyHumans POSTs the final structured result back to your agent when voting closes.",
              },
              {
                title: "Consensus plus provenance",
                body: "The result payload includes distribution, confidence, agreement score, chain, and verification metadata so your agent can reason about quality.",
              },
            ].map((feature) => (
              <div key={feature.title} style={{ ...surfaceStyle, padding: "24px" }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "22px",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: "#11131A",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ ...sectionCopy, maxWidth: "unset" }}>{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 28px 0" }}>
        <div className="docs-shell" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <aside className="docs-sidebar" style={{ alignSelf: "start" }}>
            <div style={{ ...surfaceStyle, padding: "18px", position: "sticky", top: "96px" }}>
              <p
                style={{
                  margin: "0 0 14px",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6C7280",
                }}
              >
                Jump To
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { href: "#api-reference", label: "API reference" },
                  { href: "#create-task", label: "POST /api/tasks" },
                  { href: "#get-task", label: "GET /api/tasks/[id]" },
                  { href: "#submit-vote", label: "POST /api/tasks/[id]/vote" },
                  { href: "#init-db", label: "GET /api/init" },
                  { href: "#sdk-snippets", label: "SDK snippets" },
                  { href: "#status", label: "GET /api/status" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      textDecoration: "none",
                      color: "#18212F",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background: "#F6F8FB",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div id="api-reference" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6C7280",
                }}
              >
                Full API Reference
              </p>
              <h2 style={sectionTitle}>Document the real payloads, not marketing gloss.</h2>
              <p style={sectionCopy}>
                Each endpoint below shows the body shape, the returned structure, and a concrete
                request/response pair you can lift into your own agent runtime.
              </p>
            </div>

            {endpointDocs.map((endpoint) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} />
            ))}
          </div>
        </div>
      </section>

      <section id="sdk-snippets" style={{ padding: "64px 28px 0" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6C7280",
              }}
            >
              SDK Snippets
            </p>
            <h2 style={sectionTitle}>Use whatever runtime your agent already lives in.</h2>
            <p style={sectionCopy}>
              Python for quick experiments, TypeScript for x402-aware production calls, curl for
              shape inspection, and a LangChain wrapper when you want OnlyHumans to look like a
              normal tool invocation.
            </p>
          </div>

          <div className="docs-sdk-grid">
            {sdkSnippets.map((snippet) => (
              <div key={snippet.title} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "0 4px" }}>
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "22px",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "#11131A",
                    }}
                  >
                    {snippet.title}
                  </h3>
                  <p style={{ ...sectionCopy, maxWidth: "unset" }}>{snippet.subtitle}</p>
                </div>
                <CodePanel label={snippet.title} code={snippet.code} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="status" style={{ padding: "64px 28px 72px" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid",
            gap: "24px",
          }}
          className="docs-status-grid"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6C7280",
              }}
            >
              Agent Status Endpoint
            </p>
            <h2 style={sectionTitle}>Ping one endpoint to see whether the network is healthy.</h2>
            <p style={sectionCopy}>
              `GET /api/status` gives your agent a lightweight operational snapshot: task load,
              completed volume, estimated response time, worker supply, pricing bands, and the
              headline 90 / 9 / 1 economic split.
            </p>
            <div
              style={{
                ...surfaceStyle,
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MethodBadge method="GET" />
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "15px",
                    color: "#11131A",
                    fontWeight: 600,
                  }}
                >
                  /api/status
                </span>
              </div>
              <p style={{ ...sectionCopy, maxWidth: "unset" }}>
                Use this before creating work or as a health check inside an agent orchestration loop.
              </p>
            </div>
          </div>

          <CodePanel label="Example Response" code={statusExample} />
        </div>
      </section>
    </>
  );
}
