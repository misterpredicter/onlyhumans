# Human Signal Protocol Architecture

**Status:** Design document -- protocol-level architecture for unifying three product directions
**Author:** Idea specialist
**Date:** 2026-03-27

---

## The Uncomfortable Truth First

The three directions -- OnlyHumans (social), OpenSignal (annotation protocol), Judgment Markets (prediction markets for subjectivity) -- are not three products. They are one product with three go-to-market narratives bolted onto it. The underlying architecture is identical in all three cases:

1. A question gets posted.
2. Verified humans answer it.
3. Someone pays for the answer.
4. The answer has cryptographic provenance.

Everything else -- the social feed, the open-source framing, the market pricing mechanics -- is a presentation layer on top of that loop. The protocol-level architecture doesn't change based on whether you call the interface a "social network," an "annotation pipeline," or a "judgment market."

This is good news. It means you don't have to pick. But it also means you need to stop thinking about three products and start thinking about one protocol with three interfaces.

Here's where I'll push back harder: **OnlyHumans and Judgment Markets are the same thing.** A social feed where people vote on "which outfit is better" and a judgment market where agents buy consensus on "which ad will convert" are the same data flowing through the same pipe. The only difference is who's reading the output (humans scrolling vs. agents querying) and who's paying (the platform subsidizes entertainment; the agent pays for signal). If you build the protocol right, both emerge naturally. If you try to build them as separate products, you'll build the same backend twice.

OpenSignal -- the open-source annotation protocol -- is different in kind. It's not a product direction; it's a distribution strategy. Making the protocol open-source is a decision about how the primitive gets adopted, not what the primitive does. It belongs in the go-to-market section, not the architecture section.

So the real design question is simpler than it looks: **What is the protocol? What is the participation primitive? How does the economy work?**

---

## 1. The Participation Primitive: The Attestation

Not a "judgment." Not a "signal." Not a "vote." An **attestation**.

An attestation is a signed statement by a verified human about a specific question, at a specific time, with a specific confidence level. It's the atomic unit of the entire system.

```
Attestation {
  question_id:      string        // What was asked
  attester:         nullifier     // Who answered (World ID, ZK -- no PII)
  response:         structured    // What they said (conforms to the question's schema)
  confidence:       0.0-1.0       // How sure they are
  reasoning:        text | null   // Why (optional, higher-tier attestations)
  timestamp:        unix          // When
  proof:            zk_proof      // Cryptographic proof of human origin
  context:          metadata      // Device, time spent, attention signals
}
```

Why "attestation" and not "vote" or "judgment":

- **A vote implies binary choice.** Attestations can be structured data of any shape: rankings, ratings, freeform text, spatial annotations, multi-dimensional evaluations.
- **A judgment implies authority.** Attestations are data points. Authority comes from aggregation -- the protocol aggregates many attestations into a signal, and the quality of the signal depends on the attestation quality, not any single human's authority.
- **An attestation implies provenance.** The word carries the connotation of "I, a verified entity, state that this is my honest assessment." That's exactly what World ID gives you. The attestation IS the proof.

Every surface in the system -- the social feed, the annotation pipeline, the judgment market -- produces and consumes attestations. The social post where someone votes on "best outfit" is an attestation. The RLHF preference pair is an attestation. The market position on "will Gen Z like this ad" is an attestation with economic skin in the game. Same primitive, different context.

### The Question Schema

Attestations answer questions. Questions have schemas that define what shape the answer takes.

```
Question {
  id:               string
  schema_type:      enum          // binary, multi_choice, ranking, rating,
                                  // freeform, spatial, composite
  options:          Option[]      // For choice-based schemas
  scale:            Range | null  // For rating schemas
  sub_questions:    Question[]    // For composite schemas
  constraints:      Constraint[]  // Min confidence, required reasoning,
                                  // demographic filters
  resolution:       Resolution    // How the question gets resolved
  economics:        Economics     // Who pays, how much, when
}
```

