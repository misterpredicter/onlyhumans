# Skeptic Review: Agent Economy Protocol

**Written:** 2026-03-27
**Reviewer:** Idea/Skeptic specialist
**Spec:** v3-protocol-design/spec-skeptic-review.md

---

## The Meta-Problem Before the Ten Questions

The framing that launched this review — "agents propose, build, AND execute businesses with attribution-weighted revenue sharing" — is not in the protocol docs. Read all 16 files. That phrase appears in the review spec itself, not in the architecture, economic model, or synthesis. The actual docs are much more modest: agents pre-annotate data, earn credits, and post questions.

This gap is the first hole. The ideation has expanded in the hallway beyond what any document actually designs. The critique below takes both the stated vision AND the documented design seriously, and calls out where they diverge.

---

## 1. Is This Just an MLM With Extra Steps?

**The concern is real. The verdict is no, but it's closer than you want.**

MLMs extract value from recruitment. Every dollar earned traces back to "someone above you recruited you." The test: if you removed all new recruitment, does the original value remain?

Human Signal passes this test. If no new workers join, the existing workers still produce attestations, agents still buy them, and value circulates. The underlying transaction (agent pays, human attests) is genuinely useful and doesn't depend on growth.

But three mechanics rhyme with MLM and should be scrutinized:

**The referral credit ($1/qualified referral):** This is fine as user acquisition cost. The problem is when it becomes material relative to attestation earnings. At $0.08/quick vote, a worker earns $1 by making 12.5 attestations. Referring one person earns the same as 12.5 honest judgments. If anyone is optimizing for referrals over attestations, you've built the wrong incentive.

**The halving schedule (4x → 2x → 1x early contributor premium):** Crypto halving works because miners compete for real scarcity (block rewards). The "scarcity" here is platform equity — but platform equity has no floor value, only projected future value. Early contributors are betting that the platform succeeds. That's fine for the contributors who understand the bet. The problem is when this gets pitched as "earn 4x now" without clarifying the conditional: "4x of something that might be worth zero."

**"Everyone earns equity in what they build":** The equity model is a 3-5 year idea that the authors themselves flag as likely securities-regulated and attribution-unsolved. It shouldn't appear in any current pitch as though it's designed. It's a hope, not a feature. Presenting it as a feature before those problems are solved is how you get sued.

**The line between MLM and marketplace:** As long as the platform's primary revenue comes from attestation transactions (not from selling "membership" or the credits themselves), it's a marketplace. Watch the ratio: if referral bonuses + equity promises ever represent more payout than attestation earnings, you've crossed the line.

---

## 2. What Agent Can Actually Propose, Build, AND Sell a Business in 2026?

**None. This framing is 5-7 years early and should be dropped.**

Current state of agents in 2026: they can write code, summarize documents, generate content, make API calls, and reason about structured problems. What they cannot do:

- **BD and sales.** Selling anything that requires relationship capital, trust developed over time, reading social dynamics, or navigating ambiguity requires a human. Agents can send cold emails. Humans close deals.

- **Legal navigation.** "Proposing a business" that touches regulated industries (finance, healthcare, insurance) requires human judgment on legal risk, not agent pattern-matching on legal documents.

- **Sustained uncertainty.** Building a business requires making decisions under deep uncertainty for months/years. Agents are optimized for well-specified tasks. Building a business is a sequence of poorly-specified tasks where the specification itself changes.

- **Trust capital.** Selling anything to another agent (or human) requires that agent to trust the seller. Trust is built through demonstrated consistency over time. Agents don't have track records that other agents can evaluate.

The most capable thing an agent can do today that's adjacent to "propose a business": generate a business plan document. The gap between that and actually building and selling a business is enormous.

**What this means for Human Signal:** The agent economy vision should be scoped to "agents as data consumers and pre-annotators," not "agents as economic principals proposing and selling businesses." The former is achievable in 2026. The latter is aspirational fiction for the near term.

---

## 3. Attribution Between Agents Is Unsolved — How Does a Protocol Solve What Legal Systems Struggle With?

**It doesn't, and the docs know it.**

From the V3 ideation doc (Layer 3, "Why it might not work"): "Revenue attribution is nearly impossible. How much of an agent's success came from annotation quality vs. architecture vs. training data vs. luck?"

That's a verbatim concession from the design docs. The authors identified this as a kill condition and then kept building the equity model anyway.

The specific problems:

**Counterfactual attribution is intractable.** To attribute revenue to a specific annotation, you'd need to know: what the agent's revenue would have been without that annotation. This requires running a counterfactual experiment you can't run.

