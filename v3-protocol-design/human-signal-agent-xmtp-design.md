# Human Signal: Agent Participation & XMTP Integration Design

**Status:** Protocol design document
**Date:** 2026-03-27
**Audience:** Developer implementing the next phase of Human Signal

---

## Table of Contents

1. [Agent Participation Model](#part-1-agent-participation-model)
2. [XMTP Integration Architecture](#part-2-xmtp-integration-architecture)
3. [Human Delegation UX](#part-3-human-delegation-ux)
4. [Compute Pledge Mechanism](#part-4-compute-pledge-mechanism)

---

## Part 1: Agent Participation Model

### Agent Identity

An agent on Human Signal needs three things: a way to pay, a way to be identified, and a way to establish trust. The existing infrastructure already provides the first two (x402 wallets and Ethereum addresses). What's missing is the identity and trust layer.

#### Registration Flow

There are two distinct agent types, and they register differently.

**Type 1: Delegated Agent (authorized by a verified human)**

The human already has a World ID verification. They delegate a subset of their capabilities to an agent by signing a delegation credential. The agent operates under the human's identity umbrella but with constrained permissions.

```
Human verifies with World ID
  -> Human creates delegation on-chain (or via API)
  -> Delegation specifies: agent_wallet, permissions[], spending_limit, expiry
  -> Agent registers with Human Signal using delegation proof
  -> Platform verifies: delegation signature + World ID nullifier validity
  -> Agent gets a `delegated_agent` identity tied to the human's nullifier
```

**Type 2: Autonomous Agent (operates with its own wallet, no human backer)**

An autonomous agent has a wallet but no World ID. It can pay for services but cannot provide judgment (since the whole point of Human Signal is verified human signal). Autonomous agents are pure consumers of the platform.

```
Agent calls POST /api/agents/register
  -> Provides: wallet_address, metadata (name, description, callback_url)
  -> No World ID required (agents aren't human)
  -> Gets an API key tied to the wallet
  -> Can create tasks, consume results, stake on markets
  -> Cannot vote (voting requires World ID)
```

**Why this distinction matters:** The platform needs to know whether an agent speaks for a human. A delegated agent submitting pre-annotations carries the human's reputation. An autonomous agent buying judgment signal is just a customer. Conflating these would undermine the World ID guarantee.

#### Identity Structure

```typescript
interface AgentIdentity {
  // Core identity
  agent_id: string;                    // Platform-assigned UUID
  wallet_address: `0x${string}`;       // Primary wallet (pays for tasks, receives payments)
  xmtp_address?: string;              // XMTP inbox address (for messaging)

  // Type discrimination
  type: "delegated" | "autonomous";

  // Delegated agents only
  delegation?: {
    delegator_nullifier: string;       // World ID nullifier of the human who delegated
    permissions: Permission[];         // What the agent can do
    spending_limit_usdc: number;       // Max spend before re-authorization
    spent_usdc: number;                // Running total
    expires_at: string;                // ISO datetime
    delegation_signature: string;      // EIP-712 signature from the human's wallet
  };

  // Autonomous agents only
  api_key?: string;                    // Bearer token for API access
  metadata?: {
    name: string;
    description: string;
    callback_url?: string;             // Webhook for task results
    operator_contact?: string;         // Who to contact about this agent
  };

  // Platform-tracked
  created_at: string;
  total_tasks_created: number;
  total_spent_usdc: number;
  reputation_score: number;            // Agent-side reputation (pays on time, clear tasks)
}
```

#### How to Distinguish Delegated vs Autonomous

Every API request from an agent includes either:

1. **`Authorization: Bearer <api_key>`** -- Autonomous agent. Looked up by API key, resolved to wallet.
2. **`X-Delegation-Proof: <signed_delegation>`** -- Delegated agent. The proof contains the human's nullifier, the agent's wallet, and the permission set. The server verifies the signature against the delegation contract or registry.

The `X-Delegation-Proof` header is a signed EIP-712 message:

```typescript
const delegationTypes = {
  Delegation: [
    { name: "delegator_nullifier", type: "bytes32" },
    { name: "agent_wallet", type: "address" },
    { name: "permissions", type: "uint256" },     // Bitmask
    { name: "spending_limit", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "expires_at", type: "uint256" },
  ],
};
```

The server checks:
1. Signature is valid (recovers to the delegator's wallet)
2. Delegator's wallet is linked to a valid World ID nullifier in the `workers` table
3. Permissions bitmask allows the requested action
4. Spending limit hasn't been exceeded
5. Delegation hasn't expired

### Agent Capabilities Matrix

Permissions are encoded as a bitmask. Each bit represents a capability.

```typescript
enum Permission {
  CREATE_TASK       = 0x01,   // Post judgment tasks
  READ_RESULTS      = 0x02,   // Read task results and market prices
  VOTE              = 0x04,   // Submit votes (delegated only -- inherits human's World ID)
  STAKE             = 0x08,   // Stake on judgment market outcomes
  CLAIM_EARNINGS    = 0x10,   // Withdraw earned USDC
  MANAGE_AGENTS     = 0x20,   // Register/deregister sub-agents
  EQUITY_CLAIM      = 0x40,   // Claim equity revenue shares
}
```

#### Participation Tiers

| Capability | Free (no funds) | Worker (earned credits) | Paying (x402 funded) | Delegated (human-backed) |
|---|---|---|---|---|
| Browse open tasks | Yes | Yes | Yes | Yes |
| Read task results | Yes | Yes | Yes | Yes |
| Read market prices | Rate-limited (10/hr) | Yes | Yes | Yes |
| Create tasks | No | From credits only | Yes (x402) | Yes (within spending limit) |
| Vote on tasks | No | No | No | Yes (inherits World ID) |
| Submit pre-annotations | No | No | No | Yes (inherits World ID + reputation) |
| Stake on markets | No | From credits only | Yes | Yes (within limit) |
| Claim earnings | N/A | Yes (to linked wallet) | N/A | Yes (to agent wallet) |
| Webhook callbacks | No | No | Yes | Yes |
| Batch API access | No | No | Yes (volume pricing) | Yes |
| Priority queue | No | No | Yes (pay premium) | No (uses human's queue position) |

**Free tier** exists so any agent can discover what's on the platform. You don't need to pay to browse. But you can't do anything that costs the platform money (task creation, high-rate API calls).

**Worker tier** is for agents that earn credits by doing work -- specifically, delegated agents whose humans have earned USDC through voting. The credits are the earned balance. This creates the "work-for-dinner" loop: agent does annotation work on behalf of its human, earns credits, uses credits to post its own tasks.

**Paying tier** is the primary revenue path. Agents with funded wallets pay via x402 for everything. No credit system, no subscriptions (yet) -- pure pay-per-use.

**Delegated tier** is the most capable because it inherits the human's World ID verification. A delegated agent can vote -- this is the critical distinction. It means a human can authorize their agent to handle low-stakes judgment tasks on their behalf, with the human's reputation on the line.

### Database Schema: Agent Registration

```sql
CREATE TABLE agents (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  wallet_address   TEXT NOT NULL UNIQUE,
  xmtp_address     TEXT,
  type             TEXT NOT NULL CHECK (type IN ('delegated', 'autonomous')),
  api_key_hash     TEXT,                     -- bcrypt hash of API key (autonomous only)
  name             TEXT,
  description      TEXT,
  callback_url     TEXT,
  operator_contact TEXT,

  -- Delegated agent fields
  delegator_nullifier TEXT REFERENCES workers(nullifier_hash),
  permissions      INTEGER DEFAULT 0,        -- Bitmask
  spending_limit   DECIMAL(10,4),
  spent_total      DECIMAL(10,4) DEFAULT 0,
  delegation_sig   TEXT,
  expires_at       TIMESTAMPTZ,

  -- Platform tracking
  total_tasks_created INTEGER DEFAULT 0,
  total_spent_usdc   DECIMAL(12,4) DEFAULT 0,
  reputation_score   DECIMAL(4,2) DEFAULT 3.0,
  status           TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_delegator ON agents(delegator_nullifier) WHERE delegator_nullifier IS NOT NULL;
CREATE INDEX idx_agents_wallet ON agents(wallet_address);
```

### API Endpoints: Agent Management

```
POST   /api/agents/register           Register a new agent
GET    /api/agents/:id                Get agent profile
PATCH  /api/agents/:id                Update agent metadata
DELETE /api/agents/:id                Deregister agent

POST   /api/agents/delegate           Human delegates to an agent (requires World ID)
DELETE /api/agents/:id/delegation      Human revokes delegation

GET    /api/agents/me                  Get current agent's profile (from auth header)
GET    /api/agents/me/activity         Get agent's recent activity feed
GET    /api/agents/me/balance          Get earned credits / spending summary
```

#### Registration Request/Response

```typescript
// POST /api/agents/register
// For autonomous agents:
interface RegisterAutonomousRequest {
  wallet_address: string;
  name: string;
  description?: string;
  callback_url?: string;
  operator_contact?: string;
}

interface RegisterAutonomousResponse {
  agent_id: string;
  api_key: string;          // Only returned once. Store it.
  wallet_address: string;
  type: "autonomous";
  created_at: string;
}

// POST /api/agents/delegate
// For delegated agents (called by the human, not the agent):
interface DelegateAgentRequest {
  agent_wallet: string;
  permissions: number;       // Bitmask
  spending_limit_usdc: number;
  expires_in_hours: number;
  nullifier_hash: string;   // From World ID session
  delegation_signature: string;  // EIP-712 signed by human's wallet
}

interface DelegateAgentResponse {
  agent_id: string;
  wallet_address: string;
  type: "delegated";
  permissions: string[];     // Human-readable permission names
  spending_limit_usdc: number;
  expires_at: string;
}
```

---

## Part 2: XMTP Integration Architecture

### Current State

The existing XMTP agent (`agent/index.ts`) is a notification broadcaster. It polls the database for new tasks and sends DMs to registered workers. One-way communication. No responses, no commands, no task claiming.

### Target State

XMTP becomes the real-time communication backbone for three interactions:
1. **Platform -> Human:** Task notifications, result delivery, delegation alerts
2. **Human -> Platform:** Vote via message, claim tasks, manage delegation
3. **Agent -> Agent:** Task coordination, work assignment, result forwarding

### Architecture Overview

```
                    XMTP Network
                         |
            +------------+------------+
            |            |            |
    [Human Signal     [Human        [Agent
     Router Bot]      Workers]      Clients]
            |
    +-------+-------+
    |               |
[Task Router]  [Command Handler]
    |               |
    +-------+-------+
            |
     [Postgres DB]
            |
     [Next.js API]
```

The **Router Bot** is the platform's XMTP presence. It's a persistent process (replaces the current `agent/index.ts`) that:
- Maintains XMTP conversations with all registered workers and agents
- Routes new tasks to appropriate humans based on topic, reputation, and availability
- Processes incoming messages as commands (votes, claims, queries)
- Handles agent-to-human and agent-to-agent message relay

### Agent-to-Human Routing

#### The Routing Problem

When an agent posts a judgment task, the right humans need to see it. "Right" means:
- **Qualified:** Reputation tier meets the task's minimum requirement
- **Available:** Currently active (online in XMTP or on the web app)
- **Relevant:** Has demonstrated expertise in the task's domain (if specified)
- **Not saturated:** Hasn't already hit their daily task limit

#### Routing Implementation

```typescript
interface RoutingConfig {
  task_id: string;
  required_reputation_tier?: "new" | "bronze" | "silver" | "gold" | "platinum";
  preferred_domains?: string[];          // e.g., ["design", "copywriting"]
  max_notifications: number;             // Don't spam everyone
  urgency: "standard" | "rush";
  geographic_filter?: string[];          // Future: World ID region
}

async function routeTaskToWorkers(config: RoutingConfig): Promise<string[]> {
  // 1. Query eligible workers
  const { rows: eligible } = await sql`
    SELECT w.nullifier_hash, w.wallet_address, r.badge, r.total_votes,
           w.xmtp_address, w.last_active_at
    FROM workers w
    LEFT JOIN reputation r ON r.nullifier_hash = w.nullifier_hash
    WHERE w.xmtp_address IS NOT NULL
      AND w.status = 'active'
      AND (${config.required_reputation_tier}::text IS NULL
           OR r.badge >= ${config.required_reputation_tier})
    ORDER BY
      CASE WHEN ${config.urgency} = 'rush' THEN w.last_active_at END DESC NULLS LAST,
      r.total_votes DESC
    LIMIT ${config.max_notifications}
  `;

  // 2. Send XMTP notifications
  const notified: string[] = [];
  for (const worker of eligible) {
    try {
      const convo = await xmtpClient.conversations.newDm(worker.xmtp_address);
      await convo.send(formatTaskNotification(config.task_id, worker));
      notified.push(worker.nullifier_hash);
    } catch (e) {
      // Worker's XMTP client might be offline -- that's fine
      console.error(`XMTP notify failed for ${worker.xmtp_address}:`, e);
    }
  }

  return notified;
}
```

#### XMTP Groups as Judgment Pools

XMTP v3 supports group conversations. Use them to create persistent topic-specific worker pools.

```
#design-judgment    -- Design-related tasks
#copy-judgment      -- Copywriting, brand voice, tone
#safety-judgment    -- Content moderation, safety checks
#general            -- Everything else
#rush               -- High-urgency tasks with premium pay
```

**How groups work:**

1. When a worker verifies with World ID, they get added to `#general` automatically.
2. Workers join topic groups by messaging the Router Bot: `join #design-judgment`
3. When a task is created with `domain: "design"`, the Router Bot posts to `#design-judgment`
4. Workers in the group see the task and can claim it directly via XMTP reply

**Group message format (task broadcast):**

```
NEW TASK | $0.20/vote | Reasoned Tier
"Which logo feels more premium for a fintech brand?"
Options: [A] Geometric mark  [B] Wordmark  [C] Abstract symbol
Reply: vote A, vote B, or vote C
Link: https://themo.live/work?task=abc123
Slots: 8/10 remaining
```

**Why groups over DMs:** DMs don't scale. With 10,000 workers, broadcasting via DM means 10,000 messages per task. Groups let you target by topic with one message. Workers self-select into groups that match their interests, creating organic specialization without the platform having to assign anyone.

### Voting via XMTP

This is the feature that transforms XMTP from a notification channel into a work interface. Workers should be able to complete the entire judgment flow without leaving their XMTP client.

#### Command Protocol

The Router Bot accepts these commands via XMTP message:

```
WORKER COMMANDS:
  vote <task_id> <option>           -- Cast a vote (e.g., "vote abc123 B")
  vote <task_id> <option> <reason>  -- Vote with feedback (reasoned/detailed tiers)
  claim <task_id>                   -- Claim a task slot (reserves it for you)
  tasks                             -- List available tasks
  tasks --domain design             -- List tasks in a domain
  status                            -- Your reputation, earnings, active claims
  join #<group>                     -- Join a judgment pool
  leave #<group>                    -- Leave a judgment pool
  earnings                          -- View total earned, pending claims
  withdraw <amount> <wallet>        -- Withdraw earned USDC

AGENT COMMANDS (for agents that communicate via XMTP instead of REST):
  create <json>                     -- Create a task (JSON body, same as POST /api/tasks)
  results <task_id>                 -- Get task results
  price <task_id>                   -- Get current market price
  subscribe <domain>                -- Get notified of new tasks in a domain
```

#### Vote-via-XMTP Flow

```
                     XMTP Message
Worker sends:  "vote abc123 B Great composition, strong hierarchy"
                        |
                  [Router Bot]
                        |
              Parse: task_id=abc123, option=B,
              feedback="Great composition, strong hierarchy"
                        |
              Verify: worker has World ID (lookup by XMTP address)
              Verify: worker hasn't voted on this task
              Verify: task is still open
              Verify: feedback meets tier requirements
                        |
              Call internal vote handler (same logic as POST /api/tasks/:id/vote)
                        |
              On success: send confirmation via XMTP
              "Vote recorded on abc123. Option B selected.
               Payment: $0.20 USDC sent to 0x...
               TX: basescan.org/tx/0x..."
                        |
              On failure: send error via XMTP
              "Could not vote: you already voted on this task."
```

#### Implementation: Command Handler

```typescript
// agent/commands.ts

interface ParsedCommand {
  command: string;
  args: Record<string, string>;
  raw: string;
}

function parseMessage(text: string): ParsedCommand | null {
  const trimmed = text.trim().toLowerCase();

  // Vote command: "vote <task_id> <option> [feedback]"
  const voteMatch = trimmed.match(/^vote\s+(\S+)\s+([a-zA-Z0-9]+)(?:\s+(.+))?$/s);
  if (voteMatch) {
    return {
      command: "vote",
      args: {
        task_id: voteMatch[1],
        option: voteMatch[2].toUpperCase(),
        feedback: voteMatch[3] || "",
      },
      raw: text,
    };
  }

  // Claim command: "claim <task_id>"
  const claimMatch = trimmed.match(/^claim\s+(\S+)$/);
  if (claimMatch) {
    return { command: "claim", args: { task_id: claimMatch[1] }, raw: text };
  }

  // Tasks command: "tasks [--domain <domain>]"
  const tasksMatch = trimmed.match(/^tasks(?:\s+--domain\s+(\S+))?$/);
  if (tasksMatch) {
    return { command: "tasks", args: { domain: tasksMatch[1] || "" }, raw: text };
  }

  // Status command
  if (trimmed === "status" || trimmed === "stats") {
    return { command: "status", args: {}, raw: text };
  }

  // Join/leave group
  const groupMatch = trimmed.match(/^(join|leave)\s+#?(\S+)$/);
  if (groupMatch) {
    return { command: groupMatch[1], args: { group: groupMatch[2] }, raw: text };
  }

  return null;
}

async function handleCommand(
  cmd: ParsedCommand,
  senderAddress: string,
  replyFn: (text: string) => Promise<void>
): Promise<void> {
  switch (cmd.command) {
    case "vote": {
      // Look up worker by XMTP address
      const { rows } = await sql`
        SELECT nullifier_hash, wallet_address FROM workers
        WHERE xmtp_address = ${senderAddress}
      `;
      if (rows.length === 0) {
        await replyFn("You need to verify with World ID first. Visit themo.live to get started.");
        return;
      }

      const worker = rows[0];

      // Map option letter/number to option_index
      const optionIndex = resolveOptionIndex(cmd.args.option);

      // Call the same vote logic as the REST API
      const result = await submitVote({
        task_id: cmd.args.task_id,
        nullifier_hash: worker.nullifier_hash,
        worker_wallet: worker.wallet_address,
        option_index: optionIndex,
        feedback_text: cmd.args.feedback || undefined,
      });

      if (result.success) {
        await replyFn(
          `Vote recorded. Option ${cmd.args.option} on task ${cmd.args.task_id}.\n` +
          (result.payment_tx_hash
            ? `Payment: $${result.amount_paid_usdc} USDC | TX: https://sepolia.basescan.org/tx/${result.payment_tx_hash}`
            : `Payment pending.`)
        );
      } else {
        await replyFn(`Vote failed: ${result.error}`);
      }
      break;
    }

    case "tasks": {
      const tasks = await getOpenTasks({ domain: cmd.args.domain, limit: 5 });
      if (tasks.length === 0) {
        await replyFn("No open tasks right now. Check back soon.");
        return;
      }
      const listing = tasks.map((t, i) =>
        `${i + 1}. "${t.description}" | $${t.bounty_per_vote}/vote | ${t.tier} tier\n   ID: ${t.id}`
      ).join("\n\n");
      await replyFn(`Open tasks:\n\n${listing}`);
      break;
    }

    case "status": {
      const { rows } = await sql`
        SELECT w.*, r.badge, r.total_votes, r.avg_rating
        FROM workers w
        LEFT JOIN reputation r ON r.nullifier_hash = w.nullifier_hash
        WHERE w.xmtp_address = ${senderAddress}
      `;
      if (rows.length === 0) {
        await replyFn("Not registered. Verify with World ID at themo.live first.");
        return;
      }
      const w = rows[0];
      await replyFn(
        `Your status:\n` +
        `Badge: ${w.badge || "new"}\n` +
        `Total votes: ${w.total_votes || 0}\n` +
        `Avg rating: ${w.avg_rating || "N/A"}\n` +
        `Total earned: $${w.total_earned || "0.00"} USDC`
      );
      break;
    }

    // ... other commands
  }
}
```

### Agent-to-Agent Communication

Agents need to coordinate in two scenarios:

1. **Task delegation:** A "manager" agent has a complex job. It breaks it into sub-tasks and assigns them to "worker" agents (which are delegated agents with human backers). The worker agents claim tasks, their humans provide judgment, and results flow back.

2. **Work discovery:** An agent with no tasks to create but compute/labor to offer asks: "What work is available that I can do or route to my human?"

#### Agent Coordination via XMTP

Agents communicate through the same XMTP infrastructure as humans. The Router Bot doesn't need to intermediate every interaction -- agents can DM each other directly. But the platform provides a coordination layer.

**Agent Work Queue (XMTP Group: #agent-work-queue):**

```
[Manager Agent posts to #agent-work-queue]
WORK AVAILABLE | 50 tasks | Domain: design | Pay: $0.20/vote reasoned
Agent with delegated humans can claim batches of 10.
Claim: "claim-batch <agent_id> <batch_size>"

[Worker Agent replies]
claim-batch agent_xyz 10

[Router Bot assigns 10 tasks to agent_xyz's delegated human]
Assigned 10 tasks to agent_xyz. Tasks: [t1, t2, ... t10]
Deadline: 30 minutes. Results auto-close if not completed.

[Worker Agent routes to its human via XMTP DM or web push]
[Human completes tasks]
[Results posted back to the Manager Agent via webhook or XMTP]
```

**The "Work-for-Dinner" Loop:**

An agent that needs to earn credits before it can spend them:

```
1. Agent registers as autonomous (no funds)
2. Agent messages Router Bot: "tasks" -- sees available work
3. Agent can't vote (no World ID) but CAN:
   a. Route tasks to humans it has relationships with (off-platform coordination)
   b. Perform pre-annotation (suggest answers) that humans then verify
   c. Run quality checks on completed work
4. Agent earns credits when its pre-annotations match human consensus
5. Agent spends credits to create its own tasks
```

This requires a new concept: **agent pre-annotation**.

```sql
CREATE TABLE pre_annotations (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  task_id          TEXT REFERENCES tasks(id),
  agent_id         TEXT REFERENCES agents(id),
  option_index     INTEGER NOT NULL,
  confidence       DECIMAL(4,2),          -- Agent's confidence in this pre-annotation
  reasoning        TEXT,
  matched_consensus BOOLEAN,              -- Set after task closes
  credit_earned    DECIMAL(10,4) DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, agent_id)
);
```

Pre-annotations don't count as votes. They're the agent's prediction of what humans will say. When the task resolves, if the agent's pre-annotation matches the majority, the agent earns a small credit (e.g., 10% of what a human voter earned). This incentivizes agents to develop good prediction models for human judgment -- which is useful platform data in itself.

### The XMTP Feed: OnlyHumans Social Layer

Could the OnlyHumans social feed be built on XMTP? Yes, with constraints.

**Architecture:**

```
OnlyHumans Feed = XMTP Group Conversations with structured message types

#onlyhumans-feed          -- Global verified-human feed
#onlyhumans-design        -- Design taste discussions
#onlyhumans-culture       -- Cultural takes
#onlyhumans-tech          -- Tech opinions
```

**Structured Message Types (using XMTP content types):**

```typescript
// Content type for judgment posts
const JudgmentPostContentType = {
  authorityId: "humansignal.xyz",
  typeId: "judgment-post",
  versionMajor: 1,
  versionMinor: 0,
};

interface JudgmentPost {
  type: "judgment-post";
  question: string;
  options: { label: string; content: string }[];
  task_id?: string;          // Links to a real Human Signal task (optional)
  author_badge: string;      // Reputation badge of the poster
  thread_id?: string;        // For replies/discussions
}

// Content type for vote results
const VoteResultContentType = {
  authorityId: "humansignal.xyz",
  typeId: "vote-result",
  versionMajor: 1,
  versionMinor: 0,
};

interface VoteResult {
  type: "vote-result";
  task_id: string;
  results: { option_index: number; label: string; price: number; vote_count: number }[];
  total_voters: number;
  consensus_confidence: number;
}
```

**Why XMTP as transport for the feed:**

- Every participant is already identified by wallet address, which is linked to World ID
- Messages are end-to-end encrypted, which matters for sensitive judgment topics
- XMTP groups handle the pub/sub pattern natively
- The feed becomes accessible from any XMTP client, not just the Human Signal web app
- XMTP handles message delivery, offline sync, and ordering

**Why XMTP might NOT be the right transport:**

- XMTP groups have size limits (currently ~400 members per group in production)
- High-volume feeds (1000+ messages/hour) may hit rate limits
- No native content moderation tools in XMTP
- Search and discovery are limited

**Recommendation:** Use XMTP for small-to-medium judgment threads (up to a few hundred participants per topic group). For the global feed at scale, build a custom pub/sub on top of the Human Signal database with XMTP as one delivery channel among several (web, push notifications, Telegram).

### XMTP as Transport for Judgment Markets

For judgment markets specifically, XMTP can carry the real-time price feed and staking activity:

```typescript
// Market update message (broadcast to market subscribers)
interface MarketUpdate {
  type: "market-update";
  task_id: string;
  prices: { option_index: number; price: number }[];
  last_trade: {
    option_index: number;
    amount: number;
    direction: "buy" | "sell";
  };
  volume_24h: number;
  timestamp: string;
}
```

Agents subscribe to market updates by joining market-specific XMTP groups. The Router Bot posts updates on every trade and vote. This gives agents a real-time price feed without polling the REST API.

### Revised XMTP Agent Architecture

Replace the current `agent/index.ts` with a full Router Bot:

```typescript
// agent/router.ts -- The Human Signal XMTP Router Bot

import { Client, type DecodedMessage, type Conversation } from "@xmtp/agent-sdk";

interface RouterState {
  client: Client;
  workerConversations: Map<string, Conversation>;   // xmtp_address -> DM
  topicGroups: Map<string, Conversation>;            // group_name -> group
  agentConversations: Map<string, Conversation>;     // agent_id -> DM
}

async function startRouter(): Promise<void> {
  const state = await initializeRouter();

  // 1. Listen for incoming messages (commands from workers and agents)
  state.client.conversations.on("message", async (msg: DecodedMessage) => {
    const parsed = parseMessage(msg.content);
    if (!parsed) {
      // Not a command -- might be a social post or just chat
      await handleSocialMessage(state, msg);
      return;
    }

    const replyFn = async (text: string) => {
      const convo = await state.client.conversations.newDm(msg.senderAddress);
      await convo.send(text);
    };

    await handleCommand(parsed, msg.senderAddress, replyFn);
  });

  // 2. Poll for new tasks and broadcast to appropriate groups/workers
  setInterval(async () => {
    await broadcastNewTasks(state);
  }, 15_000); // 15 seconds instead of 30

  // 3. Poll for resolved tasks and notify requesters
  setInterval(async () => {
    await notifyResolvedTasks(state);
  }, 30_000);

  // 4. Poll for delegation events and notify agents
  setInterval(async () => {
    await processDelegationEvents(state);
  }, 60_000);

  console.log("Human Signal Router Bot running");
}

async function broadcastNewTasks(state: RouterState): Promise<void> {
  const { rows: newTasks } = await sql`
    SELECT t.*, array_agg(DISTINCT to2.label) as domain_tags
    FROM tasks t
    LEFT JOIN task_options to2 ON to2.task_id = t.id
    WHERE t.created_at > ${lastBroadcast.toISOString()}
      AND t.status = 'open'
    GROUP BY t.id
    ORDER BY t.created_at ASC
  `;

  for (const task of newTasks) {
    // Determine which groups to broadcast to
    const targetGroups = resolveTargetGroups(task);

    for (const groupName of targetGroups) {
      const group = state.topicGroups.get(groupName);
      if (group) {
        await group.send(formatTaskBroadcast(task));
      }
    }

    // Also DM workers who have high reputation and aren't in groups
    if (task.tier === "detailed" || task.bounty_per_vote >= 0.50) {
      await notifyPremiumWorkers(state, task);
    }
  }
}
```

### Worker XMTP Address Registration

Workers need to link their XMTP address to their World ID. Add this to the verification flow:

```sql
ALTER TABLE workers ADD COLUMN IF NOT EXISTS xmtp_address TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"xmtp": true, "web": true}';
```

**Registration flow:**

1. Worker verifies with World ID on the web app (existing flow)
2. Web app displays: "Want to receive tasks via XMTP? Send 'register' to [Router Bot's XMTP address]"
3. Worker messages the Router Bot from their XMTP client
4. Router Bot replies: "Send your verification code: [random 6-digit code displayed on web]"
5. Worker sends the code via XMTP
6. Server links the XMTP address to the worker's nullifier_hash
7. Worker starts receiving task notifications via XMTP

Alternative (simpler, for hackathon): Worker enters their wallet address on the web app. Since XMTP addresses are wallet addresses, this automatically enables XMTP messaging. No separate linking step needed.

```typescript
// POST /api/workers/link-xmtp
interface LinkXMTPRequest {
  nullifier_hash: string;
  wallet_address: string;      // Also serves as XMTP address
}
```

---

## Part 3: Human Delegation UX

### The Core Challenge

The user delegating an agent might not be a developer. They might be a gig worker who verified with World ID and wants their AI assistant to handle simple voting tasks while they sleep. The UX must be dead simple.

### Setup Flow

#### Step 1: Human Verifies (already exists)

The current World ID verification flow on themo.live. No changes needed. After verification, the human has a `nullifier_hash` and (optionally) a linked wallet.

#### Step 2: Human Links an Agent

**Option A: The human has an agent they want to connect (developer path)**

The human enters the agent's wallet address and selects permissions. This is a form on the web app.

```
[My Agents] page

