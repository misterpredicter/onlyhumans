import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { sql } from "@/lib/db";
import { getX402Server, getPaymentConfig, type Tier } from "@/lib/x402-server";

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
    return NextResponse.json({ tasks: rows });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// Inner handler — only runs after x402 payment verified
async function createTaskHandler(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const {
    description,
    options,              // V2: array of { label, content }
    option_a,             // V1 backward compat
    option_b,
    option_a_label = "Option A",
    option_b_label = "Option B",
    context,
    max_workers = 20,
    bounty_per_vote = 0.08,
    requester_wallet,
    tier = "quick",
  } = body;

  if (!description || !requester_wallet) {
    return NextResponse.json(
      { error: "Missing required fields: description, requester_wallet" },
      { status: 400 }
    );
  }

  if (bounty_per_vote < 0.01) {
    return NextResponse.json(
      { error: "Bounty per vote must be at least $0.01" },
      { status: 400 }
    );
  }

  // Resolve options: V2 array OR V1 A/B pair
  let resolvedOptions: { label: string; content: string }[];
  if (Array.isArray(options) && options.length >= 2) {
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

  // For V1 compat columns, use first two options
  const opt0 = resolvedOptions[0];
  const opt1 = resolvedOptions[1];

  const { rows } = await sql`
    INSERT INTO tasks (
      description, option_a, option_b, option_a_label, option_b_label,
      bounty_per_vote, max_workers, requester_wallet, x402_tx_hash,
      context, tier
    )
    VALUES (
      ${description},
      ${opt0.content}, ${opt1.content},
      ${opt0.label}, ${opt1.label},
      ${bounty_per_vote}, ${max_workers},
      ${requester_wallet}, ${x402TxHash},
      ${context ?? null}, ${tier}
    )
    RETURNING id, status, created_at, tier
  `;

  const task = rows[0];

  // Insert task_options for all N options
  for (let i = 0; i < resolvedOptions.length; i++) {
    const opt = resolvedOptions[i];
    await sql`
      INSERT INTO task_options (task_id, option_index, label, content)
      VALUES (${task.id}, ${i}, ${opt.label}, ${opt.content})
      ON CONFLICT (task_id, option_index) DO UPDATE SET label = EXCLUDED.label, content = EXCLUDED.content
    `;
  }

  return NextResponse.json({
    task_id: task.id,
    status: task.status,
    tier: task.tier,
    payment_tx_hash: x402TxHash,
    created_at: task.created_at,
  });
}

// POST /api/tasks?total=5.00
// x402 charges the total upfront. Bounty per vote + max workers in body.
// Set DEMO_MODE=true to bypass x402 payment gate (for demos/testing only).
export async function POST(req: NextRequest) {
  const totalParam = req.nextUrl.searchParams.get("total");
  const totalCost = parseFloat(totalParam ?? "1.00");

  if (isNaN(totalCost) || totalCost < 0.01) {
    return NextResponse.json({ error: "Invalid total" }, { status: 400 });
  }

  // Demo mode: skip x402 payment gate, call handler directly
  if (process.env.DEMO_MODE === "true") {
    return createTaskHandler(req);
  }

  try {
    const paymentConfig = getPaymentConfig(totalCost);
    const handler = withX402(
      createTaskHandler,
      paymentConfig,
      getX402Server(),
      undefined,
      undefined,
      true // syncFacilitatorOnStart — required for facilitator to know about exact scheme
    );
    return await handler(req);
  } catch (error) {
    console.error("x402 handler error:", error);
    return NextResponse.json(
      { error: "Payment gate error", detail: String(error) },
      { status: 500 }
    );
  }
}
