# Human Signal — Framing Challenge

Hackathon: World x Coinbase x402 Hackathon, March 2026
Deadline: Sunday March 29
Reviewed: full codebase, README, demo walkthrough, all API routes, components, agent, payment logic

---

## What Was Actually Built

A working, deployed web application (themo.live) where:
1. A requester posts a judgment task (multi-option, with tiers) and pays upfront via x402 (real USDC on Base Sepolia)
2. Workers verify with World ID (ZKP, no PII), then vote on tasks
3. Workers get paid automatically per vote — real ERC-20 USDC transfer from a treasury wallet
4. An XMTP agent broadcasts new tasks to registered workers
5. Results dashboard with live polling, vote distribution, reputation badges, and feedback text
6. API docs page, demo creation script, three feedback tiers (quick/reasoned/detailed)

The codebase is clean. ~15 files, coherent architecture. Next.js 15, Neon Postgres, viem for on-chain payments, proper IDKit v4 integration, x402 middleware with exact scheme registration. Not a boilerplate paste.

---

## Strengths — What Genuinely Impresses

**1. Real integration, not stitched demos.** The x402 payment gate on task creation is not a mock. The World ID nullifier-based sybil resistance is not a mock. The ERC-20 transfer to workers is not a mock. All three run on Base Sepolia with real transactions. Most hackathon projects have one real integration and two hand-waves. This has three real ones working together.

**2. The x402 integration is the cleanest use case x402 could ask for.** x402 exists to make APIs payable. This is literally an API where you pay per request to create a task, and the price is dynamic based on your parameters (bounty x voters). It's not shoehorned in — the payment IS the product mechanic. The facilitator handles the USDC payment, the API creates the task. That's exactly what x402 was designed for. Judges from Coinbase will notice.

**3. The anti-sybil design is elegantly simple.** `UNIQUE(task_id, nullifier_hash)` — that's the entire sybil resistance. World ID gives you the nullifier. Postgres enforces uniqueness. No complex staking, no token-gating, no governance theater. One human, one vote, enforced at the database level. This is the kind of thing that shows you understand the technology rather than just calling it.

**4. The product has real depth.** Multi-option (not just A/B), three feedback tiers, reputation tracking, creator ratings, context for voters, image support in options. This isn't a form that calls an API. It's a marketplace with actual mechanics.

**5. Deployed and live.** themo.live works. Demo script shows real x402 payment flow. This matters enormously — judges will actually try it.

---

## Weaknesses — Where Judges Will Be Skeptical

**1. "Human feedback marketplace" is not a new idea.** Scale AI, Surge AI, Prolific, Mechanical Turk, Clickworker — this space is crowded. The README says "Sybil-resistant A/B preference oracle" but a skeptical judge asks: "Why would anyone use this instead of Scale AI?" The answer is probably World ID + x402 + permissionless, but the current framing doesn't make that sharp enough.

**2. The value proposition is split between two audiences and unclear for both.** For AI companies: why use this instead of an existing annotation platform? For workers: why use this instead of Prolific where they already earn more? The current pitch tries to serve both and lands on neither. The homepage says "Human taste, cryptographically verified" — beautiful copy, but what problem does this solve that existing solutions don't?

**3. The XMTP agent is thin.** It polls a database and sends DMs. That's it. For a hackathon judging XMTP integration, this is the weakest link. It doesn't receive messages, doesn't handle commands, doesn't let you vote via chat. It's a notification bot, not an agent.

**4. The "framework" positioning doesn't work.** The README subtitles it as a "preference oracle" but the code is a specific application, not a framework or protocol. There's no SDK, no npm package, no way for other developers to embed this. Calling it a framework when it's an application creates a credibility gap.

**5. Demo mode undermines the x402 story.** `DEMO_MODE=true` bypasses x402. The task creation form on the homepage shows the 402 error in the UI with instructions to use `wrapFetchWithPayment()`. This means the web form doesn't actually work for end users — only the agent script does. A judge trying the homepage will hit a wall. This is a bad first impression.

