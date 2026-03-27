/**
 * Demo script: Create a task on Human Signal using real x402 payment.
 *
 * Prerequisites:
 *   1. Fund the buyer wallet with testnet USDC on Base Sepolia:
 *      https://faucet.circle.com → send to 0x638515E43Db0a20c9AFA02d4543CF3C6c2148D43
 *   2. npm install (already done if you're in the project root)
 *
 * Usage:
 *   npx tsx demo-create-task.ts
 */

import { createEvmClient } from "@x402/evm/client";
import { toClientEvmSigner } from "@x402/evm";
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

// ── Buyer wallet (fund this with testnet USDC on Base Sepolia) ──────────
const BUYER_PRIVATE_KEY = "0xc796645beb856d202a8d2a65513d3630b79c0dfa7bfab3cadd589b47771f2eb4";
const BUYER_ADDRESS = "0x638515E43Db0a20c9AFA02d4543CF3C6c2148D43";

// ── Config ──────────────────────────────────────────────────────────────
const APP_URL = process.env.APP_URL ?? "https://themo.live";

// ── Task content ────────────────────────────────────────────────────────
const task = {
  description: "Which landing page headline would make you most likely to sign up for a new payments app?",
  context: "We're launching a peer-to-peer payments app targeting 18-30 year olds. Need to pick a hero headline for the landing page. Looking for the option that creates the strongest emotional pull to sign up.",
  options: [
    { label: "Option A", content: "Send money anywhere, instantly" },
    { label: "Option B", content: "The wallet your friends already use" },
    { label: "Option C", content: "Zero fees. Zero friction. Just pay." },
  ],
  tier: "reasoned",
  bounty_per_vote: 0.20,
  max_workers: 10,
  requester_wallet: BUYER_ADDRESS,
};

const totalCost = task.bounty_per_vote * task.max_workers;

async function main() {
  console.log("Creating x402 payment client...");
  const account = privateKeyToAccount(BUYER_PRIVATE_KEY);
  const signer = toClientEvmSigner(account);
  const client = createEvmClient({ signer });
  const paidFetch = wrapFetchWithPayment(fetch, client);

  console.log(`Buyer wallet: ${BUYER_ADDRESS}`);
  console.log(`Total cost: $${totalCost.toFixed(2)} USDC (${task.max_workers} votes x $${task.bounty_per_vote})`);
  console.log(`Posting to ${APP_URL}/api/tasks?total=${totalCost.toFixed(2)}...`);
  console.log();

  const res = await paidFetch(`${APP_URL}/api/tasks?total=${totalCost.toFixed(2)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(task),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed:", res.status, data);
    process.exit(1);
  }

  console.log("Task created!");
  console.log(`  Task ID:    ${data.task_id}`);
  console.log(`  Status:     ${data.status}`);
  console.log(`  Tier:       ${data.tier}`);
  console.log(`  Payment TX: ${data.payment_tx_hash ?? "(demo mode)"}`);
  console.log();
  console.log(`View results: ${APP_URL}/task/${data.task_id}`);
  console.log(`Vote on it:   ${APP_URL}/work`);
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