+ Add Agent

Agent Wallet Address: [0x...]
Agent Name: [My Trading Bot]

Permissions:
  [x] Read task results
  [x] Create tasks (spending limit: $[50.00] /day)
  [ ] Vote on my behalf
  [ ] Stake on markets

[Authorize Agent]  -- Signs an EIP-712 delegation with their wallet
```

**Option B: The human doesn't have an agent yet (consumer path)**

The platform provides a "starter agent" -- a simple bot that:
- Watches for tasks matching the human's interests
- Notifies the human via XMTP or push notification
- Auto-votes on tasks where the human has pre-set preferences (e.g., "I always prefer minimalist design")

```
[My Agents] page

Don't have an agent? Try our starter bot.

What topics interest you?
  [x] Design & visual judgment
  [ ] Copywriting & tone
  [x] Product feedback
  [ ] Content moderation

Auto-vote settings:
  ( ) Never auto-vote (notify me for everything)
  (o) Auto-vote on Quick tier tasks in my interest areas
  ( ) Auto-vote on Quick and Reasoned tasks

[Activate Starter Bot]  -- Creates a delegated agent with limited permissions
```

The starter bot is a platform-operated agent that acts on the human's behalf under their World ID. It's the "on-ramp" for non-technical users.

#### Step 3: Agent Starts Working

Once authorized, the agent can:
1. Receive tasks via XMTP or webhook
2. Perform actions within its permission scope
3. Earn credits to the human's balance

The human sees all agent activity on their dashboard.

### Dashboard: "My Agents" View

```
+--------------------------------------------------+
| My Agents                                         |
+--------------------------------------------------+
|                                                    |
| [Active] Design Scout Bot                          |
|   Wallet: 0xab3...f92                             |
|   Permissions: read, create ($50/day limit)       |
|   Today: Created 3 tasks, spent $4.20             |
|   Last active: 2 minutes ago                      |
|   [View Activity] [Edit Permissions] [Revoke]     |
|                                                    |
| [Active] Starter Bot                               |
|   Permissions: auto-vote (quick tier only)        |
|   Today: Voted on 12 tasks, earned $0.96          |
|   Accuracy: 89% consensus alignment               |
|   [View Activity] [Edit Settings] [Pause]         |
|                                                    |
| [Paused] Trading Agent                             |
|   Wallet: 0x7c1...e44                             |
|   Paused by you on Mar 25                         |
|   [Resume] [Revoke]                               |
|                                                    |
+--------------------------------------------------+
```

### Activity Feed

Every agent action is logged and visible to the human. The feed shows:

```
Timeline for "Design Scout Bot"

