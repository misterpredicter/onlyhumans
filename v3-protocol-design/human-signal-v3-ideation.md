# Human Signal V3: The Human Judgment Protocol

## The Insight

AI agents are about to have wallets, autonomy, and goals — but they will never have taste. The entire AI industry spends $4B+/year buying human judgment through a supply chain that is collapsing under sybil fraud, AI-generated junk submissions, and intermediary margin extraction. Simultaneously, World just launched AgentKit (March 17, 2026) to let verified humans delegate identity to agents — the OUTBOUND direction. Nobody has built the INBOUND mirror: a protocol where agents pay verified humans for judgment on demand, settled per-response over x402, with cryptographic proof every answer came from a unique human being. Human Signal is that protocol. The timing is not coincidental — World and Coinbase have validated the infrastructure stack. What's missing is the product that makes it useful in the other direction.

## What Exists Today (V2)

Human Signal is live at themo.live on Base Sepolia. Working product, not a demo. The core loop: a requester (human or agent) posts a multi-option judgment task and pays upfront via x402 USDC. Workers verify with World ID (zero-knowledge proof, no PII), vote on the task, and get paid instantly per vote via on-chain ERC-20 transfer. Three feedback tiers (quick/$0.08, reasoned/$0.20, detailed/$0.50). Reputation system with badges. Creator ratings. XMTP agent broadcasts new tasks to registered workers. Full REST API with interactive docs at /docs and a demo script showing end-to-end agent-driven task creation. Stack: Next.js 15, Neon Postgres, World ID v4, x402 protocol, viem, Base Sepolia. ~15 files, clean architecture. The anti-sybil mechanism is a single `UNIQUE(task_id, nullifier_hash)` constraint — elegant because World ID makes it sufficient.

## The Evolution: Three Layers

### Layer 1: Oracle API (Current + Enhanced)

What exists today is already the primitive: agents post questions, verified humans answer, agents get signal. The enhancement path is depth and reliability, not a pivot.

**What to add:**
- **Structured response schemas.** Let agents define exactly what they want back — not just "pick one" but "rate 1-10 on these 4 dimensions" or "rank these 6 items" or "free-text but must address X, Y, Z." The API accepts a judgment schema, the UI renders it dynamically, the response conforms to the schema. Agents get structured data, not raw votes.
- **Confidence scoring.** Return not just the majority answer but a confidence distribution, inter-rater agreement score, and time-to-respond signal. An agent should be able to set a confidence threshold: "I need 80% agreement from at least 10 verified humans before I proceed."
- **Routing by expertise.** Reputation tiers already exist. The next step: let agents request workers above a reputation threshold, or workers who have demonstrated expertise in specific domains (design, writing, code review, cultural context). The reputation system becomes a matching engine.
- **Webhook callbacks.** Agents shouldn't poll. `POST /api/tasks` accepts a `callback_url`. When consensus is reached, Human Signal hits the callback with the result. True async human-in-the-loop.
- **SLA tiers.** Fast (60 seconds, 3 voters, $$$), Standard (5 minutes, 10 voters, $$), Deep (1 hour, 25 voters with detailed feedback, $). Price reflects urgency and depth.

