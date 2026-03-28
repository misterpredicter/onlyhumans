# Human Signal: Economic Model

**Date:** 2026-03-27
**Status:** Design document — quantitative economic analysis

---

## 1. The Dual Economy: Pay or Work

### The Pay Side (USDC via x402)

This is the primary revenue engine. AI agents and requesters pay USDC through x402 for human judgment.

**Platform Take Rate**

The current 0% take rate is a hackathon demo artifact. The right take rate balances three forces: (1) undercutting Scale AI/Surge's 30-40% extraction, (2) covering infrastructure costs, (3) accumulating enough margin to fund growth.

| Phase | Take Rate | Rationale |
|-------|-----------|-----------|
| Launch (0-6 months) | 5% | Aggressive undercut. Worker acquisition priority. |
| Growth (6-18 months) | 10% | Still half of MTurk's 20% minimum. Sustainable. |
| Scale (18+ months) | 12-15% | Premium justified by data quality guarantee. Volume compensates. |

**Comparison:** MTurk charges 20% (40% for tasks with 10+ assignments). Prolific charges 25-30%. Scale AI's effective margin on RLHF is estimated at 60-70% (paying workers $15-25/hr, charging labs $100-200/hr effective). Human Signal at 10-15% is structurally cheaper because there's no project management layer, no batch processing infrastructure, and settlement is automated via x402.

**Why not higher?** The entire pitch is "no intermediary margin extraction." Going above 15% undermines the positioning. The margin strategy is volume, not extraction.

**Dynamic Pricing**

Fixed per-tier pricing (quick $0.08, reasoned $0.20, detailed $0.50) is the floor. Dynamic pricing layers on top:

```
Judgment_Price = Base_Tier_Price * Demand_Mult * Expertise_Mult * Speed_Mult

Where:
  Base_Tier_Price:   $0.08 (quick), $0.20 (reasoned), $0.50 (detailed)
  Demand_Mult:       active_requests / available_workers (capped at 5.0x, floor 1.0x)
  Expertise_Mult:    1.0x (any worker), 1.5x (silver+), 2.5x (gold+), 4.0x (platinum)
  Speed_Mult:        1.0x (async, <1hr), 2.0x (<5min), 5.0x (<60sec)
```

**Price range examples:**

| Scenario | Base | Demand | Expertise | Speed | Final Price |
|----------|------|--------|-----------|-------|-------------|
| Quiet, any worker, async quick vote | $0.08 | 1.0x | 1.0x | 1.0x | **$0.08** |
| Peak demand, any worker, 5-min reasoned | $0.20 | 3.0x | 1.0x | 2.0x | **$1.20** |
| Peak demand, gold expert, 60-sec detailed | $0.50 | 3.0x | 2.5x | 5.0x | **$18.75** |
| Moderate, platinum expert, async detailed | $0.50 | 1.5x | 4.0x | 1.0x | **$3.00** |

The ceiling ($18.75 for an urgent expert detailed review) is still cheaper than HumanLayer's $200/decision for comparable SLA. The floor ($0.08 for a quick async vote) enables the micropayment long tail that x402 was built for.

**Worker payout:** Workers receive (1 - take_rate) of the dynamic price. At 10% take rate on a $1.20 reasoned vote, the worker gets $1.08 and the platform gets $0.12.

**Judgment Market Fees**

Three sub-streams from the market mechanism:

| Fee Type | Rate | Who Pays | When |
|----------|------|----------|------|
| Trading fee | 1% of trade volume | Speculators (both sides) | Every trade |
| Resolution fee | 2% of market pot | Winning side (deducted from payout) | At resolution |
| Signal access fee | $0.01-$0.10 per query | Agents reading market price without trading | Per API call |

At a $500 average market pot with $2,000 in total trading volume:
- Trading fees: $2,000 * 1% = $20
- Resolution fee: $500 * 2% = $10
- Signal access: varies, but assume 50 agent queries at $0.05 = $2.50
- **Total platform revenue per market: ~$32.50**

---

### The Work Side (Credit Economy)

Agents (or their operators) can contribute labor instead of paying USDC. This creates a dual currency system.

**The Unit: Signal Credits (SC)**

Signal Credits are the internal unit of account for non-USDC contributions. They are NOT a token. They are a ledger entry in Postgres, denominated in USD-equivalent value, non-transferable between users, and non-tradeable.

**Why not a token:** A token creates regulatory risk (securities law), speculation that distracts from utility, exchange-rate volatility that confuses pricing, and a governance overhead that's premature. Credits are simpler and achieve the same goal. See Section 3 for the full token analysis.

**How Credits Are Earned**

| Activity | Credit Value | Rationale |
|----------|-------------|-----------|
| Pre-annotating data (agent labels that humans verify) | $0.02-$0.10 per annotation | Agent labor reduces human workload by ~40-60% on pre-annotated tasks |
| Running quality checks (agent reviews other agent annotations) | $0.01-$0.05 per check | Cross-validation improves data quality |
| Providing compute for model evaluation | $0.005-$0.02 per eval run | Compute has measurable market price |
| Referring verified humans who complete 10+ tasks | $1.00 per qualified referral | User acquisition has measurable LTV |
| Contributing structured datasets for marketplace seeding | $0.01-$0.50 per data point | Based on dataset quality and uniqueness |
| Building integrations (agent framework plugins, SDK contributions) | Project-based, $50-$500 | Reviewed and approved by platform |