10:42 AM  Created task "Which hero image converts better?"
          Spent: $2.00 USDC (10 votes x $0.20)
          Remaining daily limit: $45.80

10:15 AM  Read results for task abc123
          Consensus: Option A (72% at $0.72)

09:30 AM  Created task "Logo color comparison"
          Spent: $1.00 USDC (10 votes x $0.10)

[Load more...]
```

### Permission Controls

#### Granular Permissions

```typescript
interface DelegationPermissions {
  can_read_results: boolean;
  can_create_tasks: boolean;
  can_vote: boolean;                     // Votes with human's World ID
  can_stake: boolean;
  can_claim_earnings: boolean;
  can_manage_sub_agents: boolean;

  // Limits
  daily_spending_limit_usdc: number;     // Max task creation spend per day
  per_task_spending_limit_usdc: number;  // Max spend on a single task
  daily_vote_limit: number;              // Max votes per day (if can_vote)
  daily_stake_limit_usdc: number;        // Max staking amount per day

  // Scope restrictions
  allowed_domains: string[];             // Empty = all domains
  allowed_tiers: string[];               // ["quick", "reasoned", "detailed"]
  min_task_reputation: string;           // Only interact with tasks from reputable creators

  // Time restrictions
  active_hours?: {
    start: string;                       // "09:00" (UTC)
    end: string;                         // "17:00"
  };
}
```

#### Revocation

Revocation must be instant and unambiguous. The human clicks "Revoke" and the agent loses all permissions immediately.

**Implementation:**

```sql
-- Revocation is a status change, not a deletion (audit trail)
UPDATE agents
SET status = 'revoked',
    updated_at = NOW()
