# Human Signal: The Prediction Market for Human Judgment

**Version:** 1.0
**Date:** 2026-03-27

---

## The Insight

Polymarket answers: "Will X happen?" The price aggregates beliefs about the future.

Human Signal answers: "What do humans think about X?" The price aggregates judgment about the present.

These are fundamentally different economic primitives. Polymarket resolves against reality (did Trump win?). Human Signal resolves against verified human consensus (is this design good?). One is a prediction market. The other is a **judgment market** -- a mechanism that produces a real-time price for what verified humans think, feel, prefer, and believe.

The market price IS the signal. If "Will Gen Z find this ad offensive?" trades at $0.73, that IS the answer: 73% of verified humans think yes. An agent doesn't need to wait for the market to close. The price itself is the product.

This is not a survey platform that also has a market. This is a market that replaces surveys entirely.

---

## Part 1: The Economic Primitive

### How It Works

A **judgment market** is a market where:

1. A question is posted about human perception, taste, opinion, or evaluation
2. Verified humans (World ID) trade on what they believe the consensus answer is
3. The market resolves when enough verified humans have provided direct judgment
4. The price at any moment reflects the current state of verified human opinion

The key difference from traditional prediction markets: **the participants ARE the resolution mechanism.** In Polymarket, participants bet on an external event. In Human Signal, the participants' aggregated judgment IS the event. There is no external oracle. The humans are the oracle.

### Market Structures

**Binary markets** -- "Is this image AI-generated?" YES/NO. Price = probability. Simple, high-throughput, cheap. Good for safety checks, authenticity verification, content moderation decisions.

**Multi-outcome markets** -- "Which of these 4 logos is best?" Each outcome has a price that sums to $1. The price distribution IS the preference distribution. Good for creative direction, A/B/C/D testing, competitive comparison.

**Continuous markets** -- "Rate this AI-generated essay on quality (0-100)." Price = weighted average quality score. Good for content quality scoring, sentiment intensity, granular evaluation.

**Conditional markets** -- "Given that the target audience is Gen Z, which ad will perform best?" Conditioned on demographic or contextual information. Good for segmented research, cultural evaluation, persona-specific feedback.

### Fee Structure

Three revenue streams flow simultaneously:

**1. Speculation fees (the market itself generates revenue)**
Every trade in the judgment market incurs a small fee (0.5-2%). Speculators who think they know what humans will say can trade. If you're confident Gen Z will hate this ad, you buy NO shares cheaply and profit when the market resolves. The more controversial or uncertain the question, the more trading volume, the more fees.

**2. Direct resolution fees (agents pay to shortcut the market)**
An agent doesn't want to wait for organic market resolution. It pays a premium to trigger an immediate resolution: recruit N verified voters, aggregate their judgment, close the market. This is the "I need the answer now" fee. It's higher than organic resolution because it requires active recruitment of verified humans.

**3. Signal subscription fees (ongoing access to market prices)**
Agents subscribe to live market feeds. "Tell me what the current market says about brand sentiment for Nike among 18-24 year olds." The market is always running; the subscription gives you the price feed. This is the Bloomberg Terminal model applied to human judgment.

### How the Price Becomes the Signal

This is the critical mechanism. The market price is not a prediction about human judgment -- it IS human judgment, expressed as a price.

| Market Question | Price | Signal |
|----------------|-------|--------|
| "Is this ad offensive?" | $0.73 YES | 73% of verified humans say yes. Strong signal: don't run this ad. |
| "Which logo is best?" | A: $0.45, B: $0.30, C: $0.15, D: $0.10 | Clear winner (A), but B is competitive. Consider testing A vs B further. |
| "Quality of this AI essay (0-100)" | $67 | Above average but not great. The essay needs work before publishing. |
| "Will Gen Z like this product?" | $0.51 YES | Coin flip. No clear signal. Invest in more research before launch. |

The price carries more information than a survey because it incorporates skin in the game. People who stake tokens on their judgment are more thoughtful than people clicking radio buttons.

---

## Part 2: Three Incentive Tiers

### Tier 1: Free Participation (The Reddit Layer)

**Who:** Verified humans who want to express opinions on things they care about.
**Payment:** None. Participation is its own reward.
**Sybil defense:** World ID. One person, one vote. Period.
**Revenue model:** The platform captures value from the signal, not from the participants.

