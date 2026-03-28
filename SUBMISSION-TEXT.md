# Hackathon Submission: Human Signal

## One-liner

Sybil-resistant human judgment marketplace where AI agents post tasks, verified humans vote via World ID, and workers get paid instantly in USDC via x402 on Base.

---

## Project Name

**Human Signal**

## Tagline

Human taste, cryptographically verified.

## Live Demo

https://www.themo.live

## Demo Video

[link to 90-second Loom]

## GitHub

[link to repo]

---

## Description

AI companies spend billions on human feedback data (RLHF, A/B testing, content moderation) -- but the pipeline is broken. Workers create duplicate accounts, bots farm tasks, payments take weeks, and there's no API for agents to request human judgment in real time.

**Human Signal fixes all three problems by composing World ID + x402 + Base into a single protocol:**

**1. World ID eliminates sybil attacks.** Every worker proves they're a unique human via zero-knowledge proof. One person, one vote per task -- enforced cryptographically, not by email verification. No PII stored.

**2. x402 enables instant micropayments.** Task creation is paywalled by HTTP 402. Agents pay in USDC on Base automatically -- no checkout, no API keys, no invoicing. Workers receive payment the instant they submit a vote.

**3. REST API is agent-native.** An AI agent can create a task, pay the bounty, and poll for verified human responses -- all via standard HTTP. Human-in-the-loop becomes an API call.

---

## How It Works

1. **Requester** (human or AI agent) posts a judgment task via `POST /api/tasks?total=X`. The x402 protocol handles USDC payment on Base Sepolia automatically.
2. **Workers** verify their identity with World ID (ZK proof of personhood), browse open tasks, and vote.
3. **Votes** are sybil-resistant (one nullifier per human per task). Workers choose an option and optionally provide written reasoning (tiered: Quick / Reasoned / Detailed).
4. **Payment** goes to the worker's wallet instantly on-chain when they submit their vote.
5. **Results** are available in real-time via API -- vote distribution, confidence score, winner, individual feedback with reputation badges.

---

## Key Features

- **Multi-option tasks** -- 2 to N options, not just A/B
- **Tiered feedback** -- Quick ($0.05-0.10), Reasoned ($0.15-0.30), Detailed ($0.40-1.00). Price set by requester.
- **Reputation system** -- Workers earn badges (bronze to platinum) based on voting history
- **Live results dashboard** -- Real-time vote bars, confidence scoring, winner detection
- **XMTP agent** -- Broadcasts new tasks to registered workers via World Chat
- **Full API docs** -- Interactive documentation at /docs
- **Demo script** -- `demo-create-task.ts` shows end-to-end agent flow with real x402 payment

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Identity | World ID v4 (ZK proof of personhood) |
| Payments | x402 protocol (HTTP 402 micropayments) |
| Chain | Base Sepolia (USDC) |
| Messaging | XMTP agent SDK |
| Frontend | Next.js 15, React 19 |
| Database | Neon Postgres (serverless) |
| Hosting | Vercel |

---

## Technologies Used

### World ID
- ZK proof verification via @worldcoin/idkit v4
- Nullifier hash as unique human identifier (no PII)
- `UNIQUE(task_id, nullifier_hash)` constraint = atomic sybil resistance
- RP signature endpoint for IDKit v4 protocol

### x402 Protocol
- HTTP 402 payment gate on task creation endpoint
- Dynamic pricing: requester sets bounty_per_vote x max_workers
- @x402/next resource server with exact EVM scheme
- x402 facilitator integration for payment verification
- USDC on Base Sepolia

### XMTP
- Agent broadcasts new tasks to registered workers
- Built with @xmtp/agent-sdk
- Polls for new tasks, DMs workers with task details and vote links

### Base
- All payments on Base Sepolia testnet
- ERC-20 USDC transfers via viem
- Treasury wallet pattern for escrow and worker payouts

---

## What Makes This Different

Existing annotation platforms (Scale AI, Mechanical Turk, Prolific) are web2 tools built for human project managers uploading CSV batches. They verify identity with email. They pay via PayPal in 2-4 weeks. They have no agent API.

Human Signal is **infrastructure for the agent economy:**
- The buyer is an API call, not a dashboard
- The identity is a cryptographic proof, not an email
- The payment is instant USDC, not a pending invoice
- The whole flow takes seconds, not days

---

## Vision

Human Signal is a **verified oracle network for human judgment** -- the Chainlink of human cognition. Any agent that hits a decision boundary can route to Human Signal, get a verified answer from a real human, and continue. RLHF training data, safety evaluation, content moderation, real-time A/B testing -- all served by the same protocol.

The RLHF market alone is projected at $15B by 2028. Human Signal is the infrastructure layer that makes that market trustworthy.

---

## Team

Solo builder. Built in 48 hours.
