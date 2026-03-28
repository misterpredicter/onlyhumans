import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { sql } from "@/lib/db";
import { ECONOMICS } from "@/lib/economics";
import { normalizeCallbackUrl } from "@/lib/task-callbacks";
import { getPaymentConfig, getX402Server } from "@/lib/x402-server";

interface TaskOptionInput {
  label: string;
  content: string;
}

interface CreateTaskBody {
  description?: string;
  options?: TaskOptionInput[];
  option_a?: string;
  option_b?: string;
  option_a_label?: string;
  option_b_label?: string;
  context?: string | null;
  max_workers?: number | string;
  bounty_per_vote?: number | string;
  requester_wallet?: string;
  tier?: "quick" | "reasoned" | "detailed";
  callback_url?: string | null;
  idea_contributor_share?: number | string;
}

// GET /api/tasks — list open tasks with options array
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT
        t.*,
        COALESCE((SELECT COUNT(*)::int FROM votes v WHERE v.task_id = t.id), 0) AS vote_count,
        COALESCE((
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT('option_index', o.option_index, 'label', o.label, 'content', o.content)
            ORDER BY o.option_index
          )
          FROM task_options o WHERE o.task_id = t.id
        ), '[]'::json) AS options
      FROM tasks t
      WHERE t.status = 'open'
      ORDER BY t.created_at DESC
      LIMIT 50
    `;

    return NextResponse.json(
      { tasks: rows },
      {
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toInteger(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function deriveTotalCostFromBody(body: CreateTaskBody) {
  const bountyPerVote = toNumber(body.bounty_per_vote, 0.08);
  const maxWorkers = toInteger(body.max_workers, 20);

  if (!Number.isFinite(bountyPerVote) || !Number.isInteger(maxWorkers)) {
    return Number.NaN;
  }

  return Number((bountyPerVote * maxWorkers).toFixed(2));
}

// Inner handler — only runs after x402 payment verified
async function createTaskHandler(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as CreateTaskBody;
  const {
    description,
    options,
    option_a,
    option_b,
    option_a_label = "Option A",
    option_b_label = "Option B",
    context,
    requester_wallet,
    tier = "quick",
  } = body;

  const max_workers = toInteger(body.max_workers, 20);
  const bounty_per_vote = toNumber(body.bounty_per_vote, 0.08);
  const idea_contributor_share = toNumber(
    body.idea_contributor_share,
    ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
  );

  if (!description?.trim()) {
    return NextResponse.json(
      { error: "Missing required field: description" },
      { status: 400 }
    );
  }

  const isDemo = process.env.DEMO_MODE === "true";
  const resolvedWallet: string = requester_wallet?.trim()
    ? requester_wallet.trim()
    : isDemo
    ? "0x0000000000000000000000000000000000000001"
    : "";

  if (!resolvedWallet) {
    return NextResponse.json(
      { error: "Missing required field: requester_wallet" },
      { status: 400 }
    );
  }

  if (!isDemo && !/^0x[a-fA-F0-9]{40}$/.test(resolvedWallet)) {
    return NextResponse.json(
      { error: "requester_wallet must be a valid Ethereum address (0x...)" },
      { status: 400 }
    );
  }

  const validTiers = ["quick", "reasoned", "detailed"];
  if (!validTiers.includes(tier)) {
    return NextResponse.json(
      { error: `tier must be one of: ${validTiers.join(", ")}` },
      { status: 400 }
    );
  }

  if (bounty_per_vote < 0.01) {
    return NextResponse.json(
      { error: "Bounty per vote must be at least $0.01" },
      { status: 400 }
    );
  }

  if (
    !Number.isFinite(idea_contributor_share) ||
    idea_contributor_share < ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min ||
    idea_contributor_share > ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max
  ) {
    return NextResponse.json(
      {
        error: `idea_contributor_share must be between ${ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min} and ${ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max}`,
      },
      { status: 400 }
    );
  }

  if (!Number.isInteger(max_workers) || max_workers < 1 || max_workers > 100) {
    return NextResponse.json(
      { error: "max_workers must be an integer between 1 and 100" },
      { status: 400 }
    );
  }

  let normalizedCallbackUrl: string | null;
  try {
    normalizedCallbackUrl = normalizeCallbackUrl(body.callback_url);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid callback_url" },
      { status: 400 }
    );
  }

  let resolvedOptions: TaskOptionInput[];
  if (Array.isArray(options) && options.length >= 2) {
    if (options.length > 6) {
      return NextResponse.json(
        { error: "Maximum 6 options allowed" },
        { status: 400 }
      );
    }

    if (options.some((option) => !option.content?.trim())) {
      return NextResponse.json(
        { error: "All options must have non-empty content" },
        { status: 400 }
      );
    }

    resolvedOptions = options;
  } else if (option_a && option_b) {
    resolvedOptions = [
      { label: option_a_label, content: option_a },
      { label: option_b_label, content: option_b },
    ];
  } else {
    return NextResponse.json(
      { error: "Provide either options[] (2+ items) or option_a + option_b" },
      { status: 400 }
    );
  }

  const x402TxHash = req.headers.get("x-payment-response") ?? null;
  const opt0 = resolvedOptions[0];
  const opt1 = resolvedOptions[1];

  try {
    const { rows } = await sql`
      INSERT INTO tasks (
        description, option_a, option_b, option_a_label, option_b_label,
        bounty_per_vote, max_workers, requester_wallet, x402_tx_hash,
        context, tier, callback_url, idea_contributor_share
      )
      VALUES (
        ${description},
        ${opt0.content}, ${opt1.content},
        ${opt0.label}, ${opt1.label},
        ${bounty_per_vote}, ${max_workers},
        ${resolvedWallet}, ${x402TxHash},
        ${context ?? null}, ${tier}, ${normalizedCallbackUrl}, ${idea_contributor_share}
      )
      RETURNING id, status, created_at, tier, idea_contributor_share
    `;

    const task = rows[0];

    for (let index = 0; index < resolvedOptions.length; index++) {
      const option = resolvedOptions[index];
      await sql`
        INSERT INTO task_options (task_id, option_index, label, content)
        VALUES (${task.id}, ${index}, ${option.label}, ${option.content})
        ON CONFLICT (task_id, option_index) DO UPDATE
        SET label = EXCLUDED.label, content = EXCLUDED.content
      `;
    }

    const origin = req.nextUrl.origin;

    return NextResponse.json({
      task_id: task.id,
      status: task.status,
      tier: task.tier,
      idea_contributor_share: parseFloat(task.idea_contributor_share),
      payment_tx_hash: x402TxHash,
      created_at: task.created_at,
      callback_url: normalizedCallbackUrl,
      total_cost_usdc: deriveTotalCostFromBody(body),
      results_url: `${origin}/api/tasks/${task.id}`,
      task_url: `${origin}/task/${task.id}`,
    });
  } catch (error) {
    console.error("POST /api/tasks create error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// Cache x402 handlers by price to avoid recreating on every request.
// withX402 calls syncFacilitatorOnStart which is expensive to repeat per-request.
const handlerCache = new Map<string, (req: NextRequest) => Promise<NextResponse>>();

function getOrCreateHandler(totalCost: number) {
  const key = totalCost.toFixed(2);
  let handler = handlerCache.get(key);

  if (!handler) {
    const paymentConfig = getPaymentConfig(totalCost);
    handler = withX402(
      createTaskHandler,
      paymentConfig,
      getX402Server(),
      undefined,
      undefined,
      true
    );
    handlerCache.set(key, handler);

    if (handlerCache.size > 50) {
      const firstKey = handlerCache.keys().next().value;
      if (firstKey !== undefined) {
        handlerCache.delete(firstKey);
      }
    }
  }

  return handler;
}

// POST /api/tasks
// The x402 price is derived from bounty_per_vote * max_workers in the request body.
// Set DEMO_MODE=true to bypass x402 payment gate (for demos/testing only).
export async function POST(req: NextRequest) {
  if (process.env.DEMO_MODE === "true") {
    return createTaskHandler(req);
  }

  let totalCost: number;
  try {
    const body = (await req.clone().json()) as CreateTaskBody;
    totalCost = deriveTotalCostFromBody(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (isNaN(totalCost) || totalCost < 0.01) {
    return NextResponse.json(
      { error: "Invalid bounty_per_vote or max_workers" },
      { status: 400 }
    );
  }

  try {
    const handler = getOrCreateHandler(totalCost);
    return await handler(req);
  } catch (error) {
    console.error("POST /api/tasks payment gate error:", error);
    return NextResponse.json(
      { error: "Payment gate error", detail: String(error) },
      { status: 500 }
    );
  }
}