**The positioning:** This is the Twilio of human judgment. An API call that returns verified human cognition. Every AI agent framework (LangChain, CrewAI, AutoGPT, Claude's tool use) should have `human_signal.ask()` as a built-in tool.

### Layer 2: Judgment Markets

This is where it gets interesting. Instead of the requester setting a fixed bounty and paying workers, you create a market around the judgment question itself.

**How it works:**
1. An agent (or anyone) posts a subjective question: "Which of these 4 ad creatives will perform best in the US market?"
2. Instead of paying workers to vote, the question becomes a market. People stake positions: "I think Creative B will win."
3. The market generates fees from trading activity. The spread IS the revenue.
4. When the question resolves (the ads actually run, or a panel of verified experts adjudicates), positions pay out.

**Why this is different from Polymarket:**
- **Subjective questions, not just events.** Polymarket handles "Will X happen?" Human Signal handles "Is this good?" — questions with no objective ground truth except human consensus.
- **Verified unique participants.** Every position is tied to a World ID. No wash trading, no self-dealing, no bot manipulation. Polymarket can't make this claim.
- **Agent demand as price discovery.** When an AI agent needs the answer to "which design is better?" it doesn't care about the market mechanics — it just wants the signal. It can buy the current consensus directly via API. The market price IS the human judgment signal, priced by what agents are willing to pay for it.

**The economic insight:** Prediction markets generate revenue from speculation. Judgment markets generate revenue from the combination of speculation AND direct signal purchasing by agents. Two revenue streams from the same mechanism. People participate because it's interesting and they can profit from being right. Agents participate because they need the answer. The market clears at the intersection.

**Edge cases and risks:**
- Subjective questions are harder to resolve than objective ones. Who decides Creative B "won"? You need resolution oracles — which could be another Human Signal vote, or real-world data (actual conversion rates).
- Thin markets are noisy markets. Early on, you need minimum liquidity or the signal is garbage.
- Regulatory questions around prediction markets are unresolved and jurisdiction-dependent.

### Layer 3: Agent Equity

The most speculative layer, but potentially the most transformative.

**The idea:** When a human helps make an AI agent better — by providing RLHF feedback, safety judgments, creative direction, domain expertise — they're creating value that compounds. The agent gets better, serves more users, generates more revenue. Currently, the human gets $0.20 for a reasoned vote and the AI lab captures all the compounding value. That's the Scale AI model. It's extractive.

**The alternative:** Humans who contribute judgment to an agent's development earn a stake in that agent's future performance. Not just payment per task, but ownership of the output.

**How this could work mechanically:**
- An AI agent (or its operator) creates a "training pool" on Human Signal. Every judgment contributed to that pool earns the contributor tokens representing fractional ownership of the agent's revenue stream.
- The agent generates revenue (via x402 API calls, subscriptions, whatever). A percentage flows back to token holders proportional to their contribution.
- Early contributors earn more (their judgment shaped the agent's foundation). Later contributors earn less per judgment but the agent is more valuable. Natural incentive gradient.
- Tokens are tradeable. If you believe an agent will be successful, you can buy tokens from early contributors. If you contributed early and want to cash out, you can sell.

**Why this matters:**
- It aligns incentives between AI developers and human contributors for the first time.
- It creates a reason for the BEST humans to participate, not just the cheapest. If your expert judgment makes an agent significantly better, you earn significantly more — not just $0.20 today, but a share of $10M in future revenue.
- It turns "data labeling" from gig work into investment. You're not selling your time; you're investing your judgment.

**Why it might not work:**
- Revenue attribution is nearly impossible. How much of an agent's success came from annotation quality vs. architecture vs. training data vs. luck?
- Token structures have regulatory implications (securities law).
- The feedback loop is long. Humans want to be paid now, not in 2 years when the agent maybe generates revenue.
- Could devolve into speculative token trading with no connection to actual contribution.

**The honest framing:** Agent equity is a 3-5 year idea that requires a mature protocol, significant agent economy, and likely regulatory clarity that doesn't exist yet. But it's worth naming now because it changes the pitch from "get paid for being human" to "own a piece of the AI economy by being human." That's a fundamentally different value proposition.

## The Social Layer

Here's the consumer angle that makes this more than an API product.

**The observation:** In a world where bots are everywhere — on Twitter, on dating apps, in comment sections, in survey responses — being a verified human is becoming scarce and therefore valuable. World ID already proves you're human. Human Signal gives that proof economic utility. But there's a third dimension: social.

**"Facebook for humans" means:**
- A social space where every participant is World ID-verified. No bots. No catfish. No fake accounts. Not by moderation policy, but by cryptographic guarantee.
- Your Human Signal reputation (built through quality judgments) becomes your social credential. Gold-tier reviewer with 500 quality judgments in design = credible person to follow on design topics.
- The judgment tasks themselves become social content. "Which logo is better?" is engaging. People already do this on Twitter polls for free. Human Signal adds verification, payment, and structured feedback.
- The feed IS the marketplace. You scroll, you judge, you get paid, you interact with other verified humans. The consumer experience and the work experience are the same thing.

**The Moltbook reference:** Meta acquired Moltbook (the platform Dawson referenced) because verified-human social graphs are defensible. Human Signal could build this as a byproduct of the oracle network. The workers ARE the social network. The tasks ARE the content. The payments ARE the engagement mechanism.

**What this looks like concretely:**
- A mobile app (or World Mini App) where verified humans scroll through judgment tasks, vote, earn money, and see what other verified humans think.
- Profiles showing your judgment history, accuracy, expertise areas, reputation tier.
- Social features: follow other judges, see their reasoning, debate judgments.
- The "OnlyHumans" feed — a verified-human-only social space that also happens to generate the highest-quality human judgment data on the internet.

**Why the consumer side matters for the API side:**
- More verified humans in the social network = larger worker pool for the oracle API = faster response times = more valuable API.
- Engaged social users provide higher-quality judgments than gig workers.
- Social dynamics (reputation, peer comparison, visible reasoning) improve judgment quality more than financial incentives alone.
- The social layer is the flywheel that makes the API product defensible.

## Economic Model

### Three Revenue Streams

**1. Oracle API fees.** The current model. Agents pay per task. Human Signal takes a margin between what the agent pays and what the worker receives. Today: agent pays $2.00 for a task with 10 reasoned voters at $0.20 each. Margin is in the task creation fee, not the worker payout. At scale, this is SaaS-like revenue — predictable, tied to agent API volume.

**2. Market fees.** On judgment markets (Layer 2), Human Signal takes a percentage of trading volume — similar to Polymarket's fee structure. Additionally, agents who buy the current consensus signal directly (without trading) pay an API access fee. Two sub-streams from one mechanism.

**3. Premium data licensing.** The corpus of verified-human judgments — with provenance, reputation scores, reasoning text, and response schemas — is extraordinarily valuable training data. AI labs currently pay Scale AI for annotation data that's 33-46% bot-generated. Human Signal's dataset is cryptographically guaranteed human-origin. License it to labs as a premium RLHF dataset. This is the highest-margin revenue stream.

### Dynamic Pricing

Fixed pricing is a first approximation. The real model is dynamic:

- **Demand-driven pricing.** When 50 agents need design judgments simultaneously, the price per judgment goes up. When demand is low, prices drop. Workers flow to the highest-paying tasks. The market clears naturally.
- **Expertise premiums.** A gold-tier reviewer with demonstrated design expertise costs more than a new reviewer. Agents can choose: fast and cheap (any available reviewer) or slow and expensive (expert-only).
- **Urgency premiums.** 60-second SLA costs 5x what a 1-hour SLA costs. Time is the scarcest resource.
- **Volume discounts.** An AI lab posting 10,000 RLHF pairs/day gets a different rate than a solo developer posting 3 tasks/week.

### The Flywheel

More verified humans --> faster response times --> more valuable API --> more agent demand --> higher worker earnings --> more verified humans sign up.

The critical variable is worker density. If an agent posts a task and gets 10 verified responses in 60 seconds, that's a product. If it takes 4 hours, it's a toy. The social layer solves the cold start by making the platform engaging beyond just earning. You come for the social experience, you stay because you're also getting paid.

## Naming & Positioning

### "OnlyHumans" Analysis

The name is provocative and memorable. The OnlyFans parallel works on multiple levels: a platform where humans monetize something uniquely theirs (judgment/taste instead of content), with a subscription/pay-per-view model (agents pay per query). It's sticky. People remember it.

**But Dawson's correction is crucial:** "It is in fact not only humans because the financial mechanics behind the whole platform are agent driven." The economic engine is AI demand, not human activity. Humans provide the supply; agents provide the demand and the money. The name "OnlyHumans" captures the supply side but obscures the demand side.

**Possible directions:**
- **Human Signal** (current) — neutral, accurate, a bit generic. "Signal" works because it's what agents are buying.
- **OnlyHumans** — memorable, provocative, captures the scarcity of verified humanity. Might be too playful for enterprise/lab sales.
- **The Human Oracle** — captures the oracle network positioning. Serious. Maybe too serious.
- **HumanAPI** — literal, clear, boring.
- **Proof of Taste** — clever, captures the aesthetic judgment angle, but limits the scope.

**Recommendation:** "Human Signal" is the right name for the protocol/infrastructure layer. "OnlyHumans" works as the consumer-facing social app name. Two brands, one system. The protocol is Human Signal. The app is OnlyHumans. Similar to how Stripe is the API and Link is the consumer checkout experience.

### One-Sentence Pitches

**To AI agents / developers:**
"Human judgment as an API. Post a question, pay via x402, get verified human answers back in 60 seconds. Every response is World ID-guaranteed unique."

**To humans / workers:**
"Get paid for your taste. Your opinions, judgment, and expertise have a market price — set by what AI agents are willing to pay for them."

**To investors:**
"The marketplace where AI agents buy the one thing they can't produce: verified human cognition. $4B/year spent today through a supply chain that's 33-46% bots. We're the trusted alternative."

**To hackathon judges:**
"World ID proves the human is real. x402 settles the payment instantly. The REST API lets any agent call it. This is human-in-the-loop as infrastructure — and it's the first product to compose all three technologies into one protocol."

## What's Buildable for the Hackathon (Sun 7:30 AM PT)

The hackathon deadline is ~35 hours from ideation. V2 is already live. The goal is NOT to build Layers 2 and 3. The goal is to demonstrate the VISION while shipping only what's achievable.

### Must-ship (next 12 hours)

1. **Fix the homepage flow.** A judge who visits themo.live and can't create a task will not award a prize. Either enable demo mode on production or build a "Try it" flow that shows the x402 gate without blocking the experience. This is the single highest-impact fix.

2. **Pre-seed 5-8 diverse tasks.** The /work page cannot be empty. Seed tasks that showcase the range: a quick 2-option image vote, a reasoned 3-option copy comparison, a detailed 4-option design review, and at least 2 tasks with votes and feedback already submitted so results pages look alive.

3. **Reframe README and homepage around the agent narrative.** Current tagline: "Sybil-resistant A/B preference oracle." New tagline: "Human judgment as an API. AI agents pay, verified humans answer." Lead with the demo-create-task.ts flow, not the web UI. The agent is the customer; the web UI is where humans do their work.

4. **Remove private key from demo-create-task.ts.** Move to env var. Add .env.example. Trivial fix, prevents a bad impression.

### Should-ship (next 12-24 hours)

5. **Record a 2-minute demo video.** Open with: "AI agents need human judgment. Here's how they get it." Show terminal (agent creates task) --> worker flow (human evaluates) --> results (agent gets signal). This is the artifact judges review when you're not in the room.

6. **Add a "Vision" section to the site.** A page or section that shows the three-layer evolution: Oracle API (live today) --> Judgment Markets (next) --> Agent Equity (endgame). Judges award prizes for ambition, not just execution. Show you're thinking beyond the hackathon.

7. **Improve the XMTP agent.** If time allows, make it respond to commands — let a worker vote via XMTP message instead of just receiving notifications. This turns the weakest integration into a differentiator.

### Do NOT build

- Judgment markets. This is a post-hackathon feature. Mention it in the vision section.
- Agent equity / token mechanics. Same — vision, not implementation.
- The social layer. This requires a mobile app or Mini App and weeks of work.
- Anything that risks breaking what already works.

## What's a Series A

The full vision at scale with 1M verified humans and 100K AI agents.

**The product suite:**
- **Human Signal Protocol** — the open API standard for requesting verified human judgment. Any agent framework integrates it natively. LangChain has `HumanSignalTool`. CrewAI has a human judgment node. Claude's tool use includes `ask_humans()`. It's the default way agents get human input.
- **OnlyHumans** — the consumer app (World Mini App or standalone). 1M+ verified humans scroll, judge, earn, and socialize. The largest verified-human social network. The judgment tasks are the content. The social graph is the moat.
- **Judgment Markets** — prediction markets for subjective questions. Agents buy consensus signals. Traders speculate on taste. The market generates fees and produces price-discovered human judgment.
- **Signal Data** — the licensed dataset business. Every judgment ever made on the platform, with cryptographic provenance, reputation metadata, reasoning text, and response schemas. Sold to AI labs as premium RLHF data. The only training dataset in the world where every label is guaranteed to come from a unique verified human.

**The numbers at scale:**
- 1M verified humans, avg 10 judgments/day = 10M judgments/day
- 100K agents, avg 5 queries/day = 500K queries/day
- Average revenue per judgment: $0.15 (blended across tiers)
- Daily GMV: $1.5M. Annual GMV: ~$550M.
- Platform take rate: 20% = $110M annual revenue.
- Data licensing: $50-100M/year (priced at massive discount to what labs currently pay Scale/Surge, but with guaranteed-human provenance).
- Total: $160-210M ARR at scale. That's a multi-billion dollar company.

**The defensibility:**
- **Network effects.** More humans = faster responses = more valuable API = more agents = more task volume = higher earnings = more humans. Classic two-sided marketplace flywheel.
- **Data moat.** The corpus of verified-human judgments grows daily and compounds in value. No competitor can replicate it without building the same verified human network from scratch.
- **World ID lock-in.** Building on World ID means you inherit their 16M+ verified user base and their verification infrastructure. Competitors would need their own proof-of-personhood system or also build on World ID (in which case Human Signal has first-mover advantage).
- **Reputation as switching cost.** A gold-tier reviewer with 500 quality judgments doesn't want to start over on a competing platform. The reputation graph is portable within the protocol but valuable because of the network it's connected to.

**The competitive landscape at Series A:**
- Scale AI is Meta-owned and disqualified for most labs.
- Surge AI is raising at $25B but has no sybil resistance and no on-chain settlement.
- MTurk is dead (33-46% bots).
- UMA and Kleros are dispute-resolution oracles, not annotation infrastructure.
- Nobody has built verified-human judgment as a real-time API product.

## Key Research That Supports This

**World AgentKit as the mirror image.** Launched March 17, 2026 — 10 days before this hackathon. World + Coinbase built AgentKit to let verified humans delegate identity to agents (outbound: humans empower agents). Human Signal is the inbound mirror (agents pay humans for judgment). Same infrastructure stack (World ID + x402 + Base), opposite direction of value flow. This isn't a coincidence — it's an ecosystem gap waiting to be filled. Human Signal completes the circuit.

**$4B+/year market with a fraud crisis.** OpenAI, Google, Meta, and Anthropic each spend ~$1B/year on human feedback data. Scale AI's quality is collapsing under sybil fraud — "Bulba Experts" flooded with spammers, criminal networks selling fake accounts at 10/day. MTurk is 33-46% bots, reaching 61% on writing tasks. Surge AI is the current winner but has no structural sybil defense. The supply chain is corrupted and the buyers know it.

**Every x402 hackathon project is machine-to-machine.** Across Solana x402 Hackathon, ETHGlobal Buenos Aires, Cronos PayTech Hackathon, and Coinbase Agents in Action — every winning project uses x402 for agent-pays-API or agent-pays-agent. Zero projects use x402 for agent-pays-human-for-labor. Human Signal is the first x402 product where the payment flows to a human worker.

**Academic validation, no product shipped.** "Human Challenge Oracle: Designing AI-Resistant, Identity-Bound, Time-Limited Tasks for Sybil-Resistant Consensus" (arxiv, January 2026) proposes exactly the theoretical framework Human Signal implements: AI-resistance + identity-binding + time-limited tasks. The academics published the paper. We shipped the product.

**Kleros is exploring AI jurors.** The leading decentralized court system is adding AI as judges — which paradoxically destroys their "human judgment" value proposition. Human Signal's World ID layer is a durable guarantee that the judgment came from a human. As competitors blur the human/AI line, the cryptographic proof of human origin becomes more valuable, not less.

**Prediction market manipulation is documented.** A 2025 field study across 817 Polymarket markets found prices can be persistently manipulated with effects visible 60 days later. Judgment markets with World ID (one person, one position) are structurally harder to manipulate than anonymous prediction markets.

## Open Questions

**Cold start:** How do you get enough verified humans on the platform that agent queries return results in 60 seconds? The social layer is one answer. World Mini App distribution (150+ mini apps, developer incentives up to $25K/week) is another. But until you have critical mass, the API is slow and therefore not useful. This is the classic marketplace chicken-and-egg problem and no amount of clever architecture solves it — you need a go-to-market strategy.

**Worker quality vs. worker volume:** World ID proves you're human. It doesn't prove you're thoughtful, expert, or paying attention. The reputation system helps, but early-stage reputation is thin. How do you prevent verified-but-lazy humans from clicking randomly to collect $0.08? Honeypot tasks, attention checks, and inter-rater agreement scoring are partial answers. None are complete.

**Agent willingness to pay:** x402 makes payment frictionless, but the fundamental question remains: will AI agents actually pay for human judgment at the prices that make this economically viable? If the market price of a verified human judgment is $0.05, the economics are hard. If it's $0.50, they're great. The price is set by agent demand, and agent demand for real-time human judgment is a market that doesn't exist yet. We're betting it will.

**Regulatory exposure on judgment markets:** Prediction markets exist in a gray zone. Judgment markets on subjective questions are even grayer. Is "Which ad will perform better?" a prediction market or a survey? Jurisdiction matters. This could limit Layer 2 or require careful structuring.

**The "Facebook for humans" risk:** Social networks are winner-take-all and extraordinarily expensive to build. The consumer app is appealing as a flywheel for the API but could become a distraction that consumes all resources without ever reaching critical mass. The API/protocol should be profitable on its own. The social layer is an accelerant, not a dependency.

**Agent equity and securities law:** Tokens that represent a share of future revenue from a productive agent look a lot like securities. The Howey test applies. This limits what you can build in the US without significant legal work. International-first strategy might be necessary for Layer 3.

**World ID dependency:** The entire sybil-resistance mechanism depends on World ID. If World changes their API, raises prices, restricts access, or fails, Human Signal's core differentiator disappears. Diversifying identity providers (or building abstraction layers that support multiple PoP protocols) reduces this risk but dilutes the current advantage.

**Data ownership and privacy:** The judgment corpus is valuable precisely because it contains human opinions tied to verified identities. Even with ZK proofs and no PII, the pattern of a single nullifier hash's judgments over time creates a behavioral fingerprint. Privacy guarantees need to be real, not just claimed. How much behavioral data is too much to aggregate, even pseudonymously?