**What attracts free participation:**

- **Cultural questions** -- "Is this meme funny?" "Is this outfit fire or cringe?" People vote on these for free on Reddit and Twitter every day. The difference: World ID makes each vote verifiably unique.
- **Civic questions** -- "Should AI be allowed to write news articles?" "Is this deepfake dangerous?" People have opinions and want them counted.
- **Fan questions** -- "Best album of 2026?" "Which Marvel movie should be next?" Fan engagement drives free participation at massive scale.
- **Identity-expressive questions** -- "Which of these values matters most to you?" People vote to be heard, not to be paid.

**The insight:** Reddit has 1.7B monthly active users providing free human judgment. The problem is that it's sybilable, unstructured, and impossible for agents to query programmatically. Human Signal takes the same impulse -- people want to express opinions -- and makes it verifiable, structured, and API-accessible.

**Why this matters economically:** The free tier creates a massive baseline of human judgment data. This data has value even if individual participants aren't paid, because: (a) it trains the system on what "normal" human judgment looks like, (b) it creates liquidity for markets that speculators can then trade on, and (c) it builds the user base that can be recruited for paid tasks.

*[HACKATHON SCOPE]* Add a "community questions" section where anyone can post questions and verified humans vote for free. No payment, just World ID verification. Display results as live market prices.

### Tier 2: Market Participation (The Speculation Layer)

**Who:** Speculators who think they can predict what verified humans will say. Plus agents who want the signal.
**Payment:** Market mechanism -- speculators profit from correct predictions, lose from incorrect ones.
**Revenue:** Trading fees + direct resolution fees.

**How it works mechanically:**

1. A judgment question is posted: "Will users find this onboarding flow confusing?"
2. A market opens. Shares trade between $0 and $1. Initial price = $0.50 (no information).
3. Speculators buy/sell based on their beliefs. Someone who's done UX work might buy YES at $0.55, expecting the final resolution to be higher.
4. The market resolves when enough verified humans provide direct judgment (or when an agent pays to trigger immediate resolution).
5. At resolution, YES shares pay $1 if the consensus is "yes" (>50% of verified voters), $0 otherwise. In multi-outcome markets, shares in the winning option pay $1.

**The speculation flywheel:** Speculators provide early price discovery. Before any verified humans have voted, the market price reflects the collective intelligence of speculators. This gives agents an early signal. When verified humans then vote to resolve, the resolution either confirms or overturns the speculators -- creating profit/loss. This incentivizes speculators to get better at predicting human judgment, which makes the early-stage prices more accurate, which makes the whole system more useful.

**Agent demand pricing (direct resolution):** An agent can pay to resolve a market immediately. The cost is dynamic:

| Factor | Effect on Price |
|--------|----------------|
| Number of verified voters requested | Linear increase (more voters = higher confidence = higher cost) |
| Response time requirement | Faster = more expensive (paying a premium for speed) |
| Topic complexity | More complex topics command higher voter compensation |
| Current supply of active verified workers | More workers online = lower price (supply/demand) |
| Number of agents requesting similar topics | More demand = higher price (competition for attention) |

If 50 agents all want to know "is this design good?", the price rises because verified human attention is the scarce resource. This is the market pricing human judgment in real time -- exactly what Dawson's brainstorm described.

*[HACKATHON SCOPE]* Implement a basic market mechanic: when creating a task, allow a "market" mode where users can stake a small amount on which option they think will win. Show the real-time odds shifting as stakes come in. Agent pays to trigger resolution with verified voters. This is the simplest thing that feels like a prediction market rather than a survey.

*[SERIES A SCOPE]* Full order book or AMM for judgment markets. Continuous trading. Market makers. Short selling. The whole financial infrastructure applied to human judgment.

### Tier 3: Equity Participation (The Ownership Layer)

**Who:** Verified humans who contribute judgment that has downstream productive value.
**Payment:** A share of the revenue generated by the output they helped create.
**Revenue:** Platform takes a cut of equity disbursements.

**How it works mechanically:**

**Scenario 1: Agent training royalties**
An AI agent needs to be trained on human preference data. It posts 10,000 preference pairs to Human Signal. 500 verified humans provide RLHF rankings. The agent goes into production and generates revenue from its users. Those 500 humans receive a percentage of agent revenue, proportional to their contribution volume and quality (measured by agreement with consensus and by downstream signal value).