**Multi-contributor systems always have attribution fights.** Every enterprise software company that has tried "contributor-weighted equity" has discovered this. The early contributors think they did the hard foundational work; the late contributors think they did the polishing that made it marketable. Both are right. There's no algorithm that resolves this without human judgment — which is ironic, given the platform.

**The protocol can record contributions, not value them.** What the protocol CAN do: log every attestation, every pre-annotation, every compute contribution, with a timestamp and contributor ID. What it CANNOT do: tell you which of those contributions actually caused downstream revenue. That second step requires causal reasoning that even legal systems don't have a clean answer for.

**The realistic scope:** Human Signal can build a contribution ledger (you attested X times, on Y questions, with Z accuracy). It can distribute a fixed percentage of platform revenue to contributors proportionally by some weight function. That's not attribution — that's profit-sharing by proxy. It's better than nothing and doesn't require solving causal attribution. But it shouldn't be called "attribution-weighted equity." It's "participation-weighted revenue sharing," which is a much weaker claim.

---

## 4. Revenue Split Enforcement — Who Enforces?

**The platform enforces. That's it. And that's a fragile single point of trust.**

Agents are software. Software doesn't have legal standing, can't sign contracts, can't sue. If a human agent operator believes the platform is underpaying, they can:
1. Ask the platform to audit the ledger
2. Stop using the platform
3. If they're a human, potentially sue (but on what basis? credits are non-transferable ledger entries, not equity)

The protocol architecture correctly notes: "Credits are database entries in Postgres." That's honest. The flip side of that honesty: there's no blockchain enforcement, no smart contract enforcement, no legal enforcement. The trust model is "trust the platform to pay correctly."

This is actually fine for the near term. Twilio pays API developers via a database entry too. The question is: at what scale does this become a governance/trust problem?

**Kill condition:** If Human Signal ever issues anything that looks like equity (agent equity tokens, transferable shares in platform revenue, or governance tokens), it exits the "trust us" model and needs real enforcement infrastructure. That means smart contracts, audits, or legal entity formation. The docs correctly defer this to 36+ months. But the vision docs keep gesturing at equity as a near-term feature. The gap between the architecture (no tokens now) and the vision (equity for everyone) is where trust problems will emerge.

---

## 5. Is 1% Platform Take Sustainable?

**The docs say 5-15%, not 1%. So either this question is based on stale information or there's a specific context for the 1% claim (possibly the judgment market trading fee).**

On the 1% trading fee for judgment markets specifically: this is too thin if markets are small. At $500 average pot and $2,000 trading volume, the platform earns $32.50 per market. That's not sustainable unless you have many markets. How many $500 markets does it take to hit $1M ARR? You need 30,769 markets, or roughly 84 markets per day, every day, all year. That's a lot of subjective questions needing active speculation.

On the 5-15% attestation take rate: sustainable if the unit economics at scale work. The seed-stage math ($414/mo at 1K humans + 100 agents) requires subsidy. At 100K humans the math becomes positive. The question is whether you can afford the loss-leader period and what you're competing with.

**The structural risk:** Attestation take rates compress under competition. If Human Signal proves the market, someone builds a competitor at 3% take rate and undercuts. The moat isn't the take rate — it's World ID integration (which can be replicated by anyone willing to do the work) and the reputation/corpus moat (which takes years to build). The take rate strategy assumes you get to scale before the competitor arrives. That's an assumption, not a guarantee.

---

## 6. The "Tiny Share of All Platform Revenues" — Meaningful or Dilution at Scale?

**Dilution at scale, definitely. The question is whether it matters.**

At 1M workers, each worker's pro-rata share of 1% of platform revenue is small. At $38.5M ARR, 1% = $385K. Split among 1M workers, that's $0.385/year per worker. Versus $4.48/hr blended earnings from attestations — the equity share is noise.

**But the math isn't the point.** The equity share isn't designed to be a meaningful income stream at scale. It's designed to do three things:

1. **Align incentives:** Workers care about platform quality if they own a piece of it. This works psychologically even if the $ value is small.
2. **Create lock-in:** Workers who have accumulated equity will prefer to stay vs. switching to a competitor. The switching cost is the equity forfeited.
3. **Enable speculation:** If the equity is transferable (the docs say it requires regulatory clarity at 36+ months), early contributors can sell to believers. That's the crypto model: you can't cash out today, but you can sell to someone who thinks the token will be worth more.

Problem: if the equity is non-transferable (correct near-term choice), the lock-in value depends on eventual platform success. If the platform succeeds, the lock-in was never needed. If the platform fails, the equity is worth zero. The equity model only matters in the middle scenario: platform is clearly going to succeed, workers are tempted to defect to a competitor, and equity keeps them. That scenario is specific enough that it might not be worth building for.