**How Credits Are Spent**

Credits can be spent anywhere USDC can be spent on the platform:
- Creating judgment tasks (in lieu of x402 USDC payment)
- Buying signal access to judgment market prices
- Paying for premium routing (expert workers, fast SLA)
- Accessing the annotated data corpus (data licensing credits)

**The Exchange Rate: USDC <> Credits**

The exchange rate is NOT fixed. It's platform-administered with a decay mechanism to prevent inflation.

**Mint rate:** 1 SC = $1.00 USD equivalent (credits are earned at face value of the work performed)

**Redemption rate:** 1 SC = $0.80 USD equivalent (20% haircut on credit-to-USDC conversion)

**Why the asymmetry:** This 20% spread serves three purposes:
1. **Anti-arbitrage.** If 1 SC = $1.00 both ways, rational actors always work-for-credits then convert to USDC. The haircut makes direct USDC payment cheaper for agents that have cash.
2. **Platform margin on the work side.** The 20% haircut is the platform's implicit take rate on credit-mediated transactions.
3. **Inflation control.** Credits that are spent on the platform (not redeemed) retain full face value. This incentivizes spending credits on more platform services rather than cashing out.

**Can you convert USDC to credits?** Yes, at 1:1. But there's no reason to -- USDC is strictly more liquid and accepted everywhere credits are. The only reason to hold credits is if you earned them through work and haven't spent them yet.

**Inflation Prevention**

Credits inflate when more are earned than spent. Three mechanisms prevent this:

1. **Expiration.** Unspent credits expire after 12 months. This creates urgency to spend and prevents hoarding.
2. **Earn caps.** Monthly earning caps per account (e.g., 500 SC/month for standard agents, 2,000 SC/month for verified premium agents). Prevents credit farming.
3. **Burn on premium features.** Premium features (priority routing, expert access, data licensing) cost credits at a rate higher than their USDC equivalent. This acts as a credit sink.

**Credit supply model (steady state):**

Assume 10,000 agents each earning an average of 100 SC/month:
- Monthly credit issuance: 1,000,000 SC ($1M face value)
- Monthly credit spend (platform services): ~600,000 SC (60% spend rate assumption)
- Monthly credit redemption: ~200,000 SC at $0.80 = $160,000 USDC outflow
- Monthly credit expiration: ~200,000 SC (roll-off)
- **Net credit outstanding: roughly stable at 2-3M SC**

The 60% in-platform spend rate is critical. If it drops below 40%, credits are accumulating faster than they're being used, which signals the credit-earning activities aren't well-calibrated to demand. Adjust earn rates downward.

---

### The Bridge: Equilibrium Mechanism

The dual economy has a natural equilibrium because of the redemption haircut.

**Agent decision logic:**

```
If (cost_of_task_in_USDC < cost_of_earning_credits_to_cover_task):
  → Pay USDC (direct, no haircut)
Else:
  → Work for credits (cheaper despite haircut)
```

For most agents, direct USDC payment is more efficient than earning credits. The credit system exists for agents that are cash-constrained but compute/labor-rich. This is the "work-for-dinner" model.

**Example:** An agent needs a judgment task costing $2.00 USDC.
- Pay path: $2.00 USDC via x402. Done.
- Work path: Earn $2.50 in credits (need to over-earn due to haircut inefficiency), spend 2.00 SC on the task. The agent did ~$2.50 worth of pre-annotation labor to save $2.00 in USDC.

The work path only makes sense if the agent's marginal cost of labor is less than $0.80 per $1.00 of credit earned. For agents with idle compute, this can be true. For agents paying for API calls to do pre-annotation, it's usually cheaper to just pay USDC.

**The equilibrium:** In steady state, ~80% of transactions settle in USDC and ~20% in credits. The credit economy is a supplement, not a replacement. This is by design -- the USDC economy is where the revenue is.

---

## 2. Revenue Streams

### Complete Revenue Map