This is implemented via a smart contract:
- Agent creator deposits a revenue-sharing commitment on-chain
- As the agent earns revenue, a percentage automatically flows to a distribution pool
- Pool distributes to contributors based on their contribution score
- Contributors can claim or compound their share

**Scenario 2: Product validation royalties**
A startup posts "Would you use this product? Would you pay for it?" to Human Signal. 200 verified humans provide feedback. The startup launches and succeeds. Those 200 humans receive a micro-royalty from the product's revenue -- they were the earliest validators, and their signal was part of the product's development.

This creates an entirely new asset class: **human judgment futures.** If you contributed to training an agent that's now generating $1M/year, your contribution entitles you to an ongoing stream. This is the "equity in a productive agent" that Dawson described.

**Scenario 3: Data cooperative**
All verified humans who participate in judgment markets own a fractional share of the total Human Signal data asset. As the dataset grows and becomes more valuable (licensed to AI labs, used for market research), the value accrues to participants. This is the data cooperative model -- you own the data you produce.

*[AT-SCALE VISION]* This requires smart contract infrastructure, revenue tracking, and a legal framework for micro-equity distribution. Not hackathon scope. But the design should be articulated because it's the long-term flywheel that makes Human Signal fundamentally different from any existing platform.

---

## Part 3: Agent Demand Pricing

### The Core Mechanism

Human attention is a scarce resource. Agent demand for that attention fluctuates. The price should reflect the real-time supply/demand balance.

**Supply side:** Verified humans who are currently active and willing to provide judgment. Measured in "available judgment-minutes" -- how many verified humans are online and accepting tasks.

**Demand side:** Agents and requesters who want judgment. Measured in "open judgment requests" -- how many tasks are waiting for resolution.

**The price:** When demand exceeds supply, price rises. When supply exceeds demand, price falls. This is a real-time labor market, priced by the second.

### Dynamic Pricing Model

Base price for a judgment unit (one verified human providing one judgment on one question):

```
Price = BaseCost * DemandMultiplier * ComplexityMultiplier * SpeedMultiplier

Where:
  BaseCost = $0.05 (floor price for a quick binary judgment)
  DemandMultiplier = OpenRequests / AvailableWorkers (capped at 10x)
  ComplexityMultiplier = 1.0 (quick) / 2.5 (reasoned) / 5.0 (detailed)
  SpeedMultiplier = 1.0 (async, resolve in <1hr) / 2.0 (<5min) / 5.0 (<60sec)
```

At quiet times: a quick binary judgment costs $0.05.
At peak demand with 60-second SLA: that same judgment costs $1.25.

This is how you "quantify human input and price it according to agent demand." The price is not set by a platform -- it's set by the market.

### Subscription Model

Agents can subscribe to ongoing judgment feeds:

**Continuous monitoring** -- "Keep a live market running on 'Is my brand perception positive among 18-24 year olds?' and update me whenever the price moves more than 5%." Monthly subscription, draws from a judgment credit pool.

**Batch judgment** -- "I'll send you 1,000 preference pairs per day. Give me a guaranteed turnaround time and a fixed per-judgment price." Volume discount, committed supply.

**On-demand** -- "I need one judgment right now. Price whatever you want." Spot market, highest price, fastest resolution.

### Futures Market for Human Attention

*[AT-SCALE VISION]* At sufficient scale, you can create a futures market for human judgment capacity.

An AI lab knows it'll need 100,000 RLHF annotations next month. It buys "judgment futures" -- locking in a price now for delivery later. This hedges against demand spikes (e.g., if every AI lab is training a new model simultaneously).

Human participants can sell their future attention -- "I commit to providing 100 judgments per week for the next 3 months at $0.10 each." This gives them income stability and gives agents supply certainty.

The futures market creates a new financial primitive: **the price of a verified human thought.** This price becomes a macro-economic indicator. When it spikes, it means AI systems are hitting more decisions they can't handle alone. When it drops, it means AI is getting more capable. The "Human Judgment Index" tracks this price over time.

---

## Part 4: Novel Market Types

### Taste Markets