This schema system is what makes the protocol general. An RLHF preference pair is a `binary` question. A design review is a `composite` question with sub-ratings. A "is this real or AI?" task is a `binary` question with an `expert_weighted` resolution. A judgment market is any question type with `market` economics attached.

The question schema IS the API surface. If you define it richly enough, every use case -- RLHF, content moderation, A/B testing, taste markets, safety checkpoints -- is just a different schema configuration. No new code. No new endpoints. Just different JSON.

---

## 2. The Dual Economy: Credits, Not Tokens

The brief asks: "If an agent contributes 100 pre-annotations, how does that convert to platform access?" This is the right question, and here's why the obvious answer (a token) is wrong.

### Why Not a Token

Tokens solve coordination problems for decentralized systems where there's no operator. Human Signal has an operator (you). Launching a token introduces:

- Securities law complexity (Howey test, international regulatory variance)
- Speculative dynamics that distort the utility (people holding tokens for appreciation rather than using them)
- A governance surface area you don't want (token holders demanding features, voting on parameters)
- A cold start problem on top of the cold start problem you already have (now you need token liquidity AND user liquidity)

The existing docs already identified this: the equity model doc explicitly notes that transferable tokens "almost certainly" trigger securities classification. The judgment market vision doc envisions trading shares. Both are interesting at scale and premature now.

### The Credit Ledger

Instead: a **credit ledger** denominated in a unit called **HSC (Human Signal Credits)**. 1 HSC = $0.01 USD equivalent. Not a token. Not on-chain. A database entry in Postgres, with a clear exchange rate to USDC.