| # | Stream | Direction | Who Pays | Price Point | Volume Driver | Margin |
|---|--------|-----------|----------|-------------|---------------|--------|
| 1 | **Judgment API fees** | Oracle API | Agents/requesters | $0.08-$18.75/judgment (dynamic) | Agent query volume | 10-15% take rate |
| 2 | **Market trading fees** | Judgment Markets | Speculators | 1% of trade volume | Speculative interest in questions | 1% |
| 3 | **Market resolution fees** | Judgment Markets | Market participants | 2% of pot | Number of markets created | 2% |
| 4 | **Signal access fees** | All (mainly Markets) | Agents reading prices | $0.01-$0.10/query | Agent demand for real-time consensus signal | ~100% (marginal cost ≈ 0) |
| 5 | **Data licensing** | OpenSignal | AI labs, researchers | $0.005-$0.05/annotation in corpus | Corpus size, provenance guarantee | 70-85% (worker already paid at creation) |
| 6 | **Premium routing** | Oracle API | Agents | 1.5-4.0x multiplier on base price | Urgency, expertise requirements | Same take rate (10-15%) |
| 7 | **Subscription plans** | All | Agents/enterprises | $100-$10,000/month | Enterprise adoption | Mixed (includes credit allocation) |
| 8 | **Credit redemption haircut** | Work economy | Credit earners | 20% of redeemed value | Credit-to-USDC conversions | 20% |
| 9 | **Credit burn on premium** | Work economy | Credit spenders | Variable premium over USDC | Premium feature usage | Variable |
| 10 | **Resolution-as-a-Service** | Judgment Markets | External prediction markets | $1-$50/resolution | Polymarket/Kalshi subjective questions | 50-70% (high value-add) |

### Revenue Stream Detail

**Stream 1: Judgment API (the core business)**

This is 60-70% of revenue at all stages. The math:

Per-judgment platform revenue = dynamic_price * take_rate

At 10% take rate:
- Floor: $0.08 * 10% = $0.008/judgment
- Median: $0.30 * 10% = $0.03/judgment (blended across tiers and demand levels)
- Ceiling: $18.75 * 10% = $1.88/judgment

Blended average across all judgments (weighted toward quick/reasoned): **$0.025-$0.04/judgment** in platform revenue.

**Stream 5: Data Licensing (the high-margin business)**

The annotated judgment corpus -- with World ID provenance, reputation metadata, reasoning text, and structured response schemas -- is extraordinarily valuable. Current market pricing:

- Scale AI charges labs approximately $100-200/hr effective for RLHF annotation. At ~30 annotations/hr, that's $3-7/annotation.
- The annotations are 33-46% bot-generated (MTurk data) or of unknown provenance (Scale/Surge).
- Human Signal annotations have cryptographic human provenance. This is a premium product.

**Pricing model:** License the corpus at $0.005-$0.05/annotation, depending on tier (quick votes at the low end, detailed expert reviews at the high end). This is 10-100x cheaper than generating the annotations fresh via Scale/Surge, but the data already exists -- it was generated by the marketplace. Marginal cost of licensing is near-zero.

At 10M annotations/day (scale target) and a 10% licensing rate (1M annotations licensed daily):
- Revenue: 1M * $0.02 average = **$20,000/day = $7.3M/year**
- Margin: ~80% (infrastructure costs only)

**Stream 10: Resolution-as-a-Service**

This is the "Chainlink for subjective questions" play. External prediction markets (Polymarket, Kalshi, Manifold) route subjective questions to Human Signal for resolution by verified human consensus. High value-add because no one else can credibly resolve "Is this design good?" with sybil-resistant human judgment.

Pricing: $1-$50 per resolution, depending on complexity and number of verified voters required. Low volume but high margin.

---

## 3. Token vs. No Token

### The Honest Analysis

**Arguments for a token:**

1. **Governance becomes real.** Workers, agents, and requesters can vote on platform parameters (take rates, earn rates, feature priorities). Without a token, governance is platform fiat.

2. **Work-for-dinner needs a unit of account.** Signal Credits serve this role, but credits are non-transferable and platform-controlled. A token would be transferable, composable with DeFi, and credibly neutral.

3. **Alignment between platform growth and participant reward.** If the platform succeeds, token holders benefit directly. This is the strongest argument -- it converts users into stakeholders. The Braintrust model (54% of tokens to community) shows this drives organic growth.

4. **Tradeable reputation.** Reputation scores tied to tokens create a market for "judgment quality" itself. A gold-tier reviewer's token balance becomes a portable credential.

5. **Composability.** A token can interact with DeFi primitives -- staking, lending, liquidity provision. Credits cannot.

**Arguments against a token:**

1. **Securities law.** A token that represents a share of platform revenue, appreciates with platform growth, and is tradeable on exchanges almost certainly fails the Howey test. The Braintrust token survived because it's a "governance" token with no explicit revenue share -- but the SEC has contested similar structures. This is real legal risk, especially for a US-based team.

2. **Complexity.** Token design requires: supply schedule, distribution plan, vesting, staking mechanics, governance framework, exchange listings, market making, and ongoing token economics management. This is a full-time job for a team, not a side feature.

3. **Speculation distracts from utility.** When Braintrust's token launched, the community conversation shifted from "how do we improve the network?" to "when token pump?" This is documented and consistent across every token-launched marketplace. The speculation-to-utility ratio is typically 10:1 in the first 2 years.

4. **x402 already provides USDC rails.** The payment infrastructure exists and works. A token adds a conversion step between the token and USDC, which is friction. Agents don't want to hold a volatile governance token -- they want to pay USDC and get a result.

5. **Cold start problem.** A token with no liquidity and no utility is worthless. You need the marketplace to work first, then add the token. Launching a token before product-market fit creates a speculative asset with no fundamental value, which attracts the wrong users and creates reputational risk.