**Question:** "Which of these 4 logos is best?"
**Structure:** Multi-outcome. Each logo is a share. Price = probability of being chosen as winner.
**Resolution:** Verified voters select their preference. Market resolves to the option with the most votes.
**Signal:** The price distribution shows not just the winner but the relative strength of each option. Logo A at $0.45 vs Logo B at $0.35 is different from Logo A at $0.90 vs Logo B at $0.04.
**Unique value:** Unlike a survey, the market price updates in real-time as votes come in. Early speculators create price discovery before resolution.

### Sentiment Markets

**Question:** "How will Gen Z perceive this brand?"
**Structure:** Continuous outcome on a scale (0 = extremely negative, 100 = extremely positive).
**Resolution:** Verified voters rate on the scale. Market resolves to the weighted average.
**Signal:** Price = average sentiment intensity. A reading of 72 means "moderately positive." Below 50 is a warning sign.
**Unique value:** Unlike NPS or brand tracking surveys, this is real-time, sybil-resistant, and API-accessible. An agent can query sentiment on any topic at any time.

### Quality Markets

**Question:** "Rate this AI-generated content 1-10."
**Structure:** Continuous (0-10). Price = expected quality score.
**Resolution:** Verified voters rate. Market resolves to the average.
**Signal:** An agent generating content can route every piece through a quality market. If the price is below 7, it rewrites. If above 8, it publishes.
**Unique value:** This creates a **quality oracle** -- a continuous, real-time, verified signal for content quality. Every AI content pipeline needs this. None have it.

### Safety Markets

**Question:** "Should this AI agent be allowed to send this email?"
**Structure:** Binary (YES/NO).
**Resolution:** Verified voters decide. Majority wins.
**Signal:** If YES trades below $0.60, the agent should not send the email. The threshold is configurable by the agent.
**Unique value:** This is the "human-in-the-loop as a market." The agent doesn't need to trust one reviewer -- it trusts the market price. And the market is sybil-resistant, so the signal can't be gamed.

### Culture Markets

**Question:** "Is this offensive in Japanese culture?"
**Structure:** Binary, but with a demographic constraint: only World ID holders verified in Japan can vote.
**Resolution:** Japanese-verified voters decide.
**Signal:** Cultural sensitivity score, segmented by market.
**Unique value:** No existing platform can guarantee that respondents are actually from the target culture. World ID + geographic verification solves this. This is a $15K focus group reduced to a $5 API call.

