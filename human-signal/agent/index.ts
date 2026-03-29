import { Client } from "@xmtp/agent-sdk";
import { Wallet } from "ethers";
import { sql } from "@vercel/postgres";

const POLL_INTERVAL_MS = 30_000;
const APP_URL = process.env.APP_URL ?? "https://www.themo.live";

let lastTaskCreatedAt: Date = new Date(0);

async function broadcastNewTasks(client: Client) {
  try {
    const { rows: newTasks } = await sql`
      SELECT * FROM tasks
      WHERE created_at > ${lastTaskCreatedAt.toISOString()}
        AND status = 'open'
      ORDER BY created_at ASC
    `;

    if (newTasks.length === 0) return;

    // Get all workers with wallet addresses (registered via XMTP)
    const { rows: workers } = await sql`
      SELECT wallet_address FROM workers
      WHERE wallet_address IS NOT NULL
    `;

    for (const task of newTasks) {
      console.log(`Broadcasting task ${task.id} to ${workers.length} workers`);

      for (const worker of workers) {
        try {
          const conversation = await client.conversations.newDm(worker.wallet_address);
          await conversation.send(
            `New task available: "${task.description}"\n` +
            `Earn $${task.bounty_per_vote} USDC per vote\n` +
            `Slots: ${task.max_workers} workers\n` +
            `Vote now: ${APP_URL}/work?task=${task.id}`
          );
        } catch (e) {
          console.error(`Failed to notify worker ${worker.wallet_address}:`, e);
        }
      }

      lastTaskCreatedAt = new Date(task.created_at);
    }
  } catch (e) {
    console.error("broadcastNewTasks error:", e);
  }
}

async function main() {
  const walletKey = process.env.XMTP_WALLET_KEY;
  const dbEncKey = process.env.XMTP_DB_ENCRYPTION_KEY;

  if (!walletKey || !dbEncKey) {
    throw new Error("XMTP_WALLET_KEY and XMTP_DB_ENCRYPTION_KEY must be set");
  }

  const wallet = new Wallet(walletKey);
  console.log("XMTP agent wallet:", wallet.address);

  const client = await Client.create(wallet as unknown as Parameters<typeof Client.create>[0], {
    env: (process.env.XMTP_ENV as "production" | "dev") ?? "production",
    dbPath: "./xmtp-agent.db",
    dbEncryptionKey: Buffer.from(dbEncKey, "hex"),
  });

  console.log("XMTP agent running:", client.address);
  console.log(`Polling for new tasks every ${POLL_INTERVAL_MS / 1000}s`);

  // Initial broadcast
  await broadcastNewTasks(client);

  // Poll loop
  setInterval(() => broadcastNewTasks(client), POLL_INTERVAL_MS);

  // Keep process alive
  process.on("SIGINT", () => {
    console.log("XMTP agent shutting down");
    process.exit(0);
  });
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