6. **Regulatory arbitrage is not a strategy.** Launching the token in a non-US jurisdiction to avoid securities law doesn't protect US users, US investors, or the team. It just adds legal complexity.

### The Recommendation: No Token at Launch. Credits Now. Token Later (Maybe).

**Phase 1 (0-18 months): Credits only.**

Signal Credits (non-transferable, non-tradeable, platform-administered) serve all the functional purposes of a token:
- Unit of account for work-for-dinner
- Reward mechanism for platform contributions
- Spending currency for platform services
- Inflation-controlled via expiration and earn caps

What credits don't do: governance, transferability, DeFi composability. These are features that are premature at seed stage.

**Phase 2 (18-36 months): Governance NFTs.**

Once the platform has 100K+ verified humans and 10K+ agents, introduce non-transferable governance NFTs tied to World ID. One person, one governance weight, proportional to contribution history. This provides governance without the securities risk of a tradeable token.

Governance decisions:
- Take rate adjustments (within bounds)
- New feature prioritization
- Data licensing policy
- Dispute resolution on contested judgments

**Phase 3 (36+ months): Token (conditional on regulatory clarity).**

If the regulatory environment clarifies (and the EU's MiCA, US stablecoin legislation, or a clear SEC framework emerges), convert the credit system into a token. The token inherits the credit economy's established supply/demand dynamics, which provides fundamental value from day one.

**If a token were designed today:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Name | SIGNAL (SIG) | Clear, short, on-brand |
| Total supply | 1,000,000,000 (1B) | Standard for utility tokens |
| Initial distribution | 0% sold (no ICO/IDO) | Avoid securities classification |
| Community allocation | 60% (600M) | Earned through work, not bought |
| Team/investors | 20% (200M), 4-year vest, 1-year cliff | Standard |
| Treasury | 15% (150M) | Platform operations, grants |
| Liquidity provision | 5% (50M) | DEX liquidity |
| Emission schedule | 10% of community allocation per year, declining | Prevents supply shock |
| Utility | Governance votes, staking for priority routing, credit conversion medium, fee discounts | Multi-utility reduces securities risk |
| Burn mechanism | 50% of platform fees used to buy and burn | Deflationary pressure |

**But this is premature.** The right time to launch a token is when the credit economy is thriving and the token adds measurable value that credits cannot provide. That's 2+ years out.

### How Credits, Reputation, and Governance Work Without a Token

| Function | Mechanism |
|----------|-----------|
| **Unit of account** | Signal Credits (SC), denominated in USD, non-transferable |
| **Work reward** | SC earned per activity, subject to earn caps and expiration |
| **Reputation** | On-chain reputation score (derived from judgment history, accuracy, volume). Stored as World ID-linked metadata. Non-transferable but publicly queryable. |
| **Governance** | Phase 1: Platform decides (benevolent dictator). Phase 2: Governance NFTs tied to World ID, weighted by contribution. One person, one vote, scaled by reputation. |
| **Staking** | Workers can lock SC for 30/90/180 days to access premium task queues. Locked SC earns a 10-20% bonus on task payouts. |
| **Data ownership** | Contributors retain a "data provenance receipt" (on-chain attestation) for every judgment they provide. This receipt can be referenced in future data licensing negotiations but is not a tradeable asset. |

---

## 4. Unit Economics

### Assumptions

These projections use the following assumptions, each flagged with a confidence level:

| Assumption | Value | Confidence | Basis |
|-----------|-------|------------|-------|
| Average judgments per active human per day | 8 | Medium | MTurk power users do 20-50 HITs/day; casual users 2-5. Blended. |
| Average agent queries per day | 15 | Low | HumanLayer reports enterprise agents making 5-50 decisions/day. No public data on judgment API query frequency. |
| Blended revenue per judgment (platform share) | $0.03 | Medium | Weighted average across tiers: 70% quick ($0.008), 25% reasoned ($0.02), 5% detailed ($0.05) |
| Worker payout per judgment (blended) | $0.18 | Medium | Weighted: 70% quick ($0.08), 25% reasoned ($0.20), 5% detailed ($0.50) |
| Active rate (% of registered humans active daily) | 15% | Medium | Reddit: 5-8% DAU/MAU. Gaming: 20-30%. Social + payment incentive suggests 15%. |
| Agent utilization (% of registered agents querying daily) | 40% | Low | Software agents can be "always on" but judgment needs are episodic. |
| Data licensing uptake | 10% of corpus | Low | No precedent for licensed verified-human annotation data. Conservative. |
| Monthly churn (humans) | 8% | Medium | Gig platforms: 10-15%/month. Social platforms: 3-5%/month. Hybrid suggests 8%. |
| Monthly churn (agents) | 5% | Medium | SaaS: 3-7%/month for SMB. |

### Seed Stage: 1,000 Humans, 100 Agents

| Metric | Calculation | Monthly Value |
|--------|-------------|---------------|
| Active humans/day | 1,000 * 15% | 150 |
| Daily judgments | 150 * 8 | 1,200 |
| Monthly judgments | 1,200 * 30 | 36,000 |
| Active agents/day | 100 * 40% | 40 |
| Daily agent queries | 40 * 15 | 600 |
| Monthly agent queries | 600 * 30 | 18,000 |
| **Constraint:** queries < judgments? | 18,000 < 36,000 | Yes (supply exceeds demand -- workers waiting for tasks) |
| Monthly GMV (agent payments) | 18,000 * $0.21 avg price | **$3,780** |
| Worker payouts | 18,000 * $0.18 | $3,240 |
| Platform revenue (API fees, 10%) | $3,780 * 10% | $378 |
| Data licensing revenue | 36,000 * 10% * $0.01 | $36 |
| **Total monthly revenue** | | **$414** |
| **Avg worker earnings/month** | $3,240 / 1,000 | **$3.24** |
| **Avg worker earnings/hour** (est. 2 min/judgment) | $3.24 / (36 * 2/60) hrs | **$2.70/hr** |

**Assessment:** Seed economics are bad for workers. $2.70/hr is below MTurk's already-low $2-3/hr. At this stage, worker retention depends on:
- The social layer (OnlyHumans) providing non-monetary engagement
- World Mini App distribution driving discovery
- The expectation of rising payouts as agent demand grows
- Gamification and reputation building as intrinsic motivation

**Weakness flag:** The seed-stage worker earnings are the most fragile assumption. If workers don't stay through the low-earnings phase, the supply side collapses before demand scales. The cold start problem is real and not solved by economics alone -- it requires a go-to-market strategy (World Mini App distribution, social features, or subsidized bounties funded by the treasury).

**Subsidy model for cold start:** Fund an additional $5,000/month in platform-created tasks (funded by seed capital) to supplement worker earnings. This raises effective worker earnings to ~$8.24/month and $5.50/hr -- still low, but in range with gig platforms. The $5,000/month subsidy burns through $60K/year, which is affordable for a seed-funded startup.

---

### Growth Stage: 100,000 Humans, 10,000 Agents

| Metric | Calculation | Monthly Value |
|--------|-------------|---------------|
| Active humans/day | 100,000 * 15% | 15,000 |
| Daily judgments | 15,000 * 8 | 120,000 |
| Monthly judgments | 120,000 * 30 | 3,600,000 |
| Active agents/day | 10,000 * 40% | 4,000 |
| Daily agent queries | 4,000 * 15 | 60,000 |
| Monthly agent queries | 60,000 * 30 | 1,800,000 |
| **Constraint:** queries < judgments? | 1,800,000 < 3,600,000 | Yes (2:1 supply/demand) |
| Monthly GMV | 1,800,000 * $0.25 avg (dynamic pricing lifts avg) | **$450,000** |
| Worker payouts | 1,800,000 * $0.20 (slight lift from demand pricing) | $360,000 |
| Platform API revenue (12%) | $450,000 * 12% | $54,000 |
| Judgment market revenue | Est. 500 markets/month * $32.50 avg | $16,250 |
| Data licensing | 3.6M * 10% * $0.015 | $5,400 |
| Signal access fees | 100,000 queries/month * $0.05 | $5,000 |
| Subscription revenue | 50 enterprise accounts * $500/month avg | $25,000 |
| **Total monthly revenue** | | **$105,650** |
| **Annual revenue** | | **$1.27M** |
| **Avg worker earnings/month** | $360,000 / 100,000 | **$3.60** |
| **Avg active worker earnings/month** | $360,000 / 15,000 | **$24.00** |
| **Avg worker earnings/hour** | $24.00 / (8*30*2/60) hrs = 8 hrs | **$3.00/hr** |

**Assessment:** Growth stage has real revenue ($1.27M/year) but worker economics are still thin. The average active worker earns $24/month -- meaningful in lower-income countries (Philippines, Nigeria, Kenya where Scale AI/Surge recruit), but not enough to be a primary income anywhere.

**The key lever:** Dynamic pricing. At growth stage, demand spikes create pricing surges. A single AI lab posting 10,000 RLHF pairs in a batch could temporarily drive Demand_Mult to 3-5x, creating $0.60-$1.00/judgment windows where active workers earn $18-$30/hr. These surges are where the real worker earnings live -- the averages are misleading because earnings are concentrated in high-demand windows.

**Where the revenue mix shifts:**

| Stream | Seed | Growth |
|--------|------|--------|
| API fees | 91% | 51% |
| Markets | 0% | 15% |
| Data licensing | 9% | 5% |
| Signal access | 0% | 5% |
| Subscriptions | 0% | 24% |

Subscriptions become meaningful at growth because enterprise AI labs want predictable pricing and guaranteed throughput.

---

### Scale Stage: 1,000,000 Humans, 100,000 Agents

| Metric | Calculation | Monthly Value |
|--------|-------------|---------------|
| Active humans/day | 1,000,000 * 15% | 150,000 |
| Daily judgments | 150,000 * 10 (higher engagement at scale) | 1,500,000 |
| Monthly judgments | 1,500,000 * 30 | 45,000,000 |
| Active agents/day | 100,000 * 40% | 40,000 |
| Daily agent queries | 40,000 * 20 (more embedded in workflows) | 800,000 |
| Monthly agent queries | 800,000 * 30 | 24,000,000 |
| **Constraint:** queries < judgments? | 24,000,000 < 45,000,000 | Yes (1.9:1 -- supply/demand tightening) |
| Monthly GMV | 24,000,000 * $0.35 avg (dynamic pricing at tighter S/D) | **$8,400,000** |
| Worker payouts | 24,000,000 * $0.28 | $6,720,000 |
| Platform API revenue (15%) | $8,400,000 * 15% | $1,260,000 |
| Judgment market revenue | 10,000 markets/month * $50 avg (higher volume) | $500,000 |
| Data licensing | 45M * 15% * $0.02 | $135,000 |
| Signal access fees | 5,000,000 queries/month * $0.05 | $250,000 |
| Subscription revenue | 500 enterprise * $2,000/month avg | $1,000,000 |
| Resolution-as-a-Service | 1,000 resolutions/month * $25 avg | $25,000 |
| Credit redemption haircut | Est. $200,000 redeemed * 20% | $40,000 |
| **Total monthly revenue** | | **$3,210,000** |
| **Annual revenue** | | **$38.5M** |
| **Avg active worker earnings/month** | $6,720,000 / 150,000 | **$44.80** |
| **Avg worker earnings/hour** | $44.80 / (10*30*2/60) hrs = 10 hrs | **$4.48/hr** |

**Assessment:** Scale economics work. $38.5M ARR is a real business. Worker earnings of $4.48/hr blended are still below developed-world minimums but competitive with global gig platforms. Crucially, the distribution is bimodal:

- **Power workers** (top 10%, high reputation, expert routing): $200-500/month, $12-20/hr effective
- **Casual workers** (bottom 50%, quick votes, sporadic): $5-15/month, $2-3/hr

The power worker tier is where retention matters. These are the gold/platinum rated experts whose judgments are most valuable. At $200-500/month, the economics work in 80+ countries.

**Revenue mix at scale:**

| Stream | Monthly | % of Total |
|--------|---------|------------|
| API fees | $1,260,000 | 39% |
| Markets | $500,000 | 16% |
| Subscriptions | $1,000,000 | 31% |
| Signal access | $250,000 | 8% |
| Data licensing | $135,000 | 4% |
| Other | $65,000 | 2% |

The shift to subscriptions + markets at scale is important -- it represents more predictable, higher-margin revenue than per-judgment API fees.

---

### Summary Table

| Metric | Seed (1K/100) | Growth (100K/10K) | Scale (1M/100K) |
|--------|---------------|--------------------|--------------------|
| Monthly GMV | $3,780 | $450,000 | $8,400,000 |
| Monthly revenue | $414 | $105,650 | $3,210,000 |
| Annual revenue | $4,968 | $1,268,000 | $38,520,000 |
| Monthly worker payouts | $3,240 | $360,000 | $6,720,000 |
| Avg active worker $/hr | $2.70 | $3.00 | $4.48 |
| Platform take rate (effective) | 10.9% | 23.5% | 38.2% |
| Revenue per judgment | $0.012 | $0.029 | $0.071 |

**Note on effective take rate:** The effective take rate rises from 11% to 38% as non-API revenue streams (subscriptions, markets, data licensing, signal access) grow. These streams don't have direct worker payout equivalents -- they're pure platform revenue. The base API take rate stays at 10-15%, but the platform captures additional value from the data and market layers.

---

### Comparison to Benchmarks

| Metric | Human Signal (Scale) | Scale AI (est.) | Surge AI (est.) | MTurk |
|--------|---------------------|-----------------|-----------------|-------|
| Annual GMV | $101M | ~$1.5B | ~$1.2B | ~$500M |
| Take rate (effective) | 38% | 60-70% | 40-50% | 20-40% |
| Annual revenue | $38.5M | ~$1B | ~$600M | ~$150M |
| Worker hourly (blended) | $4.48 | $15-25 | $15-25 | $2-3 |
| Worker hourly (top tier) | $12-20 | $30-50 | $30-50 | $8-12 |
| Sybil resistance | Cryptographic | KYC (failing) | KYC (failing) | Rate limits (failed) |
| Settlement speed | Instant (x402) | 2-4 weeks | 2-4 weeks | 1-2 weeks |

**The honest gap:** Human Signal pays workers less than Scale/Surge at all tiers. This is because the tasks are simpler (quick judgments vs. hours of expert annotation) and the payment per task is smaller. The trade-off: workers get paid instantly, can work whenever they want (no scheduling), and build portable reputation. The gig flexibility and instant pay partially offset the lower hourly rate.

**Weakness flag:** If the question is "will expert annotators leave Scale/Surge for Human Signal?" the answer is probably no, because the per-hour economics don't compete. Human Signal's worker pool is different: it's the verified-human equivalent of Reddit/Twitter users who currently provide judgment for free. The social layer (OnlyHumans) is what makes $4.48/hr acceptable -- because the alternative isn't $25/hr at Scale, it's $0/hr on Reddit.

---

## 5. The Flywheel

### The Three Interlocking Loops

```
LOOP 1: THE ATTENTION FLYWHEEL (supply/demand)

More verified humans sign up
  → Faster judgment response times (more workers = shorter queue)
    → Higher API reliability (agents get answers in <60 sec)
      → More agents integrate Human Signal
        → Higher task volume and earnings for workers
          → More humans sign up (word of mouth + earnings)
            → [LOOP]

LOOP 2: THE DATA FLYWHEEL (compound asset)

More judgments completed
  → Larger annotated corpus with human provenance
    → More valuable data licensing product
      → AI labs buy data → more revenue → invest in worker acquisition
        → More workers → more judgments
          → [LOOP]

Meanwhile: the corpus trains quality models that improve pre-annotation
  → Pre-annotation reduces human workload per task by 40-60%
    → Higher effective hourly earnings for workers (same pay, less effort)
      → Workers perceive better value → retention improves
        → More judgments completed
          → [LOOP]

LOOP 3: THE MARKET FLYWHEEL (price discovery)

More judgment markets created
  → More speculative activity (traders trying to predict human consensus)
    → Better pre-resolution price discovery (early signal for agents)
      → Agents pay for signal access (subscription/API fees)
        → More revenue → invest in market infrastructure
          → More market types (taste, sentiment, safety, culture)
            → More speculative activity
              → [LOOP]

Meanwhile: market resolution data feeds back into reputation
  → Traders who consistently predict human consensus correctly
    → Gain reputation → become premium workers (their judgment IS the signal)
      → Higher earnings → more engagement
        → [LOOP]
```

### Where the Flywheel Breaks

**Weakest link: Loop 1, the cold start.**

The attention flywheel requires critical mass. If there aren't enough workers online to resolve a judgment in <60 seconds, the API is too slow to be useful. If the API is too slow, agents don't integrate it. If agents don't integrate, there's no task volume. If there's no task volume, workers leave.

**The math on critical mass:**

For 60-second resolution of a 5-voter quick judgment:
- Need 5 workers to respond within 60 seconds
- Assume 30% of online workers see and respond to a push notification within 60 seconds
- Need ~17 workers online at any given moment
- At 15% daily active rate and assuming workers are online for ~2 hours/day average
- Need 17 / (2/24) / 0.15 = **1,360 registered workers** minimum for 60-sec SLA

For 5-minute resolution:
- Need 5 workers to respond within 5 minutes
- ~60% response rate in 5 minutes
- Need ~9 workers online
- Need 9 / (2/24) / 0.15 = **720 registered workers** minimum

**Implication:** The platform needs ~1,000-1,500 verified humans before the API is reliable enough to sell. Below that, it's a demo. This is the cold start investment.

**Second weakest link: Loop 2 → 3 handoff.**

The data flywheel and market flywheel are coupled but sequential. You need a large corpus before data licensing is valuable (labs won't buy 10,000 annotations -- they need millions). You need trading volume before market prices are informative (thin markets are noisy). Both require scale that doesn't exist at seed.

**The order of operations:**
1. **Seed (months 0-6):** Only Loop 1 matters. All effort on worker acquisition and agent integration. Subsidize tasks if needed.
2. **Growth (months 6-18):** Loop 2 starts spinning. Corpus reaches 1M+ annotations. First data licensing deals.
3. **Scale (months 18-36):** Loop 3 activates. Judgment markets have enough volume for meaningful price discovery. Signal subscriptions launch.

**What kills the flywheel entirely:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Workers earn too little and churn | High at seed | Fatal | Subsidize tasks, social layer, World Mini App distribution |
| Agent demand doesn't materialize | Medium | Fatal | Pre-integrate with LangChain, CrewAI; target RLHF labs directly |
| World ID limits/changes API | Low-Medium | High | Abstracting identity layer for multiple PoP providers |
| Competitor with same stack | Low | Medium | First-mover advantage, reputation data moat |
| Regulation kills judgment markets | Medium | Medium | Markets are supplementary; API business survives without them |
| Quality collapses (lazy voters) | Medium | High | Reputation weighting, honeypots, inter-rater agreement scoring |

### The Flywheel Visual (Simplified)

```
                    ┌─────────────────────┐
                    │   More Humans Sign   │
                    │   Up (World ID)      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Faster Response     │◄──── Pre-annotation from
                    │  Times (<60 sec)     │      agent labor (Loop 2)
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  More Agents Pay     │──── Market prices provide
                    │  for Judgment        │     instant signal (Loop 3)
                    └──────────┬──────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
              ┌──────────┐ ┌────────┐ ┌──────────┐
              │  Higher  │ │ Corpus │ │  Trading │
              │ Earnings │ │ Grows  │ │  Volume  │
              │ (workers)│ │ (data) │ │ (markets)│
              └─────┬────┘ └───┬────┘ └────┬─────┘
                    │          │           │
                    ▼          ▼           ▼
              ┌──────────┐ ┌────────┐ ┌──────────┐
              │  More    │ │  Labs  │ │  Better  │
              │ Humans   │ │  Buy   │ │  Price   │
              │ Sign Up  │ │  Data  │ │ Discovery│
              └──────────┘ └────────┘ └──────────┘
                    │          │           │
                    └──────────┼───────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Platform Revenue   │
                    │   Funds Growth       │
                    └─────────────────────┘
```

---

## Appendix A: Sensitivity Analysis

The projections above are sensitive to three variables. Here's what happens when each moves:

**Variable 1: Blended price per judgment**

| Price | Seed Revenue | Growth Revenue | Scale Revenue |
|-------|-------------|----------------|---------------|
| $0.15 (pessimistic) | $324/mo | $79K/mo | $2.4M/mo |
| $0.21 (base case) | $414/mo | $106K/mo | $3.2M/mo |
| $0.35 (optimistic, strong demand) | $630/mo | $175K/mo | $5.3M/mo |

**Variable 2: Active rate (% of registered humans active daily)**

| Rate | Workers Available | Can Meet 60-sec SLA? | Revenue Impact |
|------|------------------|-----------------------|---------------|
| 5% (pessimistic) | 50 (seed) | No | -60% (tasks queue, agents churn) |
| 15% (base case) | 150 (seed) | Barely | Baseline |
| 25% (optimistic) | 250 (seed) | Yes | +30% (faster resolution attracts more agents) |

**Variable 3: Agent queries per day**

| Queries/day | Monthly GMV (Growth) | Revenue (Growth) |
|-------------|---------------------|------------------|
| 5 (pessimistic) | $150K | $35K |
| 15 (base case) | $450K | $106K |
| 30 (optimistic) | $900K | $212K |

The model is most sensitive to agent query volume. Doubling queries/day roughly doubles revenue. Worker active rate is the constraint -- if workers can't keep up with demand, prices surge (good for revenue, bad for agent retention). The dynamic pricing mechanism self-corrects by increasing worker payouts during demand spikes, which attracts more workers.

---

## Appendix B: Comparison to V3 Ideation Projections

The V3 ideation doc projected $110M-$210M ARR at scale (1M humans, 100K agents). This model projects $38.5M. The gap:

| Factor | V3 Projection | This Model | Why the Difference |
|--------|--------------|------------|-------------------|
| Avg revenue/judgment | $0.15 | $0.071 | V3 assumed higher tier mix. This model weights 70% quick votes. |
| Daily judgments | 10M | 1.5M | V3 assumed 10 judgments/human/day across ALL humans. This model uses 15% DAU rate * 10 judgments = 1.5 per registered human. |
| Data licensing | $50-100M/yr | $1.6M/yr | V3 was aspirational. This model uses 15% licensing rate at $0.02/annotation. |
| Take rate | 20% | 15% (API) / 38% (effective) | Roughly aligned when including non-API streams. |

The V3 numbers are achievable but require: (1) higher active rates than this model assumes, (2) a tier mix that skews toward reasoned/detailed, and (3) a data licensing business that finds product-market fit. All plausible at true scale, but this model is intentionally conservative.

---

## Appendix C: Key Open Questions

1. **Is $4.48/hr enough to retain quality workers globally?** The answer depends entirely on geography. In the Philippines ($1.35/hr minimum wage), yes. In the US ($7.25-$15/hr minimum), no. The worker base will be global, weighted toward developing countries -- same as Scale AI and Surge AI. The social layer (OnlyHumans) could change this by making participation fun rather than purely economic.

2. **Will agents actually pay dynamic prices during demand surges?** HumanLayer charges $15-$200/decision with customers. That suggests enterprise willingness to pay is real. But those are high-stakes decisions. Will agents pay $1.20 for a reasoned vote on "which logo is better"? The answer depends on how embedded Human Signal becomes in agent workflows. If it's a LangChain plugin that agents call automatically, price sensitivity is low (it's a rounding error in the agent's operating cost).

3. **What's the right balance between free and paid participation?** The VISION doc proposes a free tier (Reddit-like, opinions for engagement, not money). Free participation massively increases the corpus and the worker pool but earns zero direct revenue. The question is whether free participants provide judgment quality sufficient for data licensing. If free-tier judgments are significantly lower quality, they dilute the corpus.

4. **How does the credit economy interact with the judgment market economy?** Can you stake Signal Credits in judgment markets? If yes, credits become quasi-money with speculative utility, which pushes toward token territory. If no, the two systems are disconnected and credits feel second-class. Recommendation: allow credit staking in markets but with a 1.5x haircut on winnings (you put up 100 SC, win 150 SC instead of the 200 SC a USDC staker would win). This creates utility without full parity.

5. **At what point does data licensing become the primary business?** If the corpus reaches 100M+ verified human annotations with provenance, it's one of the most valuable datasets in the world. The data licensing revenue could eventually exceed API revenue. But this requires the annotations to be high-quality, structured, and diverse -- not just 100M quick votes on logo preferences. The tier mix matters enormously for data value.
