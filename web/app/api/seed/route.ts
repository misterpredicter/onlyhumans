import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { ECONOMICS, calculateSplit } from "@/lib/economics";

// GET /api/seed?key=<INIT_SECRET> — seed 5 demo tasks with fake workers and votes
// Idempotent: checks for existing seed data before inserting.
// Production: requires ?key= matching INIT_SECRET env var.
// Dev: works without a key.

const SEED_MARKER = "[DEMO]";
const DEMO_WALLET = "0x0000000000000000000000000000000000000001";
const NUM_FAKE_WORKERS = 22;

interface SeedTask {
  description: string;
  context: string;
  tier: string;
  bounty_per_vote: number;
  max_workers: number;
  idea_contributor_share: number;
  options: Array<{ label: string; content: string }>;
  vote_count: number;
}

const DEMO_TASKS: SeedTask[] = [
  {
    description: `Which landing page headline converts better for a B2B SaaS product? ${SEED_MARKER}`,
    context:
      "Targeting growth-stage startups ($50–200/mo). Audience: ops and growth leads at Series A companies. We've A/B tested email subject lines but not the landing page headline yet.",
    tier: "reasoned",
    bounty_per_vote: 0.12,
    max_workers: 20,
    idea_contributor_share: 0.04,
    options: [
      { label: "Headline A", content: "Close More Deals with AI" },
      { label: "Headline B", content: "Your Sales Team, Supercharged" },
    ],
    vote_count: 12,
  },
  {
    description: `Which app icon design feels more trustworthy for a fintech app? ${SEED_MARKER}`,
    context:
      "Consumer-facing payments app. Users are 25–40, smartphone-native but skeptical of new financial products. Trust is the primary emotional barrier to adoption.",
    tier: "quick",
    bounty_per_vote: 0.08,
    max_workers: 25,
    idea_contributor_share: 0.07,
    options: [
      {
        label: "Icon A",
        content: "Minimalist shield in deep blue on white — clean, institutional",
      },
      {
        label: "Icon B",
        content: "Abstract geometric lock in emerald green on dark — modern, tech-forward",
      },
    ],
    vote_count: 8,
  },
  {
    description: `Which ad copy drives more clicks for a consumer fitness app? ${SEED_MARKER}`,
    context:
      "Facebook/Instagram ads targeting 28–45 year olds who've quit workout apps before. The hook needs to acknowledge past failure and reframe it. CTA is app install.",
    tier: "quick",
    bounty_per_vote: 0.08,
    max_workers: 30,
    idea_contributor_share: 0.05,
    options: [
      { label: "Copy A", content: "Get fit in 7 minutes a day" },
      { label: "Copy B", content: "The only workout app you'll actually stick with" },
    ],
    vote_count: 15,
  },
  {
    description: `Which logo feels most premium for a luxury boutique hotel brand? ${SEED_MARKER}`,
    context:
      "5-star hotel chain launching in NYC and Miami. Competing with Aman and 1 Hotels. Target customer spends $500+/night. Looking for something that reads collected, not corporate.",
    tier: "detailed",
    bounty_per_vote: 0.2,
    max_workers: 30,
    idea_contributor_share: 0.12,
    options: [
      {
        label: "Logo A",
        content: "Clean sans-serif wordmark in gold on black — minimal, architectural",
      },
      {
        label: "Logo B",
        content: "Elegant script lettermark with Art Deco ornament — heritage, handcrafted",
      },
      {
        label: "Logo C",
        content: "Geometric monogram in matte black — collector aesthetic, modern luxury",
      },
    ],
    vote_count: 20,
  },
  {
    description: `Which product description drives more purchase intent for premium wireless earbuds? ${SEED_MARKER}`,
    context:
      "Premium earbuds at $299, competing with AirPods Pro and Sony XM5. Differentiator: best-in-class ANC with 30-hour battery. Trying to own 'zero compromise' positioning.",
    tier: "reasoned",
    bounty_per_vote: 0.15,
    max_workers: 20,
    idea_contributor_share: 0.03,
    options: [
      { label: "Copy A", content: "30-hour battery. ANC. Zero compromise." },
      { label: "Copy B", content: "Hear everything. Block everything else." },
    ],
    vote_count: 6,
  },
];