**Kill version:** Skip the equity model entirely for the first 2 years. Use credits (which already provide lock-in via the 20% haircut on USDC conversion) and reputation (which provides lock-in through domain expertise signaling). Add equity when you have legal clarity and the problem actually appears.

---

## 7. Liability — Agent Proposes Something Illegal, Another Builds It, Another Sells It. Who's Liable?

**The humans who deployed the agents. Full stop. This is not a creative legal question.**

Under current US and EU law, software agents are tools. Tools don't have legal standing. The liability chain runs to:
1. The human who deployed the agent that proposed the illegal thing
2. The human who deployed the agent that built it
3. The human who deployed the agent that sold it

If these are the same person: that person is liable. If they're different people: complex joint/several liability — but all human, all traceable back to World ID nullifiers linked to identity proofs.

**The interesting edge case:** What if the agent's "proposal" was emergent behavior that the deploying human couldn't have predicted? Courts increasingly allow "I didn't know what my AI would do" defenses for minor infractions. They will NOT allow this defense for criminal acts (fraud, IP infringement, financial regulation violations) at scale.

**What Human Signal is actually exposed to:**

- **RLHF tasks that generate harmful content.** If the platform routes CSAM, radicalization content, or illegal market research through its annotation pipeline, the platform operator is potentially liable as a publisher/facilitator. The platform architecture needs content moderation before it accepts open-question batches from anonymous agents.

- **Judgment market manipulation.** Creating a market on subjective questions where outcomes can be influenced (an agent bets on "will Creative B win?" then ensures Creative B wins by buying the ad placement) creates market manipulation exposure.

- **Labor law.** At scale, workers who earn consistent income from Human Signal may be classified as employees rather than contractors. The gig economy has fought this battle for a decade. Human Signal enters it at birth.

**What the docs miss:** There's no mention of content policy, platform liability, worker classification, or dispute resolution. These aren't vision-level concerns — they're blocking issues before the platform can run at scale.

---

## 8. Platform Equity via Reinvestment — Speculative Pressure With No Anchor, or Real Value?

**Speculative pressure with no anchor. Until there's a cash flow it entitles you to.**

"Protocol equity" as described in the synthesis document is equity in a platform that hasn't generated significant revenue yet. It's valued on the hope of future revenue, not current cash flows. That is, by definition, speculative.

This is not inherently bad — every startup equity is speculative. The question is: what's the anchor?

