/**
 * Demo script: Create a task on Human Signal using real x402 payment.
 *
 * Prerequisites:
 *   1. Fund the buyer wallet with testnet USDC on Base Sepolia:
 *      https://faucet.circle.com → send to 0xfc271e50E7B1DF02C4430882Ae67C045CD724fa9
 *   2. npm install (already done if you're in the project root)
 *
 * Usage:
 *   npx tsx demo-create-task.ts
 */

import { toClientEvmSigner } from "@x402/evm";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

// ── Buyer wallet (fund this with testnet USDC on Base Sepolia) ──────────
const BUYER_PRIVATE_KEY = process.env.BUYER_PRIVATE_KEY ?? "";
const BUYER_ADDRESS = "0xfc271e50E7B1DF02C4430882Ae67C045CD724fa9";

// ── Config ──────────────────────────────────────────────────────────────
const APP_URL = process.env.APP_URL ?? "https://www.themo.live";

// ── Task content ────────────────────────────────────────────────────────
const task = {
  description: "Which design for Human Signal's homepage is better?",
  context: "We're choosing between two homepage designs for Human Signal. Design A is our current polished version. Design B is an alternative direction. Which one would make you trust the product more?",
  options: [
    { label: "Design A", content: `${APP_URL}/demo/design-a.svg` },
    { label: "Design B", content: `${APP_URL}/demo/design-b.svg` },
  ],
  tier: "reasoned",
  bounty_per_vote: 0.20,
  max_workers: 10,
  requester_wallet: BUYER_ADDRESS,
};

const totalCost = task.bounty_per_vote * task.max_workers;

async function main() {
  console.log("Creating x402 payment client...");
  const account = privateKeyToAccount(BUYER_PRIVATE_KEY as `0x${string}`);
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
  const signer = toClientEvmSigner(account, publicClient);
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const paidFetch = wrapFetchWithPayment(fetch, client);

  console.log(`Buyer wallet: ${BUYER_ADDRESS}`);
  console.log(`Total cost: $${totalCost.toFixed(2)} USDC (${task.max_workers} votes x $${task.bounty_per_vote})`);
  console.log(`Posting to ${APP_URL}/api/tasks...`);
  console.log();

  const res = await paidFetch(`${APP_URL}/api/tasks`, {
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