**6. Private key in demo-create-task.ts.** Line 22: `const BUYER_PRIVATE_KEY = "0x61944c75..."`. Yes, it's testnet. But if a judge sees this, it's a bad look.

**7. No real task data.** If a judge goes to themo.live/work and there are 0 or 1 stale tasks, the product looks dead. Pre-seeded variety tasks showing different tiers, option counts, and bounty levels would make it feel alive.

**8. The on-chain payment story has a gap.** x402 collects USDC from the requester. The treasury wallet pays out workers. But there's no connection between those two on-chain — the treasury is a separate pre-funded wallet doing ERC-20 transfers. A smart judge will notice: "Where does the x402 payment go? Does it actually fund the treasury? Or are these disconnected?" (They're disconnected.)

---

## Alternative Framings — Ranked by Likely Impact

### Framing 1: "The Eyes for AI Agents" (RECOMMENDED)
**Pitch:** AI agents can do everything except judge taste. When Claude needs to know which UI looks better, when an autonomous agent needs human feedback on its output, when an AI pipeline needs a preference signal — it calls Human Signal. One API call, one USDC payment, verified human eyes.

**Why it wins:** This positions around the AGENT economy, which is the meta-narrative of 2026 crypto and AI. The judges are at a World/Coinbase hackathon — they live and breathe agents. x402 exists specifically to let agents pay for services. World ID exists to prove the responders are real. Human Signal is what happens when agents need the one thing they can't produce: genuine human preference data.

**Key shift:** Stop talking about "workers" and "requesters." Talk about AGENTS that need HUMAN SIGNAL. The human is the oracle. The agent is the customer. The protocol makes the transaction frictionless.

### Framing 2: "x402's Killer Use Case"
**Pitch:** x402 turns any API into a paid API. But what's the API that SHOULD be paid per-request? Not weather data (free). Not LLMs (subscriptions). Human judgment. Because every evaluation costs a real human's time, every API call SHOULD cost real money. Human Signal is the first API where x402 pricing is native, not bolted on.

**Why it wins:** Speaks directly to the Coinbase judges who built x402. Shows you understand what makes x402 different from Stripe — it's not just "crypto payments," it's pay-per-request at the protocol level. This demo proves the model.

**Key shift:** Lead with the x402 story. The demo-create-task.ts script IS the demo — show an agent making a paid API call and getting human feedback. The web UI is secondary.

### Framing 3: "Proof of Human Taste"
**Pitch:** In a world of AI-generated content, AI-generated opinions, and AI-generated reviews, how do you know the feedback is real? Human Signal gives you a cryptographic guarantee: every evaluation comes from a verified unique human (World ID), paid fairly (x402), with quality tracked (reputation tiers).

**Why it wins:** Speaks to the existential fear of the AI era. Content farms, bot armies, fake reviews — World ID was built to solve exactly this. Position Human Signal as the first consumer of "proof of personhood" that isn't just a login gate but an actual economic application.

**Key shift:** Lead with the trust angle. "Sybil-resistant" is the feature. "Trustworthy" is the benefit.

### Framing 4: "The Mechanical Turk That Can't Be Gamed"
**Pitch:** Amazon Mechanical Turk has a fraud rate of 10-40%. Scale AI spends millions on quality control. Human Signal achieves one-person-one-vote with a single database constraint, because World ID makes sybil attacks mathematically impossible.

**Why it wins:** Concrete, contrarian, memorable. Anchors against a known system. Explains the "why crypto" question immediately.

**Key shift:** Open with the fraud statistics. Make the case that existing human feedback infrastructure is broken, and crypto primitives fix it.

### Framing 5: "On-Demand Human Oracle for Smart Contracts"
**Pitch:** Chainlink gives smart contracts price data. Human Signal gives smart contracts preference data. When a DAO needs to choose a logo, when a protocol needs user feedback, when a prediction market needs human judgment — it calls Human Signal.