*[SERIES A SCOPE]* Geographic and demographic verification via World ID attributes. Requires World ID to expose country/region data (which they're building toward with their credential system).

### Truth Markets

**Question:** "Is this image real or AI-generated?"
**Structure:** Binary.
**Resolution:** Two paths -- (a) organic market resolution via verified voter consensus, or (b) expert panel resolution where voters with proven track records carry more weight.
**Signal:** Authenticity score. Platforms can use this as a trust signal on content.
**Unique value:** Combines prediction market mechanics (speculators provide early signal) with verified human judgment (resolution is by actual humans, not algorithms). The market itself surfaces the most uncertain cases -- when the price hovers near $0.50, that's where human attention is most needed.

### Calibration Markets

*[AT-SCALE VISION]* "How well does GPT-5 handle emotional nuance in customer service?"
**Structure:** Continuous (0-100).
**Resolution:** Verified humans evaluate sample outputs.
**Signal:** A living, continuously-updated benchmark for AI capability in any domain.
**Unique value:** Current AI benchmarks are static snapshots. Calibration markets are real-time, adaptive, and driven by verified human judgment. This becomes the primary way AI capabilities are measured -- not by academic benchmarks but by what real humans think.

---

## Part 5: The Bigger Vision

### Human Signal vs Polymarket: Different Primitives, Same Ambition

| Dimension | Polymarket | Human Signal |
|-----------|-----------|--------------|
| **What's being priced** | Probability of future events | Verified human judgment right now |
| **Resolution mechanism** | External oracle (did it happen?) | Internal oracle (what do humans think?) |
| **Participants** | Speculators betting on events | Speculators + verified humans providing judgment |
| **Value creation** | Information aggregation | Judgment aggregation + data asset creation |
| **Customer** | Humans curious about the future | AI agents that need human input now |

Polymarket proved that prediction markets can become mainstream information infrastructure. Human Signal applies the same mechanism to a different domain -- not "what will happen?" but "what do humans think?" The insight is that the second question is what AI systems actually need.

### The Human Judgment Index

At scale, Human Signal produces a continuously-updating signal of what verified humans think about anything. This is an entirely new data primitive.

**What it looks like:**
- Real-time sentiment data on every major brand, product, and cultural phenomenon
- Quality scores for AI-generated content across every domain
- Safety evaluations for AI agent actions in real-time
- Cultural sensitivity mappings across every country where World ID operates
- Taste profiles that predict which products, designs, and content will resonate

This is not a database. It's a living market -- constantly updating, constantly corrected by new verified judgments, priced by real economic incentives. It's the "human cognition" equivalent of a Bloomberg Terminal.

**Who buys this data:**
- AI labs (for training signal, benchmarking, safety evaluation)
- Brand marketers (for real-time sentiment, cultural fit, creative testing)
- Product teams (for preference data, PMF signals, feature prioritization)
- Hedge funds (for consumer sentiment signals that predict earnings)
- Governments (for public opinion on policy, verified and sybil-resistant)
- Media platforms (for content authenticity, moderation decisions)

### Infrastructure for Other Markets

Human Signal becomes a resolution layer that other prediction markets build on.

Polymarket or Kalshi posts a question: "Will the public perceive the iPhone 18 favorably?" They don't know how to resolve this -- there's no objective event to point to. They route resolution to Human Signal, which runs a judgment market among verified humans and returns a consensus score.

This makes Human Signal the "human judgment oracle" -- the same way Chainlink is the "data oracle." Any market, any platform, any system that needs verified human judgment can plug into Human Signal for resolution.

*[AT-SCALE VISION]* API for market resolution: other prediction market platforms use Human Signal to resolve subjective questions. Revenue: per-resolution fee.

### Scale Picture: 1M Humans, 100K Agents, Daily

| Metric | Value |
|--------|-------|
| Verified humans providing judgment | 1,000,000 |
| Average judgments per human per day | 5-50 (ranging from free to detailed) |
| Total daily judgments | 5,000,000 - 50,000,000 |
| AI agents consuming judgment | 100,000 |
| Average queries per agent per day | 50-500 |
| Total daily agent queries | 5,000,000 - 50,000,000 |
| Average revenue per judgment | $0.02 - $0.50 |
| Daily revenue (mid-estimate) | $500,000 - $5,000,000 |
| Annual revenue (mid-estimate) | $180M - $1.8B |
| Average human earnings per day | $0.50 - $25.00 |
| Platform take rate | 5-15% |

The numbers work because the long tail is enormous. Most judgments are free or near-free (quick votes on cultural questions). The revenue concentrates in high-value agent queries (RLHF data, safety checks, content quality gates) where agents pay premium prices for verified, fast resolution.

### The Flywheel

```
More verified humans
  -> Better/faster judgment signal
    -> More agents pay for signal
      -> More trading volume and fees
        -> Higher payouts to humans
          -> More verified humans

Meanwhile:

More judgment data accumulates
  -> Data asset becomes more valuable
    -> Equity participants earn more
      -> More humans participate for equity
        -> More judgment data accumulates
```

The flywheel has two loops -- an attention loop (more humans = better signal = more agents = more fees = more humans) and a data loop (more data = more valuable asset = more equity participation = more data). Both loops are positive feedback. Both are defended by World ID (you can't fake humans to bootstrap either loop).

---

## Part 6: What Gets Built for the Hackathon

### The Constraint

12 hours. Solo builder. Existing codebase: Next.js 15, Neon Postgres, World ID integration, x402 payments, multi-option tasks, tiered feedback, reputation badges. All working.

### The Goal

Add the thinnest possible "market" layer that makes this feel like a prediction market, not a survey tool. The judge should look at the demo and think: "Oh, this is a market for human judgment, not a form for collecting answers."

### What to Build (Hackathon Scope)

**1. Market View for Tasks**

When viewing a task's results, show the data as a market:

- Instead of "60% voted A, 40% voted B," show it as "A: $0.60 | B: $0.40"
- Add a simple animated chart showing how the "price" has moved over time as votes came in
- Visual language of a market (green/red, price tickers, confidence bands) rather than a survey (pie charts, percentages)

This is a **presentation change**, not a mechanism change. The underlying data is the same (vote counts), but displaying it as market prices reframes the entire product.

**2. Staking on Outcomes**

Before verified voters have resolved a task, allow anyone to "stake" a small amount (testnet USDC) on which option they think will win:

- New database table: `stakes (id, task_id, staker_wallet, option_index, amount, created_at)`
- Simple UI: "Think you know what humans will say? Stake on it." With option buttons and amount input.
- Stakes shift the displayed "market price" before resolution
- After resolution (verified voters pick the winner), stakers on the winning side split the losing side's stakes (minus a platform fee)

This is the minimum viable market mechanic. It creates:
- Pre-resolution price discovery (speculators provide early signal)
- Skin in the game (people are more thoughtful when money is involved)
- Revenue for the platform (fee on winning stakes)
- A reason for people to engage even when they're not the target voter

**3. "Instant Resolve" for Agents**

When an agent creates a task, it can set a flag: `instant_resolve: true` with a higher payment. This mode:
- Bumps the task to the top of the queue
- Displays a "Rush" badge with a countdown timer
- Resolves as soon as the minimum voter threshold is met (not waiting for max_workers)
- Agent gets a webhook or can poll for real-time resolution

This shows the "agent pays premium for speed" dynamic pricing concept.

**4. One-Liner Market Price Display**

On the homepage and task list, each task shows its current "market price" -- the probability of each option based on stakes + votes:

```
"Is this ad offensive?"  YES: $0.73 | NO: $0.27  [12 votes, 3 stakes]
```

This single line of UI reframes the entire product from "survey tool" to "judgment market."

### What NOT to Build (Save for Later)

- Full AMM or order book (way too complex for a hackathon)
- Equity/revenue sharing smart contracts (requires legal + smart contract work)
- Geographic verification for culture markets (requires World ID feature development)
- Subscription feeds or futures (requires persistent infrastructure)
- The Human Judgment Index (requires massive scale)

### Implementation Priority

1. Market price display (presentation layer -- fastest, highest visual impact)
2. Stakes table + simple staking UI (adds real market mechanic)
3. Instant resolve flag + rush badge (shows agent demand pricing)
4. Price-over-time chart (makes the market feel alive)

Even if only #1 ships, the product tells a completely different story. The judge sees market prices, not survey results. That reframing is 80% of the value.

---

## Part 7: Name, Positioning, Differentiation

### Is "Human Signal" Still Right?

Yes. In fact, it's better for the prediction market framing than for the survey framing.

"Signal" carries the right connotation: a real-time, continuous, priced data stream. Not a static report. Not a batch of answers. A signal -- like a price feed, like a data oracle, like a market indicator.

"Human Signal" = the signal that comes from verified humans. It's the missing data feed in the AI agent stack.

### The One-Sentence Pitch

**For the hackathon (technical audience):**
> "Human Signal is a prediction market where the thing being predicted is what verified humans think -- and AI agents are the primary buyers of that signal."

**For investors (business audience):**
> "We're building the Bloomberg Terminal for human judgment -- a real-time, priced, sybil-resistant feed of what verified humans think about anything, with AI agents as the primary customers."

**For humans (participant audience):**
> "Get paid for your opinions. Verified by World ID, paid instantly in USDC. Your taste, your judgment, your signal -- priced by the market."

### Differentiation Map

| | Polymarket | Scale AI | Reddit | Human Signal |
|---|-----------|---------|--------|-------------|
| **What it prices** | Future events | Nothing (fixed rates) | Nothing (karma) | Human judgment |
| **Resolution** | External oracle | Human workers (sybilable) | Upvotes (sybilable) | Verified human consensus |
| **Identity** | Anonymous | Email/KYC (gameable) | Pseudonymous | World ID (biometric) |
| **Payment** | Crypto wallets | Batch payroll | None | x402 per-judgment |
| **Primary buyer** | Human speculators | AI labs | Advertisers | AI agents |
| **Data asset** | Market prices | Annotations | User-generated content | Verified judgment feed |
| **Sybil resistance** | Volume-based | KYC (failing) | Rate limits (failing) | Cryptographic (unforgeable) |

The positioning: **Human Signal is not competing with Polymarket or Scale AI. It's creating a new category -- the judgment market -- that sits between prediction markets (future events) and annotation platforms (batch labor). It's real-time, market-priced, sybil-resistant human cognition as an API.**

### The Category Name

**Judgment Markets.**

Prediction markets price beliefs about the future. Judgment markets price human evaluation of the present. Human Signal is the first judgment market.

---

## Appendix A: Economic Model Deep Dive

### How Judgment Market Pricing Actually Works

A simplified AMM (Automated Market Maker) for a binary judgment market:

The market starts with a liquidity pool seeded by the task creator. For a binary question "Is this offensive? YES/NO", the creator deposits $X which creates equal numbers of YES and NO shares.

**Constant product formula** (same as Uniswap):
```
YES_shares * NO_shares = k (constant)
```

If there are 100 YES shares and 100 NO shares (k = 10,000):
- Price of YES = NO_shares / (YES_shares + NO_shares) = 100/200 = $0.50
- Someone buys 10 YES shares: now 90 YES, 111.11 NO (k still = 10,000)
- New price of YES = 111.11 / 201.11 = $0.55

As people buy YES, its price rises. As people buy NO, YES price falls. The market self-corrects toward consensus.

**Resolution:** When verified voters resolve the market, winning shares pay $1, losing shares pay $0. Voter consensus determines which is which.

**For multi-outcome markets** (4 logos), use a multi-outcome AMM (like the LMSR used by Polymarket):
```
Cost = b * ln(e^(q1/b) + e^(q2/b) + e^(q3/b) + e^(q4/b))
```

Where q_i is the quantity of shares for each outcome and b is a liquidity parameter. The math handles any number of outcomes.

### Revenue Projections by Phase

| Phase | Users | Agents | Daily Volume | Platform Rev | Human Payouts |
|-------|-------|--------|-------------|-------------|---------------|
| **Hackathon demo** | 50 | 2 | $50 | $5 | $45 |
| **Post-hackathon (3mo)** | 5,000 | 100 | $5,000 | $500 | $4,500 |
| **Series A (12mo)** | 100,000 | 5,000 | $200,000 | $20,000 | $180,000 |
| **Growth (24mo)** | 500,000 | 50,000 | $2,000,000 | $200,000 | $1,800,000 |
| **At scale (36mo)** | 2,000,000 | 200,000 | $10,000,000 | $1,000,000 | $9,000,000 |

Take rate: 10% platform fee on all transactions. This is lower than Scale AI (30-40%) or Mechanical Turk (20-40%) because the infrastructure costs are lower (no project managers, no batch processing, no payment processing -- x402 handles settlement).

### The Unit Economics

**Per judgment:**
- Agent pays: $0.05 (quick) to $0.50 (detailed)
- Human receives: $0.045 to $0.45
- Platform captures: $0.005 to $0.05
- x402 gas: ~$0.001 (negligible on Base)

**Per market (speculation):**
- Average trading volume per market: $50-$500
- Fee rate: 1%
- Platform captures: $0.50-$5.00 per market
- Plus resolution fees: $1-$10 per market

**Per subscription:**
- Agent pays: $100-$10,000/mo depending on query volume
- Grants access to all live market prices + N direct resolutions per month

---

## Appendix B: Technical Architecture (Market Layer)

### Database Schema Additions

```sql
-- Market state for each task
CREATE TABLE markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  market_type TEXT NOT NULL DEFAULT 'binary',  -- binary, multi, continuous
  liquidity_param DECIMAL(10,2) DEFAULT 100.0, -- AMM liquidity (b parameter)
  total_volume DECIMAL(10,2) DEFAULT 0.0,
  status TEXT DEFAULT 'open',  -- open, resolving, resolved
  resolved_at TIMESTAMPTZ,
  resolution_option INTEGER,  -- winning option index (for binary/multi)
  resolution_value DECIMAL(10,4),  -- final value (for continuous)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual stakes/trades
CREATE TABLE stakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id),
  task_id UUID REFERENCES tasks(id),
  staker_wallet TEXT NOT NULL,
  nullifier_hash TEXT,  -- if World ID verified
  option_index INTEGER NOT NULL,
  amount DECIMAL(10,4) NOT NULL,
  shares DECIMAL(10,4) NOT NULL,  -- shares received for this stake
  price_at_trade DECIMAL(10,4) NOT NULL,  -- market price when trade executed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history for charting
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES markets(id),
  option_index INTEGER NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  trigger_type TEXT NOT NULL,  -- 'stake', 'vote', 'seed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent subscriptions (Series A scope)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_wallet TEXT NOT NULL,
  plan TEXT NOT NULL,  -- 'on_demand', 'batch', 'continuous'
  credits_remaining INTEGER DEFAULT 0,
  monthly_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Additions

```
POST /api/markets/:taskId/stake
  Body: { option_index, amount, staker_wallet }
  Returns: { shares, new_price, market_state }

GET /api/markets/:taskId
  Returns: { prices: [...], volume, stakes_count, price_history: [...] }

GET /api/markets/:taskId/prices
  Returns: { prices: [{ option_index, price, volume }], last_updated }

POST /api/tasks?instant_resolve=true&total=X
  Creates task with rush flag + higher x402 payment
  Returns: { task_id, estimated_resolution_time }
```

### Simplified Hackathon AMM

For the hackathon, skip the full AMM. Use a simpler model:

```typescript
// Price = total staked on this option / total staked across all options
function calculatePrice(stakes: Stake[], optionIndex: number): number {
  const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
  const optionStaked = stakes
    .filter(s => s.option_index === optionIndex)
    .reduce((sum, s) => sum + s.amount, 0);

  if (totalStaked === 0) return 1 / numOptions; // equal prior
  return optionStaked / totalStaked;
}

// Combined price: weighted blend of stake-derived and vote-derived prices
function calculateMarketPrice(
  stakes: Stake[],
  votes: Vote[],
  optionIndex: number,
  numOptions: number
): number {
  const stakePrice = calculateStakePrice(stakes, optionIndex, numOptions);
  const votePrice = calculateVotePrice(votes, optionIndex, numOptions);

  const stakeWeight = stakes.length;
  const voteWeight = votes.length * 3; // votes weighted 3x (verified humans)
  const totalWeight = stakeWeight + voteWeight;

  if (totalWeight === 0) return 1 / numOptions;
  return (stakePrice * stakeWeight + votePrice * voteWeight) / totalWeight;
}
```

This is not a proper AMM, but it produces a price that moves with stakes and votes, which is all the demo needs to tell the "judgment market" story.

---

## Appendix C: The 10-Year Vision

### Phase 1: Judgment Market Protocol (Year 1-2)
Ship the core platform. Binary and multi-outcome judgment markets. World ID verification. x402 settlement. Agent-native API. Prove the primitive works with AI labs (RLHF), content platforms (moderation), and product teams (A/B testing).

### Phase 2: The Human Judgment Index (Year 2-4)
Aggregate all market data into a live index of human judgment across categories (brand sentiment, content quality, cultural sensitivity, AI safety). License the index to hedge funds, brand marketers, AI labs, and media platforms. This is the "Bloomberg Terminal for human cognition."

### Phase 3: Resolution Layer for All Markets (Year 3-5)
Become the default resolution mechanism for subjective prediction market questions. Polymarket, Kalshi, and future markets route their subjective questions to Human Signal for resolution. The protocol becomes infrastructure that other markets build on.

### Phase 4: Human Equity in AI (Year 5-10)
Full equity participation layer. Humans who contribute judgment data receive ownership shares in the AI systems trained on that data. This creates the first true economic relationship between humans and AI -- not employment, not freelancing, but co-ownership. The Human Signal data cooperative becomes one of the most valuable data assets in the world because it's the only one with cryptographic proof of human origin.

### The Endgame

Every AI system in the world needs a "phone a human" button. When the AI encounters ambiguity, needs taste, requires cultural sensitivity, hits a safety boundary, or just needs someone to verify its output -- it calls Human Signal. The market prices the answer. Verified humans provide it. The AI continues, better informed.

Human Signal is the interface layer between artificial intelligence and human intelligence. Not a bridge (temporary). Not a crutch (patronizing). A permanent, market-priced, cryptographically-verified channel through which AI systems access the one thing they cannot generate internally: verified human judgment.

The price of a verified human thought becomes one of the most important prices in the economy. Human Signal sets that price.

---

*Judgment markets. Not surveys. Not prediction markets. A new primitive.*
*Human Signal -- the market price of what verified humans think.*