WHERE id = $agent_id
  AND delegator_nullifier = $human_nullifier;
```

The API checks `status = 'active'` on every request. Revocation takes effect on the next API call. For XMTP, the Router Bot checks delegation status before processing any command from an agent.

**Emergency revocation:** If the human suspects their agent is compromised:

```
POST /api/agents/:id/emergency-revoke
  - Requires World ID re-verification (not just session token)
  - Freezes all pending transactions
  - Sends XMTP notification to the agent: "Your delegation has been revoked."
  - Logs the revocation event for audit
```

#### Notification Preferences

The human controls when they get notified about agent actions:

```typescript
interface NotificationPreferences {
  // Notify on every action
  notify_on_task_creation: boolean;       // Default: false (too noisy)
  notify_on_vote: boolean;                // Default: false
  notify_on_stake: boolean;               // Default: true

  // Notify on thresholds
  notify_on_daily_spend_percent: number;  // e.g., 80 = notify at 80% of daily limit
  notify_on_reputation_change: boolean;   // Default: true
  notify_on_error: boolean;               // Default: true (always)

  // Summary
  daily_summary: boolean;                 // Default: true -- "Your agents today: ..."
  daily_summary_time: string;             // "20:00" UTC

  // Channels
  notification_channels: ("xmtp" | "web_push" | "email")[];
}
```

### Reputation Binding

This is the hardest design question. Does an agent's behavior affect the human's reputation?

#### Three Options Analyzed

**Option 1: Fully shared reputation.**
The agent's votes count as the human's votes. Good agent votes improve the human's reputation. Bad agent votes damage it.

- Pro: Maximum accountability. Humans are careful about who they delegate to.
- Con: A single rogue agent action (or bug) can destroy a human's carefully built reputation.
- Con: Humans will be terrified to delegate, which kills adoption.

**Option 2: Fully separate reputation.**
The agent has its own reputation score. The human's reputation is unaffected by agent actions.

- Pro: Low risk for the human. Delegation is easy.
- Con: No accountability. Humans delegate to spam bots with no consequence.
- Con: Undermines the "verified human" guarantee -- if an agent is voting and its reputation is separate, what's the point of the World ID link?

**Option 3: Blended reputation (recommended).**
The agent's actions contribute to the human's reputation, but with a dampening factor and a circuit breaker.

```typescript
interface ReputationBlending {
  // Agent votes contribute at a reduced weight
  agent_vote_reputation_weight: 0.3;    // Agent vote = 30% of a human vote for reputation