**Why it wins:** Oracles are an established crypto narrative. "Human oracle" is a fresh angle.

**Why it's risky:** It's not actually integrated with smart contracts. It's an API, not an oracle. Would need real on-chain integration to not look like vaporware.

---

## The Winning Angle

**Framing 1: "The Eyes for AI Agents."**

Here's why: The hackathon is judged by people who work at World and Coinbase. They think about AGENT INFRASTRUCTURE. They built x402 so agents could pay for things. They built World ID so you could prove personhood. Human Signal is the product that makes both of those investments pay off in the same flow.

The narrative is:

> "AI agents are getting better at everything — except knowing what humans actually prefer. When an agent needs taste, judgment, or preference data, it has nowhere to go. Human Signal is the API for that. An agent posts a task, pays via x402, and gets back verified human preferences. World ID guarantees every response is from a unique real human. No bots. No sybil attacks. No accounts. Just an API call, a payment, and real human signal."

The demo should be 80% the agent script, 20% the web UI. The story is: agent pays, humans evaluate, agent gets signal. The web UI is just where the humans do their work.

---

## Quick Wins — Next 12 Hours

### 1. Fix the homepage to actually work (CRITICAL, 2-3 hours)
The homepage task creation form hits a 402 that users can't resolve. Two options:
- **Option A (better):** Add a "Try it" flow where the form creates a task in demo mode, then shows "In production, this would be gated by x402 payment. See our agent demo for the real flow." Put a prominent link to the demo walkthrough or a recorded demo video.
- **Option B (faster):** Just set `DEMO_MODE=true` on production so the form works, and add a banner: "Running on Base Sepolia testnet. Task creation normally requires x402 USDC payment."

A judge who can't create a task will not award a prize. Full stop.

### 2. Pre-seed 5-8 diverse tasks (1 hour)
Create tasks that showcase the product's range:
- A quick vote with 2 options (simple A/B, images)
- A reasoned vote with 3 options (copy comparison)
- A detailed review with 4 options (design comparison)
- At least one task with votes + feedback already submitted so the results page looks alive

Judges will visit /work. If it's empty, the product looks abandoned.

### 3. Record the demo video and make it bulletproof (2 hours)
Follow the DEMO-WALKTHROUGH.md script but reframe it around the agent narrative. The video should open with: "AI agents need human judgment. Here's how they get it." Show the terminal script first (agent creates task), then the worker flow (human evaluates), then the results (agent gets signal). Upload it, link it prominently.

### 4. Remove the private key from demo-create-task.ts (15 minutes)
Move it to an environment variable. Add a `.env.example` file. This is trivial but prevents a bad impression.

### 5. Rewrite the README and homepage tagline around the agent angle (1-2 hours)
Current: "Sybil-resistant A/B preference oracle built on World ID + x402 + Base Sepolia"

Proposed: "Human judgment as an API. AI agents post tasks, pay via x402, and get verified human preferences back. World ID guarantees one person, one vote. Built on Base."

The README should open with the agent use case, not the architecture. Show the demo-create-task.ts code FIRST. Then show what the human sees. Then explain the architecture.

---

## Summary Verdict

**What's impressive:** The integrations are real and work together. The x402 use case is genuinely native. The anti-sybil design is clean. The code quality is above hackathon average. The product has real depth (tiers, reputation, multi-option).

**What's mid:** The XMTP agent is a notification bot. The framing is generic ("human feedback marketplace"). The homepage doesn't actually work for end users. No pre-seeded data.

**What would a judge dismiss:** "Another data labeling marketplace but with crypto." That's the risk. The current pitch doesn't make it clear why this needs World ID + x402 + Base vs. just a normal web app with Stripe.

**The fix:** Reframe around agents. The agent is the customer. The human is the oracle. x402 is how agents pay. World ID is how you know the oracle is real. That's a story no other hackathon project will tell, because it requires all three technologies working together in a way that's actually native, and this project has already built that.