export async function GET(req: NextRequest) {
  // Auth: same pattern as /api/init
  if (process.env.NODE_ENV === "production") {
    const key = req.nextUrl.searchParams.get("key");
    const secret = process.env.INIT_SECRET;
    if (!secret || key !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    // Idempotency: check for existing seed data
    const likePattern = `%${SEED_MARKER}%`;
    const { rows: existing } = await sql`
      SELECT id FROM tasks WHERE description LIKE ${likePattern} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Already seeded — skipping",
        skipped: true,
      });
    }

    // --- 1. Create fake worker pool ---
    const fakeWorkers: string[] = Array.from(
      { length: NUM_FAKE_WORKERS },
      (_, i) => `seed_demo_worker_${String(i).padStart(4, "0")}`
    );

    for (const nullifier of fakeWorkers) {
      const earnedBase = 0.5 + Math.random() * 4;
      const totalVotes = Math.floor(Math.random() * 18) + 5;
      const score = (3 + Math.random() * 2).toFixed(2);
      const avgRating = (3.5 + Math.random() * 1.5).toFixed(2);
      const badge = totalVotes >= 20 ? "gold" : totalVotes >= 10 ? "silver" : totalVotes >= 5 ? "bronze" : "new";
      const verifiedAt = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString();

      await sql`
        INSERT INTO workers (nullifier_hash, wallet_address, verified_at, total_earned)
        VALUES (${nullifier}, ${DEMO_WALLET}, ${verifiedAt}, ${earnedBase.toFixed(4)})
        ON CONFLICT (nullifier_hash) DO NOTHING
      `;

      await sql`
        INSERT INTO reputation (nullifier_hash, score, total_votes, total_detailed, avg_rating, badge)
        VALUES (${nullifier}, ${score}, ${totalVotes}, ${Math.floor(totalVotes * 0.3)}, ${avgRating}, ${badge})
        ON CONFLICT (nullifier_hash) DO NOTHING
      `;
    }

    // --- 2. Insert tasks, options, and votes ---
    const insertedTaskIds: string[] = [];

    for (let taskIdx = 0; taskIdx < DEMO_TASKS.length; taskIdx++) {
      const t = DEMO_TASKS[taskIdx];
      const opt0 = t.options[0];
      const opt1 = t.options[1];

      // Insert task
      const { rows: taskRows } = await sql`
        INSERT INTO tasks (
          description, option_a, option_b, option_a_label, option_b_label,
          bounty_per_vote, max_workers, requester_wallet,
          context, tier, status, idea_contributor_share
        )
        VALUES (
          ${t.description},
          ${opt0.content}, ${opt1.content},
          ${opt0.label}, ${opt1.label},
          ${t.bounty_per_vote}, ${t.max_workers}, ${DEMO_WALLET},
          ${t.context}, ${t.tier}, 'open', ${t.idea_contributor_share}
        )
        RETURNING id
      `;

      const taskId = taskRows[0].id;
      insertedTaskIds.push(taskId);

      // Insert task_options for all N options
      for (let i = 0; i < t.options.length; i++) {
        const opt = t.options[i];
        await sql`
          INSERT INTO task_options (task_id, option_index, label, content)
          VALUES (${taskId}, ${i}, ${opt.label}, ${opt.content})
          ON CONFLICT (task_id, option_index) DO NOTHING
        `;
      }

      // Insert votes — spread over the last 24 hours using JS timestamps
      const numOptions = t.options.length;
      const now = Date.now();
      const ideaContributorShare =
        t.idea_contributor_share ?? ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE;

      for (let v = 0; v < t.vote_count && v < fakeWorkers.length; v++) {
        const nullifier = fakeWorkers[v];
        const optionIndex = v % numOptions;
        // Legacy choice column: map 0→A, else→B (same logic as vote route)
        const choice = optionIndex === 0 ? "A" : "B";
        const split = calculateSplit(t.bounty_per_vote, ideaContributorShare);
        const txHash = `seed_tx_${taskId}_${String(v).padStart(4, "0")}`;
        // Spread timestamps evenly over the last 24h, oldest first
        const hoursAgo = ((t.vote_count - v) / t.vote_count) * 23 + 0.5;
        const createdAt = new Date(now - hoursAgo * 60 * 60 * 1000).toISOString();

        const { rows: voteRows } = await sql`
          INSERT INTO votes (task_id, nullifier_hash, choice, option_index, payment_tx_hash, created_at)
          VALUES (${taskId}, ${nullifier}, ${choice}, ${optionIndex}, ${txHash}, ${createdAt})
          ON CONFLICT (task_id, nullifier_hash) DO NOTHING
          RETURNING id
        `;

        const voteId = voteRows[0]?.id;
        if (!voteId) continue;

        await sql`
          UPDATE workers
          SET total_earned = total_earned + ${split.worker}
          WHERE nullifier_hash = ${nullifier}
        `;

        await sql`
          INSERT INTO payments (type, wallet_address, amount_usdc, tx_hash, task_id, created_at)
          VALUES ('worker_payout', ${DEMO_WALLET}, ${split.worker}, ${txHash}, ${taskId}, ${createdAt})
        `;

        await sql`
          INSERT INTO platform_ledger (
            vote_id,
            task_id,
            bounty_per_vote,
            worker_amount,
            idea_contributor_amount,
            platform_amount,
            founder_amount,
            early_collaborator_amount,
            idea_contributor_share,
            created_at
          )
          VALUES (
            ${voteId},
            ${taskId},
            ${t.bounty_per_vote},
            ${split.worker},
            ${split.idea_contributor},
            ${split.platform},
            ${split.founder},
            0,
            ${ideaContributorShare},
            ${createdAt}
          )
        `;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${DEMO_TASKS.length} demo tasks with ${NUM_FAKE_WORKERS} fake workers`,
      task_ids: insertedTaskIds,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", detail: String(error) },
      { status: 500 }
    );
  }
}