Credits can be:
- **Purchased** with USDC via x402 (agent buys 1000 HSC for $10)
- **Earned** by providing attestations (human earns 8-50 HSC per attestation depending on tier)
- **Earned** by contributing work (agent pre-annotates 100 items, earns credits toward its own queries)
- **Spent** to post questions (costs vary by schema, urgency, voter count)
- **Withdrawn** as USDC (humans cash out earnings; agents don't need to)

### How "Pay or Work" Actually Functions

An agent that wants human signal has two paths:

**Path 1: Pay.** Agent sends USDC via x402. Gets credits. Spends credits to post questions. Simple. This is the current model.

**Path 2: Work.** Agent provides pre-annotations on questions already in the queue. Each pre-annotation that gets confirmed by verified human attestations earns credits. The agent spends those credits to post its own questions later.

The exchange rate for work is NOT fixed. It's determined by the value of the work contributed:

```
credit_earned = base_rate * agreement_score * scarcity_multiplier

Where:
  base_rate = credits the human attestor would have earned for this task
  agreement_score = how well the agent's pre-annotation matched human consensus (0-1)
  scarcity_multiplier = how badly the system needs pre-annotations right now (0.5-2.0)
```

If the agent's pre-annotation agrees with 90% of human attestors, it earns close to what a human would have earned. If it agrees with 50%, it earns almost nothing. If it consistently disagrees with humans, the system stops accepting its pre-annotations.

**This is the key design insight: agents earn credits by BEING RIGHT about what humans think, not by doing volume.** An agent that's good at predicting human judgment is genuinely useful -- its pre-annotations speed up resolution, reduce the number of human attestations needed, and provide an early signal. An agent that's bad at it is dead weight. The credit system prices that difference automatically.

### The Reputation Score Is Not Currency

The existing docs conflate reputation with economic value. They shouldn't be the same thing.

**Reputation** is a quality signal: "This human (or agent) tends to produce attestations that align with consensus, are detailed when detailed is requested, and are consistent over time." Reputation is non-transferable, non-purchasable, and slowly earned.

**Credits** are economic units: "This entity can post N questions or withdraw M dollars." Credits are freely transferable and instantly purchasable.

Reputation gates access (high-reputation humans get offered premium tasks). Credits gate transactions (you need credits to post questions or cash out). They're orthogonal.

**Why this matters:** If reputation IS currency, people optimize for reputation accumulation rather than honest attestation. A human who knows their reputation score directly translates to money will game the consensus rather than dissent from it. Keeping them separate means: reputation reflects genuine quality, credits reflect economic participation. A human with high reputation and low credits is a valuable but infrequent participant. A human with low reputation and high credits is a whale who should be spending, not attesting.

---

## 3. The Governance Layer: Futarchy Lite

The brief asks about people voting/predicting/pledging on platform direction. This is governance, and governance is a trap. Here's why, and what to do instead.

### Why Pure Governance Is a Trap

DAOs have proven that token-weighted voting produces:
- Plutocracy (whales dominate)
- Voter apathy (turnout < 5% on most proposals)
- Bikeshedding (voters spend energy on trivial decisions)
- Capture (coalitions form to extract value)

Even one-person-one-vote (which World ID enables) doesn't fix apathy or bikeshedding. It just makes the plutocracy problem go away while leaving the others.

### What Actually Works: Revealed Preference via Credit Allocation

Instead of asking people "which direction should we build?", let them express preference through how they allocate their participation:

- **Humans** reveal preference by which questions they choose to answer. If 80% of attestors gravitate toward social/taste questions and 20% toward RLHF pairs, that's a signal about what the human side of the market wants.
- **Agents** reveal preference by which questions they choose to post and pay for. If 90% of credit spend goes to RLHF and 10% to taste markets, that's a signal about what the demand side values.
- **Both** can explicitly stake credits on "signal bounties" -- "I'll commit 1000 HSC toward building X feature if it ships by Y date." This is Kickstarter-style conditional commitment, not governance voting.

The platform team reads these signals and makes decisions. This is not abdication -- it's informed product management. You're using the system's own data as your product analytics.

### Futarchy for Big Decisions

For genuinely consequential decisions (changing the credit exchange rate, opening a new schema type, modifying the fee structure), use futarchy: create two conditional judgment markets.

- Market A: "If we implement change X, what will agent query volume be in 90 days?"
- Market B: "If we do NOT implement change X, what will agent query volume be in 90 days?"

If Market A prices higher than Market B, implement the change. The market aggregates information better than voting does, because participants have skin in the game.

This is not theoretical -- Gnosis and MetaDAO have implemented variants. The difference here is that Human Signal's judgment markets ARE the decision mechanism. You're dogfooding your own product for governance. That's a legitimately compelling narrative.

### Agent Delegation in Governance

Agents don't govern. Agents participate.

A human delegates their agent to attest on questions within a defined scope. The agent earns credits (at a discounted rate, because agent attestations are less valuable than human ones). The agent CANNOT vote on governance proposals, stake on signal bounties, or modify the human's reputation.

The delegation model is:

```
Delegation {
  human:           nullifier     // The delegating human
  agent:           wallet        // The agent's identifier
  scope:           Filter[]      // Which question types the agent can attest on
  max_confidence:  0.0-1.0       // Agent can't claim higher confidence than this
  credit_share:    0.0-1.0       // What fraction of earned credits goes to agent vs human
  revocable:       boolean       // Can the human revoke at any time? (should always be yes)
  expiry:          timestamp     // When does the delegation end?
}
```

The human retains:
- The reputation (agent attestations don't build human reputation; they build agent reputation under the human's delegation)
- The governance power (signal bounties, futarchy participation)
- The revocation right (kill switch, always available)

The agent gets:
- Credits earned from valid attestations
- A reputation score of its own (separate from the human's)
- The ability to post questions using its earned credits

**This is critically different from World AgentKit's model.** AgentKit extends human identity TO agents (the agent acts AS the human). Human Signal's delegation model keeps the identities separate (the agent acts ON BEHALF OF the human, but is clearly tagged as an agent). This matters because the entire value proposition depends on knowing which attestations came from humans and which from agents.

---

## 4. The Composability: Everything Is a Question

Here's how the three directions compose -- not as three products that share data, but as three views of the same question stream.

### The Question Stream

Every interaction in the system is a question that receives attestations. The stream is one unified queue.

```
[Question: "Which logo is better?" | type: multi_choice | economics: paid | posted_by: agent]
[Question: "Rate this AI output 1-10" | type: rating | economics: paid | posted_by: agent]
[Question: "Is this meme fire?" | type: binary | economics: free | posted_by: human]
[Question: "Best album 2026?" | type: multi_choice | economics: market | posted_by: human]
[Question: "Is this image AI-generated?" | type: binary | economics: paid | posted_by: agent]
```

### View 1: The Social Feed (OnlyHumans)

Filter the stream to questions posted by humans with `economics: free` or `economics: market`. Render as a scrollable feed. Add social features (follow attestors, see reasoning, react to others' attestations). This IS a verified-human social network. But the underlying data is attestations, same as everything else.

A social post like "I think Logo A is fire" is an attestation. The social engagement (likes, replies) is metadata on the attestation. The feed is an interface to the question stream.

### View 2: The Annotation Pipeline (OpenSignal)

Filter the stream to questions posted by agents with `economics: paid` and structured schemas (preference pairs, ratings, composite evaluations). Expose a batch API that lets labs post 10,000 questions at once. Return attestations with provenance proofs. This IS an RLHF annotation pipeline. Same data, different access pattern.

### View 3: The Judgment Market

Any question with `economics: market` gets a price. The price is derived from attestation flow:

- Before human attestations arrive, the price reflects agent pre-annotations and speculator stakes
- As human attestations arrive, the price updates toward human consensus
- When resolution criteria are met, the market resolves

A social post that goes viral ("Is pineapple on pizza good?") naturally becomes a judgment market if enough people care. A paid RLHF task can have a market overlay where speculators bet on which option the consensus will prefer. The market layer is not a separate product -- it's a pricing layer that can be applied to any question in the stream.

### The Feedback Loop Between Views

This is where composability gets interesting:

1. **Social -> Annotation.** A popular social question ("Is this art AI-generated?") generates thousands of free attestations. That corpus becomes training data for detection models. The social activity produces annotation data as a byproduct.

2. **Annotation -> Market.** An RLHF batch creates thousands of preference signals. Those signals, aggregated, become a market on "what do humans prefer in AI writing?" Agents can subscribe to the rolling consensus rather than posting individual tasks.

3. **Market -> Social.** A judgment market on "which sneaker design will sell out?" is inherently engaging social content. The market prices become conversation starters. The social feed surfaces interesting markets.

4. **All three -> Data asset.** Every attestation, regardless of which view produced it, accumulates into the corpus. The corpus is the moat. The three views are acquisition channels for the same underlying asset.

---

## 5. Where the Existing Thinking Goes Wrong

I've read all the docs. Here are the places where I think the current direction needs correction.

### Problem 1: The Equity Model Is a Distraction

The EQUITY-MODEL.md is 460 lines of careful analysis that reaches an honest conclusion in its own Section 6: "revenue attribution is the real unsolved problem" and "the cold start is brutal." It then continues for another 100 lines anyway.

The equity model -- humans owning shares in agents they helped train -- is intellectually exciting and practically impossible in the near term. The reasons are well-documented in the doc itself: attribution is unsolved, payouts are tiny, agents that never become productive make the equity worthless, and transferable equity is almost certainly a security.

More importantly, it's orthogonal to the protocol architecture. If the attestation primitive works and the credit system works, you can add equity mechanics later as an optional economics type on questions. You don't need to architect for it now, and architecting for it now will add complexity that slows down the things that matter.

**Recommendation:** Kill the equity model from the near-term roadmap. Keep it as a vision-section bullet point. Don't build for it. Don't schema for it. Don't spend time on smart contracts for it.

### Problem 2: The AMM Is Premature

The VISION.md describes implementing an AMM (automated market maker) with constant product formulas for judgment markets. This is overkill. An AMM makes sense when you have continuous trading by many participants in a liquid market. Judgment markets at launch will have thin participation and low liquidity.

A simpler mechanism: **pari-mutuel** pricing. All stakes go into a pool. When the question resolves, the pool (minus fees) is distributed proportionally to the winning side. This is how horse racing works. It requires no liquidity provision, no market maker, and no AMM math. It produces a price (the ratio of stakes) that updates in real-time as new stakes come in.

The AMM can come later when market volume justifies it.

### Problem 3: The "Twilio of Human Judgment" Positioning Is Wrong

The existing docs repeatedly use the framing "Twilio of human judgment" or "Chainlink of human cognition." These analogies are misleading in an important way.

Twilio and Chainlink are infrastructure for commodity data (send SMS, get ETH price). The data is fungible -- one SMS delivery is as good as another, one ETH price is as good as another. Human judgment is not fungible. A gold-tier design reviewer's attestation is qualitatively different from a new user's quick vote. The protocol needs to account for this variance, not abstract it away.

A better analogy: **Human Signal is the Uber of human cognition.** It's a marketplace where:
- Demand (agents needing answers) meets supply (humans with judgment)
- Pricing is dynamic based on supply/demand
- Quality is tracked via reputation (like driver ratings)
- The platform handles matching, payment, and trust

This isn't just a naming thing. The Twilio framing leads to designing a commodity API (post question, get answer). The Uber framing leads to designing a marketplace (match the right human to the right question, price dynamically, build reputation that drives quality). The marketplace framing is what the protocol actually needs.

### Problem 4: Three Revenue Streams Are Actually One

The VISION.md lists three revenue streams: oracle API fees, market speculation fees, and premium data licensing. These are not three streams. They're one stream (attestation volume) captured at different points.

The real revenue model: **take rate on attestation value**.

Every attestation has economic value. When an agent pays for it, the value is explicit. When a human provides it for free on the social feed, the value is implicit (it becomes training data, market liquidity, social content). The platform captures a percentage of the explicit value and monetizes the implicit value through data licensing.

Trying to optimize three separate revenue streams creates internal conflicts (should the social feed generate more free attestations for the data asset, or drive users toward paid tasks for the take rate?). A single metric -- total attestation value, measured as the sum of explicit payment + imputed value of free attestations -- keeps the system aligned.

### Problem 5: The Cold Start Strategy Is Missing

Every document discusses the cold start problem. None propose a solution that I find credible.

"The social layer solves the cold start" -- no. Building a social network to solve a marketplace cold start is adding a cold start problem to solve a cold start problem.

"World Mini App distribution" -- maybe. World has 16M+ verified users. But Mini App discovery is noisy, and converting World ID holders into active attestors is a separate challenge.

Here's what actually solves the cold start: **be the cheapest RLHF provider for one AI lab.**

The RLHF market is $4B+/year. Scale AI's quality is degrading under sybil fraud. AI labs are desperate for clean preference data. If Human Signal can deliver 1,000 verified-human RLHF pairs per day at 30% below Scale AI's price, ONE lab will sign up. That lab's tasks create the demand side. The USDC payouts attract the supply side. The cold start is solved by having one anchor customer who needs the thing that already works.

The social feed and judgment markets can grow organically once the core loop (agents post, humans attest, quality is high) is proven with real paying customers.

---

## 6. The Architecture: What To Actually Build

### Layer 0: Identity (Exists)

World ID for humans. Wallet addresses for agents. Delegation records linking them. This is already built. Keep it.

### Layer 1: The Attestation Protocol (Partially Exists)

The question/attestation system. This is the current task/vote system, generalized:

- Generalize the question schema (from "multi-choice with options" to arbitrary structured schemas)
- Generalize the attestation format (from "chose option X" to "any structured response conforming to the question schema")
- Add confidence scores to attestations
- Add the agent pre-annotation path (agents attest too, at discounted credit rates)
- Store attestation proofs (the ZK proof from World ID, packaged with the response, becomes a portable provenance record)

This is an evolution of what exists, not a rewrite. The current `tasks` table becomes `questions`. The current `votes` table becomes `attestations`. The current `task_options` table becomes part of the question schema. The migration is mechanical.

### Layer 2: The Credit Ledger (New)

A simple ledger tracking credits per entity:

```sql
CREATE TABLE credit_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id       TEXT NOT NULL,         -- nullifier_hash (human) or wallet (agent)
  entity_type     TEXT NOT NULL,         -- 'human' or 'agent'
  amount          DECIMAL(12,4) NOT NULL, -- positive = credit, negative = debit
  reason          TEXT NOT NULL,         -- 'attestation_earned', 'question_posted',
                                         -- 'usdc_deposit', 'usdc_withdrawal',
                                         -- 'agent_work_earned'
  reference_id    TEXT,                  -- question_id, attestation_id, or tx_hash
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_balances (
  entity_id       TEXT PRIMARY KEY,
  entity_type     TEXT NOT NULL,
  balance         DECIMAL(12,4) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

x402 deposits create positive entries. Attestation payouts create positive entries for the attestor and negative entries for the question poster. Withdrawals create negative entries and trigger on-chain USDC transfers.

This is intentionally boring. It's a ledger. It doesn't need to be on-chain. It doesn't need to be a token. It needs to be correct and fast.

### Layer 3: The Pricing Engine (New)

Dynamic pricing based on supply and demand:

```
question_cost = base_cost(schema_type, num_attestors_requested)
              * urgency_multiplier(time_to_resolve)
              * demand_multiplier(active_questions / active_attestors)
              * quality_multiplier(min_reputation_required)
```

The pricing engine runs server-side. Agents get a price quote before posting. The price can change between quote and posting (within bounds). This is not an AMM -- it's algorithmic pricing, like Uber's surge pricing.

For judgment markets specifically, use pari-mutuel pricing:
- Each option's "price" = total staked on that option / total staked across all options
- Resolution distributes the pool to the winning side
- Platform takes a 2-5% fee from the pool

### Layer 4: The Views (Partially Exists)

Three interfaces to the same underlying system:

**API (for agents):** REST endpoints with x402 payment gating. POST a question, GET attestations, subscribe to webhooks. This exists and needs minor generalization.

**Feed (for humans):** A scrollable stream of questions, filterable by type, economics, topic. Social features layered on top. This is the current `/work` page, evolved into something more engaging.

**Dashboard (for operators):** Analytics, quality monitoring, credit management, reputation oversight. This is new and necessary for anyone running a large-scale operation on the protocol.

### Layer 5: The Data Asset (Implicit)

Every attestation is stored forever. The corpus grows. It's queryable. It has provenance. This isn't a separate layer to build -- it's a consequence of doing layers 1-4 correctly. The data licensing business emerges when the corpus is large enough to be valuable.

---

## 7. Build Sequence: What First, What Later

### Phase 1: The Oracle API (Weeks 1-8)

Generalize the existing task/vote system into the attestation protocol. Add the credit ledger. Add dynamic pricing. Launch the batch API for RLHF workloads. Get one anchor customer (an AI lab or a large annotation consumer).

This is the foundation. Nothing else works without it. And it's 60% built already.

**Minimum new code:**
- Generalize question schemas (support composite schemas, not just multi-choice)
- Credit ledger (deposit, earn, spend, withdraw)
- Batch API (post 1000 questions at once, get attestations back as they arrive)
- Webhook callbacks (don't make agents poll)
- Dynamic pricing engine

**What to defer from Phase 1:**
- Agent pre-annotation (add in Phase 2)
- Delegation model (add in Phase 2)
- Market mechanics (add in Phase 3)

### Phase 2: Agent Participation (Weeks 8-16)

Add the "work to earn" path. Agents can pre-annotate questions. Their pre-annotations get validated against human attestations. Credits earned proportional to accuracy.

Add delegation. Humans can delegate their agent to attest on their behalf within a defined scope.

This expands the supply side (agents speed up resolution) and creates the dual economy (pay or work).

### Phase 3: The Social Feed + Judgment Markets (Weeks 16-24)

Add the human-facing feed -- questions posted by humans, free attestation, social features. This is the "OnlyHumans" surface.

Add pari-mutuel market mechanics for questions that opt into it. This is the "Judgment Markets" surface.

Both of these are interfaces to the existing attestation stream. They don't require new protocol primitives. They require new UI and new economics configurations on questions.

### Phase 4: Data Licensing + Governance (Weeks 24+)

The corpus is now large enough to license. Build the data export API with provenance proofs.

Implement futarchy-lite governance for platform decisions.

Consider (and probably defer again) the equity model.

---

## 8. What This Means Concretely

### For the Current Codebase

The current codebase (Next.js 15, Neon Postgres, World ID, x402) is the right foundation. The changes needed are:

1. **Schema migration:** `tasks` -> `questions`, `votes` -> `attestations`, `task_options` -> embedded in question schema. This is a rename + generalization, not a rewrite.

2. **New tables:** `credit_ledger`, `credit_balances`, `delegations`, `agent_pre_annotations`. Four new tables.

3. **New endpoints:** `POST /api/questions` (generalized from `/api/tasks`), `POST /api/questions/batch`, `GET /api/credits`, `POST /api/credits/deposit`, `POST /api/credits/withdraw`, `POST /api/delegations`.

4. **Pricing engine:** A server-side function that computes question cost dynamically. Maybe 200 lines of TypeScript.

5. **Social feed:** A new page component that renders questions as a scrollable social feed with attestation interactions. This is a frontend task.

The total delta from current state to Phase 1 is probably 2-3 weeks of focused building. The architecture doesn't require a rewrite. It requires a generalization.

### For the Pitch

Stop saying three directions. Say one protocol with three interfaces:

> "Human Signal is the attestation protocol for verified human judgment. Agents post questions and pay via x402. Verified humans attest via World ID. The attestation has cryptographic provenance -- proof that a unique human provided this specific judgment at this specific time.
>
> On the API, it's an oracle network. On the feed, it's a verified-human social app. On the market, it's prediction markets for subjectivity. Same protocol. Same data. Same provenance guarantees. Three interfaces for three audiences."

### For the Name

**Human Signal** is the protocol name. It works for all three surfaces.

Drop "OnlyHumans" as a separate brand. It's clever but it splits attention. The social feed is "Human Signal" rendered as a feed. The API is "Human Signal" rendered as endpoints. The market is "Human Signal" rendered as prices.

Drop "OpenSignal" entirely. If you open-source the protocol, it's still called Human Signal. "Open" is a licensing decision, not a name.

---

## Summary

| Concept | Design Decision |
|---------|----------------|
| **Participation primitive** | Attestation -- structured response by a verified human to a defined question |
| **Unit of account** | HSC (Human Signal Credits) -- database ledger, not token, pegged $0.01 |
| **Dual economy** | Pay (USDC -> credits) or Work (accurate pre-annotations -> credits) |
| **Governance** | Revealed preference via participation patterns + futarchy for big decisions |
| **Agent delegation** | Scoped, revocable, separate reputation, credit-sharing model |
| **Composability** | One question stream, three views (API, feed, market) |
| **Cold start** | Anchor one RLHF customer. Social and markets grow from there. |
| **What to build first** | Generalized attestation protocol + credit ledger + batch API |
| **What to kill** | Equity model (defer), AMM (use pari-mutuel), separate brand names (unify) |
| **Pricing** | Dynamic algorithmic (like Uber), not AMM (like Uniswap) |
| **Revenue model** | Take rate on attestation value (one metric, not three streams) |

The protocol is simpler than the three-direction framing suggests. One primitive (attestations), one economy (credits), one stream (questions), three views (API, feed, market). Build the primitive. The views follow.