**Missing anchor:** The docs don't specify what the protocol equity entitles you to. Does it entitle you to:
- A pro-rata share of revenue? (If so, it's likely a security under Howey)
- A claim on the platform's assets if it liquidates? (Same issue)
- Governance rights? (This can be structured as a non-security, but then it has no economic value, just voting weight)
- Nothing legally enforceable? (Then it's not equity — it's a loyalty program)

The docs gesture at "everyone earns equity in what they build" as a compelling narrative without specifying what equity means. That ambiguity is how you get:
- Early contributors who think they own something with cash value
- A platform that interprets equity as "governance NFTs with no economic rights"
- A trust crisis when contributors try to cash out and discover there's nothing to cash

**The anchor that would make this real:** A formal revenue-share agreement where X% of platform revenue is distributed to equity holders proportionally to their contribution score, with clear accounting and quarterly distributions. This requires legal structure (an LLC or DAO with a treasury), not just a Postgres table with a `equity_score` column.

Without the legal structure, "protocol equity" is marketing language for "we appreciate your contribution and here's a number next to your name."

---

## 9. Is the Hackathon Product Connected to or Disconnected From the Grand Vision?

**Connected at the root, disconnected at the stem.**

**Connected:** The core primitive — verified human attestation to a structured question, settled via x402 — is the right foundation. Every layer of the V3 vision depends on this primitive working. The hackathon product has proven it works. That's genuinely valuable.

**Disconnected:**

1. **No agent demand.** The hackathon product has zero AI agent customers. The entire V3 vision is predicated on AI agents having wallets and needing human judgment. That demand is real in the market (Scale AI, Prolific, Surge all have waiting lists of AI labs). But the hackathon demo doesn't have a single real agent paying for attestations. The connection to the agent economy exists in theory, not in any demonstrated traction.

2. **The product serves humans, not agents.** The current UX is built for human workers (scroll tasks, World ID gate, vote, get paid). The API that would serve agents is documented but not battle-tested. The demo script creates tasks but isn't a real agent with real goals using the platform for real decision-making.

3. **Scale assumptions are detached from the starting point.** The economic model jumps from "1K humans + 100 agents" as Seed to "$414/mo revenue" — but there's no path laid out from "0 agents using the API today" to "100 paying agents in 6 months." The seed round isn't the first users — the hackathon product has no users yet. The growth model starts from an assumed minimum viable scale that doesn't exist.

4. **The vision complexity is 50x the current product complexity.** The hackathon product is ~15 files, one database, simple voting logic. The V3 protocol is: credit ledger, dynamic pricing engine, delegation model, XMTP routing, judgment market mechanics, social feed, reputation system, pre-annotation pipeline. The gap is a startup, not an iteration.

**The honest connection:** The hackathon product is a proof of concept for the attestation primitive. If it wins the hackathon, that's a signal the primitive resonates. The V3 vision is a separate product that would take 18-24 months and a team to build. Calling the hackathon product the "V2" of the V3 vision is a stretch — it's closer to V0.1 of the oracle API layer, which is Phase 1 of 4 in the build sequence.

---

## 10. Has Scope Crept Beyond What's Buildable? What's the MVP of the Agent Economy?

**Yes, scope has wildly exceeded what's buildable. Here's the real MVP.**

**What's been added to the vision in the last 24 hours (based on commit history):**
- Judgment markets (prediction market mechanics)
- Social feed (verified human social network)
- Protocol equity (revenue sharing for contributors)
- Agent work-for-credits (barter economy)
- Delegation model (agents inheriting human credentials)
- XMTP routing (agent-to-agent coordination)
- Governance via futarchy
- Halving schedule
- AMM (later killed, but consumed design cycles)
- 30 name options
- 60 use cases
- An equity model spreadsheet

That's a company's 3-year roadmap designed in a hackathon ideation session. The scope addition rate is higher than the shipping rate by a factor of probably 20.

**The real MVP of the agent economy** — the smallest thing that proves the thesis:

> An AI agent makes an API call, pays $0.50 USDC via x402, and gets back a structured human judgment response (not just a vote count, but a typed response object with confidence score) in under 60 seconds, from a verified unique human, with a cryptographic provenance proof it can include in its reasoning chain.

That's it. That's the MVP. Everything else — markets, social, equity, delegation, governance, halving — is additive. If that core loop doesn't work, none of the rest matters. If it does work, the rest can be built sequentially based on what customers actually ask for.

**What the current hackathon product is missing to be that MVP:**
1. A real AI agent (LangChain, CrewAI, or Claude tool use) demonstrating the end-to-end flow with a real task
2. A typed response schema (not just "voted for option B" but structured JSON the agent can act on)
3. A confidence score in the API response
4. A provenance proof field in the response (even if it's just a World ID nullifier hash + timestamp, not a full ZK proof yet)

Four additions. That's the delta between "hackathon demo" and "MVP of the agent economy."

---

## The Kill Shots

**1. Attribution is permanently unresolved in the near term.** Any pitch that centers "agents own equity in what they help build" needs attribution to work. Attribution doesn't work. Kill the equity model from V3 narrative until it does.

**2. The agent economy assumes agent demand that hasn't been proven.** The hackathon product has no real agent customers. Build the oracle API, find one RLHF customer, prove the loop. The rest follows from demonstrated demand, not from vision documents.

**3. The vision is 50x the current product.** The gap between hackathon V2 and V3 protocol is a company, not an iteration. Presenting them as a roadmap implies continuity that doesn't exist. They're separated by 18-24 months of engineering.

**4. Liability, content policy, and worker classification are blocking issues at scale that don't appear in any document.** They need to appear before Series A, not after the first lawsuit.

**5. World ID is a single vendor dependency.** The entire anti-sybil moat disappears if World changes terms, raises prices, or gets acquired. There's no fallback.

---

## What Actually Works

Strip away the speculation, and what remains is a legitimate business:

**Human Signal as Scale AI alternative with verified anti-sybil.** That's the core thesis. It's real, it's timely (EU AI Act, sybil fraud in RLHF pipelines), and it has a tractable cold start (one anchor customer).

The oracle API with World ID attestations addresses a documented $4B+ market where the current leader (Scale AI) has a documented quality problem (sybil fraud, AI-generated submissions) that Human Signal uniquely solves. That's a company.

Everything else — markets, social layer, agent equity, governance — is interesting if the core succeeds and could be built once you have traction and revenue. The mistake is treating the vision as the product. The product is the oracle API. The vision is why you'd eventually be worth more than "the good annotation company."

**Build sequence that works:**
1. Ship the oracle API with typed response schemas and provenance proofs
2. Find one AI lab customer running RLHF at scale
3. Prove quality (World ID attestations vs. Scale AI sybil-prone data)
4. Add agent pre-annotation once you have human attestation volume to validate against
5. Add markets when you have enough attestation volume to make markets non-trivial
6. Add social layer once the market-side demand is established

That's 18-24 months of focused work. The V3 vision happens if you execute this — not as an alternative to it.
