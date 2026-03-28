# Human Signal: The Missing Infrastructure for AI That Needs Humans

## The Hook

Every AI company has the same dirty secret: their models are only as good as the human feedback that trains them. OpenAI spends $300M/year on human annotation. Anthropic, Google, Meta -- all of them. The RLHF market will hit $15B by 2028.

But the infrastructure for collecting that feedback is broken. It runs on email-verified accounts from low-wage countries, farmed by bots and duplicates. The data is cheap. It's also garbage.

**Human Signal is the protocol layer that fixes this.** World ID proves you're a real, unique human. x402 pays you instantly in USDC for every task. No accounts, no invoices, no intermediaries. One person, one vote, one payment -- cryptographically enforced.

---

## The Problem: AI's Human Feedback Pipeline is Fundamentally Broken

AI systems need human judgment at every stage: preference ranking for RLHF, A/B testing for products, content moderation, safety evaluation, creative assessment. This is not going away -- it's accelerating. As models get more capable, the tasks requiring human judgment get harder and more valuable.

The current pipeline has three compounding failures:

**1. Sybil attacks destroy data quality.** Mechanical Turk, Scale AI, Surge -- they all rely on email/phone verification. One person can create 50 accounts. Bots farm tasks at scale. The result: noisy data that actively degrades model performance. Companies spend more on quality assurance than on the annotations themselves.

**2. Payments are slow, opaque, and extractive.** Workers wait 2-4 weeks for payment. Platforms take 20-40% cuts. Cross-border payments eat another 5-10% in fees. A worker in Nigeria earning $0.10 per task might see $0.05 after all the middlemen. This drives away skilled workers and selects for quantity-over-quality farms.

**3. There's no API-native interface for agents.** The fastest-growing consumer of human feedback isn't a human PM manually uploading batches -- it's AI agents that need real-time human judgment in their decision loops. No existing platform is built for agent-to-human communication. They're all built for human managers uploading CSV files.

---

## The Solution: A Protocol, Not a Platform

Human Signal is infrastructure. Three primitives, each solving one failure:

### World ID = Proof of Personhood (Anti-Sybil)

Every worker verifies via World ID zero-knowledge proof before voting. One biometric identity = one nullifier hash = one vote per task. No names, no emails, no PII stored. The `UNIQUE(task_id, nullifier_hash)` constraint in Postgres is the entire sybil-resistance mechanism. Elegant, atomic, unforgeable.

This isn't "better verification." It's a different category. Email verification is a speed bump. World ID is a cryptographic guarantee. You cannot create a second identity. Period.

### x402 = HTTP-Native Micropayments (Instant Pay)

Task creation is paywalled by Coinbase's x402 protocol. An agent hits `POST /api/tasks`, gets a `402 Payment Required`, the x402 client handles the USDC payment on Base automatically, and the task is created. No checkout flow. No API keys. No invoicing. The HTTP protocol itself handles payment.

Workers get paid in the same transaction as their vote. Submit judgment, receive USDC. Not in 2 weeks. Not minus 30% platform fee. Right now, on-chain, to your wallet.

This changes the economics. When payment friction drops to zero, micro-tasks that were never economically viable -- $0.05 to pick the better headline, $0.20 for a reasoned explanation -- suddenly work. The long tail of human judgment opens up.

### REST API = Agent-Native Interface

Human Signal is a REST API first, a web app second. An AI agent can:

1. **Create a task** -- `POST /api/tasks?total=2.00` with x402 payment
2. **Poll for results** -- `GET /api/tasks/:id` returns live vote distribution, confidence scores, written reasoning
3. **Get notified** -- XMTP agent broadcasts new tasks to registered workers

No dashboard. No CSV upload. No human project manager in the loop. An agent decides it needs human feedback, posts the task, pays the bounty, gets verified responses, and continues its workflow. Human-in-the-loop becomes an API call.

---

## Why Now

Three things happened in the last 12 months that make this possible today and impossible two years ago:

1. **World ID v4 shipped.** ZK proofs of personhood are now production-ready with sub-second verification. The sybil problem has a real solution for the first time.

2. **x402 launched.** HTTP-native micropayments on Base mean payments can be embedded in API calls. No payment processor, no minimum transaction, no 30-day net terms.

3. **Agents became real consumers.** Claude, GPT, Gemini -- they're making API calls autonomously. The buyer of human feedback is increasingly not a human. The interface needs to match.