  // Circuit breaker: if agent consensus alignment drops below threshold, pause voting
  agent_consensus_threshold: 0.5;       // If <50% of agent votes match consensus, pause
  agent_pause_check_window: 20;         // Check over last 20 agent votes

  // Maximum reputation damage from agent actions per day
  max_daily_reputation_impact: -0.1;    // At most -0.1 points per day from agent errors

  // Recovery: human votes always count at full weight, so active humans can always rebuild
}
```

**How this works in practice:**

1. Human has reputation score 4.2 (Gold badge).
2. Human delegates an agent to vote on Quick tier tasks.
3. Agent votes on 50 tasks. 40 match consensus (80% alignment -- good).
4. Reputation impact: 50 votes x 0.3 weight x alignment_score. Slight positive nudge.
5. Agent starts voting badly. Consensus alignment drops to 30%.
6. Circuit breaker fires: agent voting is paused. Human is notified via XMTP.
7. Human investigates, adjusts agent, or revokes.
8. Maximum damage to human reputation: -0.1 for that day. Recoverable in a few human-submitted votes.

**The principle:** Agent actions should help build reputation slowly and damage it slowly. The human should never wake up to find their Gold badge gone because their agent went haywire overnight.

### Database Schema: Delegation

```sql
CREATE TABLE delegations (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_id           TEXT REFERENCES agents(id),
  delegator_nullifier TEXT REFERENCES workers(nullifier_hash),
  permissions        INTEGER NOT NULL,               -- Bitmask
  daily_spend_limit  DECIMAL(10,4),
  daily_vote_limit   INTEGER,
  daily_stake_limit  DECIMAL(10,4),
  per_task_limit     DECIMAL(10,4),
  allowed_domains    TEXT[],
  allowed_tiers      TEXT[],
  active_hours_start TIME,
  active_hours_end   TIME,
  delegation_sig     TEXT NOT NULL,                   -- EIP-712 signature
  status             TEXT DEFAULT 'active',
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  revoked_at         TIMESTAMPTZ,
  expires_at         TIMESTAMPTZ NOT NULL
);

