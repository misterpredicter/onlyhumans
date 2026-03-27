import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { sql } from "@/lib/db";
import { getX402Server, getTierPaymentConfig, TIER_BOUNTIES, type Tier } from "@/lib/x402-server";

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
  const tier = (req.nextUrl.searchParams.get("tier") ?? "quick") as Tier;

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
    requester_wallet,
  } = body;

  if (!description || !requester_wallet) {
    return NextResponse.json(
      { error: "Missing required fields: description, requester_wallet" },
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

  const bounty = TIER_BOUNTIES[tier] ?? TIER_BOUNTIES.quick;
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
      ${bounty}, ${max_workers},
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

// POST /api/tasks?tier=quick|reasoned|detailed
// Dynamic x402 pricing based on tier query param
export async function POST(req: NextRequest) {
  const tier = ((req.nextUrl.searchParams.get("tier") ?? "quick") as Tier);
  const validTiers: Tier[] = ["quick", "reasoned", "detailed"];
  const safeTier = validTiers.includes(tier) ? tier : "quick";

  const paymentConfig = getTierPaymentConfig(safeTier);
  const handler = withX402(
    createTaskHandler,
    paymentConfig,
    getX402Server(),
    undefined,
    undefined,
    false // syncFacilitatorOnStart
  );
  return handler(req);
}