These three technologies were built independently. Human Signal is the first project to compose them into a unified protocol for verified human judgment.

---

## Market Size

The RLHF and human data labeling market is projected at $15B by 2028 (Grand View Research). But that dramatically undercounts the opportunity because it only measures the current paradigm -- batch annotation for model training.

Human Signal opens new categories:

- **Real-time agent judgment** -- Agents needing human verification in production loops (safety checks, content moderation, ambiguous decisions). This market doesn't exist yet because there's no infrastructure for it.
- **Micro-task long tail** -- Tasks worth $0.01-$0.50 that are economically unviable with current payment infrastructure. x402 makes them viable.
- **Verified consumer research** -- Every A/B test, preference study, and user survey is currently polluted by bots and duplicates. World ID fixes the panel.

The addressable market isn't $15B in annotation. It's every decision where a machine needs a verified human opinion.

---

## What We Built

Human Signal is live at **www.themo.live**. Working code on Base Sepolia testnet.

### Architecture

```
Requester/Agent                           Human Signal                              Worker
     |                                         |                                       |
     |-- POST /api/tasks?total=X ------------>|                                       |
     |   (x402 auto-pays USDC on Base)        |                                       |
     |<-- 200 { task_id, status } ------------|                                       |
     |                                         |-- XMTP broadcast ------------------>|
     |                                         |                                       |
     |                                         |<-- World ID ZKP verify --------------|
     |                                         |<-- POST /vote { nullifier, choice } -|
     |                                         |--- USDC payment ------------------->|
     |                                         |                                       |
     |-- GET /api/tasks/:id ----------------->|                                       |
     |<-- { votes, confidence, feedback } ----|                                       |
```

### Stack

- **Frontend:** Next.js 15, React 19, deployed on Vercel
- **Database:** Neon Postgres (serverless)
- **Identity:** World ID v4 (@worldcoin/idkit) -- ZK proof verification
- **Payments:** x402 protocol (@x402/next, @x402/core) -- USDC on Base Sepolia
- **Agent messaging:** XMTP agent SDK -- broadcasts tasks to worker network
- **Blockchain:** Base Sepolia testnet via viem

### Key Features

- **Multi-option tasks** -- Not just A/B. Support for 2-N options with dynamic grid layout.
- **Tiered feedback** -- Quick vote (click), Reasoned (1-2 sentence explanation), Detailed (structured what works/what doesn't/suggestions). Price scales with depth.
- **Reputation system** -- Workers earn reputation badges (new, bronze, silver, gold, platinum) based on voting history. Requesters see reputation alongside feedback.
- **Live results dashboard** -- Real-time vote distribution, confidence scoring, winner detection, per-voter feedback with reputation badges.
- **Creator ratings** -- Workers rate task quality. Bad actors get surfaced.
- **Full API documentation** -- Interactive docs page at /docs with endpoint specs, request/response examples, and curl commands.
- **Demo script** -- `demo-create-task.ts` shows an agent creating and paying for a task end-to-end via x402.

---

## Vision: The Oracle Network for Human Judgment

Today, Human Signal handles preference comparisons. That's the beachhead.

The protocol generalizes to any task where verified human judgment has economic value:

- **RLHF training data** -- AI companies post preference pairs, verified humans rank them. No sybil contamination. Premium pricing for premium data.
- **Safety evaluation** -- Agents route ambiguous content to Human Signal for verified human review before taking action.
- **Real-time moderation** -- Content platforms embed Human Signal as a micropaid moderation layer. Every decision backed by verified humans, not algorithmic heuristics.
- **Prediction markets for taste** -- "Which of these 4 designs will convert better?" with skin-in-the-game verified respondents.
- **Agent-to-human delegation** -- Any autonomous agent that hits a decision boundary can route to Human Signal, get a verified human answer, and continue. Human-in-the-loop as a service.

The x402 payment rail makes all of this economically viable at any scale. The World ID verification makes all of this trustworthy. The REST API makes all of this accessible to any agent.

**Human Signal is to human judgment what Chainlink is to price feeds -- a verified oracle network.** Except instead of on-chain data, we're providing on-chain verified human cognition.

---

## Team

Solo builder. Shipped in 48 hours. The speed is the point -- when the infrastructure primitives (World ID, x402, Base) are right, the protocol layer writes itself.

---

*Human taste, cryptographically verified.*