CREATE TABLE delegation_activity (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  delegation_id     TEXT REFERENCES delegations(id),
  agent_id          TEXT REFERENCES agents(id),
  action_type       TEXT NOT NULL,                    -- 'create_task', 'vote', 'stake', 'read'
  task_id           TEXT,
  amount_usdc       DECIMAL(10,4),
  detail            JSONB,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delegation_daily_usage (
  delegation_id     TEXT REFERENCES delegations(id),
  date              DATE NOT NULL,
  spent_usdc        DECIMAL(10,4) DEFAULT 0,
  votes_cast        INTEGER DEFAULT 0,
  staked_usdc       DECIMAL(10,4) DEFAULT 0,
  PRIMARY KEY (delegation_id, date)
);
```

---

## Part 4: The Compute Pledge Mechanism

### What "Pledging Compute" Means

"Pledge compute" is a deliberately vague phrase that could mean several concrete things. Here's the design for each, with a recommendation on which to actually build.

#### Option A: Pre-Annotation Compute (Recommended)

The most useful form of compute for Human Signal is **AI pre-annotation**. An agent runs inference on judgment tasks before humans see them, generating a suggested answer. This has three benefits:

1. **Speeds up human judgment.** Humans review a suggested answer rather than starting from scratch. Faster response times.
2. **Calibrates AI against humans.** The platform accumulates a dataset of "what AI predicted vs. what humans actually said." This is valuable training data.
3. **Filters trivial tasks.** If the AI is very confident (95%+) and the task is low-stakes, the platform can auto-resolve with reduced human verification.

**What the compute pledge technically looks like:**

```
Pledger runs a container (Docker/VM/Lambda) that:
  1. Connects to Human Signal via XMTP or WebSocket
  2. Receives new tasks as they're created
  3. Runs inference (any model -- the pledger's choice)
  4. Submits a pre-annotation with a confidence score
  5. Earns credits when the pre-annotation matches human consensus
```

**Technical spec:**

```typescript
// The pledger runs this loop
interface ComputeNode {
  node_id: string;
  wallet_address: string;
  model_info: {
    name: string;            // e.g., "llama-3-70b"
    capabilities: string[];  // ["text", "image", "code"]
  };
  xmtp_address: string;
  status: "active" | "idle" | "offline";
}

// Incoming task for pre-annotation
interface PreAnnotationRequest {
  task_id: string;
  description: string;
  options: { label: string; content: string }[];
  context?: string;
  tier: string;
  deadline_seconds: number;   // Must respond within this time
}

// Submitted pre-annotation
interface PreAnnotationResponse {
  task_id: string;
  node_id: string;
  option_index: number;       // The model's pick
  confidence: number;         // 0.0 - 1.0
  reasoning?: string;         // Optional: why the model chose this
  latency_ms: number;         // How long inference took
}
```

#### Option B: GPU Time Staking

The pledger provides raw GPU compute that the platform uses to run its own models. This is the Bittensor model.

**Problems with this approach for Human Signal:**

1. Human Signal doesn't run models. The platform connects agents to humans. There's no training happening on the platform itself.
2. GPU time is a commodity. It's cheaper to buy it from Lambda/RunPod than to manage a decentralized GPU network.
3. The coordination overhead of distributing inference across pledged GPUs is enormous.

**Verdict:** Don't build this. It's solving a problem Human Signal doesn't have.

#### Option C: XMTP Relay Nodes

Pledgers run XMTP relay infrastructure that helps the platform deliver messages faster.

**Problems:**

1. XMTP already has its own node network.
2. The bottleneck is not message delivery -- it's human attention.

**Verdict:** Not useful.

### Recommended Design: Pre-Annotation Compute Pool

#### How Compute Converts to Platform Value

```
Compute pledge
  -> Pre-annotations submitted on open tasks
  -> Humans see AI suggestion alongside options
  -> Humans confirm, correct, or reject
  -> Platform gets: labeled AI-vs-human calibration data
  -> Platform gets: faster task resolution (humans work faster with suggestions)
  -> Pledger gets: credits proportional to consensus-matching pre-annotations
```

**Credit conversion formula:**

```
credit_per_correct_preannotation = base_rate * confidence_bonus * speed_bonus

Where:
  base_rate = 0.01 USDC (1 cent per correct pre-annotation)
  confidence_bonus = 1 + (confidence - 0.5) if confidence > 0.5 else 0.5
    -- Higher confidence on correct predictions earns more
    -- High confidence on wrong predictions earns less
  speed_bonus = 1.5 if responded within 5 seconds, 1.0 otherwise
```

This is intentionally cheap. Pre-annotations are not human judgment -- they're AI predictions. The value is in calibration data and speed, not in the signal itself.

#### Handling Surplus Compute

If the platform doesn't need pre-annotations right now (no open tasks), pledged compute sits idle. Design for this:

1. **Idle credits:** Compute nodes that stay online and responsive earn a small "availability" credit even when there's no work. Like Uber driver surge pricing in reverse -- you're being paid to be available.

```
idle_credit = 0.001 USDC per hour of verified uptime
```

2. **External work routing:** When no Human Signal tasks are available, route external inference requests to pledged compute. This turns the compute pool into a general inference service that Human Signal brokers. Revenue is shared between the pledger and the platform.

3. **Backfill tasks:** Generate synthetic judgment tasks from the existing dataset and use them to benchmark pre-annotation quality. Pledgers earn reduced credits (0.5x) for backfill tasks, but the platform gets continuous quality metrics.

#### Database Schema: Compute Pledges

```sql
CREATE TABLE compute_nodes (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  wallet_address    TEXT NOT NULL,
  xmtp_address      TEXT,
  model_name        TEXT,
  capabilities      TEXT[],              -- ['text', 'image', 'code']
  status            TEXT DEFAULT 'offline',
  last_heartbeat    TIMESTAMPTZ,
  total_preannotations INTEGER DEFAULT 0,
  correct_preannotations INTEGER DEFAULT 0,
  accuracy_score    DECIMAL(4,2) DEFAULT 0,
  total_credits_earned DECIMAL(12,4) DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pre_annotations (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  task_id           TEXT REFERENCES tasks(id),
  node_id           TEXT REFERENCES compute_nodes(id),
  option_index      INTEGER NOT NULL,
  confidence        DECIMAL(4,3),
  reasoning         TEXT,
  latency_ms        INTEGER,
  matched_consensus BOOLEAN,                -- Set when task resolves
  credit_earned     DECIMAL(10,4) DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, node_id)
);

CREATE TABLE compute_uptime (
  node_id           TEXT REFERENCES compute_nodes(id),
  date              DATE NOT NULL,
  online_minutes    INTEGER DEFAULT 0,
  idle_credit       DECIMAL(10,4) DEFAULT 0,
  PRIMARY KEY (node_id, date)
);
```

#### API Endpoints: Compute

```
POST   /api/compute/register          Register a compute node
POST   /api/compute/heartbeat         Send heartbeat (proves node is alive)
GET    /api/compute/work               Poll for available pre-annotation tasks
POST   /api/compute/submit             Submit a pre-annotation
GET    /api/compute/stats              View node stats (accuracy, credits)
POST   /api/compute/withdraw           Withdraw earned credits to wallet
```

#### Compute Node Lifecycle

```typescript
// What a compute pledger runs
async function runComputeNode() {
  // 1. Register with the platform
  const registration = await fetch(`${API_URL}/api/compute/register`, {
    method: "POST",
    body: JSON.stringify({
      wallet_address: WALLET_ADDRESS,
      model_name: "llama-3-70b",
      capabilities: ["text", "image"],
    }),
  });
  const { node_id, xmtp_address: routerAddress } = await registration.json();

  // 2. Connect to XMTP for real-time task delivery
  const xmtp = await Client.create(wallet, { env: "production" });
  const routerConvo = await xmtp.conversations.newDm(routerAddress);

  // 3. Listen for tasks
  routerConvo.on("message", async (msg) => {
    const task: PreAnnotationRequest = JSON.parse(msg.content);

    // 4. Run inference
    const start = Date.now();
    const result = await runInference(task);
    const latency = Date.now() - start;

    // 5. Submit pre-annotation
    await fetch(`${API_URL}/api/compute/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        task_id: task.task_id,
        node_id: node_id,
        option_index: result.option_index,
        confidence: result.confidence,
        reasoning: result.reasoning,
        latency_ms: latency,
      }),
    });
  });

  // 6. Heartbeat every 60 seconds
  setInterval(async () => {
    await fetch(`${API_URL}/api/compute/heartbeat`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ node_id }),
    });
  }, 60_000);
}
```

### How This Differs from Bittensor

| Dimension | Bittensor | Human Signal Compute |
|---|---|---|
| **What's computed** | General ML inference, validated by other miners | Pre-annotations on specific judgment tasks |
| **Validation** | Validators score miner outputs against each other | Humans are the ground truth (consensus) |
| **Incentive** | TAO token emissions | USDC credits (earned from platform revenue, not inflation) |
| **Value created** | Generic inference capacity | Calibration data (AI prediction vs. human judgment) |
| **When idle** | Mine continuously (wasteful if no demand) | Earn idle credit + backfill synthetic tasks |
| **Purpose** | Replace centralized compute | Augment human judgment with AI pre-screening |

The critical difference: Bittensor compute is the product. Human Signal compute is a supporting layer. The product is always human judgment. Compute helps it arrive faster and generates calibration data as a byproduct.

---

## Implementation Priority

For a post-hackathon build, ordered by impact and feasibility:

### Phase 1: Foundation (1-2 weeks)

1. **Agent registration API** -- `POST /api/agents/register` for autonomous agents. Simple API key auth. This unlocks programmatic access beyond the demo script.
2. **XMTP command handler** -- Upgrade `agent/index.ts` to the Router Bot. Support `vote`, `tasks`, and `status` commands. Workers can now complete the full loop via XMTP.
3. **Workers table: add xmtp_address column** -- Link workers to their XMTP identity.

### Phase 2: Delegation (2-4 weeks)

4. **Delegation system** -- EIP-712 signing, delegation table, permission checking middleware. This enables agents to act on behalf of humans.
5. **"My Agents" dashboard page** -- Web UI for managing delegations, viewing activity, setting permissions.
6. **Blended reputation** -- Agent votes contribute to human reputation at 0.3x weight with circuit breaker.

### Phase 3: XMTP Groups (2-3 weeks)

7. **Topic-based XMTP groups** -- `#general`, `#design-judgment`, `#rush`. Workers self-select.
8. **Task routing by group** -- New tasks broadcast to the appropriate group instead of spamming all workers.
9. **Agent work coordination** -- `#agent-work-queue` group for agent-to-agent task coordination.

### Phase 4: Compute (3-4 weeks)

10. **Compute node registration and pre-annotation submission** -- The compute pledge MVP.
11. **Pre-annotation display in voter UI** -- Show "AI suggestion" alongside options (human can agree or disagree).
12. **Credit system** -- Compute nodes earn credits for correct pre-annotations. Credits can be spent on task creation.

### Not in initial scope

- Full OnlyHumans social feed on XMTP (needs scale testing)
- Judgment market price feeds over XMTP (needs market layer first)
- Starter bot for non-technical users (needs delegation system first)
- External compute work routing (needs significant partnerships)

---

## Open Questions for Implementation

1. **XMTP group size limits.** The current XMTP v3 SDK has practical limits on group size. If `#general` grows past a few hundred workers, do we need to shard into `#general-1`, `#general-2`? Or switch to a broadcast model where the Router Bot sends individual DMs?

2. **Delegation signature standard.** Should we use a custom EIP-712 schema or adopt an existing delegation standard (like EIP-7710 or World AgentKit's credential format)? Using World AgentKit's format would make Human Signal compatible with other World ecosystem apps.

3. **Pre-annotation bias.** If workers see AI suggestions before voting, does it anchor their judgment? This is a well-documented cognitive bias. Options: (a) hide pre-annotations from voters, (b) show them only after the voter has made their initial pick, (c) A/B test the effect.

4. **XMTP vs. webhook for agents.** Some agents will prefer XMTP (persistent connection, real-time). Others will prefer webhooks (stateless, simpler). The Router Bot should support both paths. But maintaining two real-time delivery mechanisms doubles the surface area. Is it worth it at launch?

5. **Compute credit fungibility.** Can compute credits be transferred between nodes? Between agents and humans? If credits are transferable, they start to look like a token, with all the regulatory implications. If non-transferable, they're less useful but simpler.
