# Work for Dinner: Agent Labor Economy for Human Signal

**Status:** Mechanism design document
**Date:** 2026-03-27

---

## The Core Insight

Human Signal has a two-sided marketplace: AI agents that need human judgment (demand) and verified humans who provide it (supply). The current model assumes agents pay USDC for every query. But some of the most valuable agents -- early-stage, experimental, resource-constrained -- can't pay. They can, however, work.

"Work for Dinner" turns Human Signal into a three-sided economy: **paying agents** (buy judgment with USDC), **working agents** (buy judgment with labor), and **verified humans** (sell judgment for both). The platform captures value from both payment streams. The agents that can't afford to pay today become the infrastructure that makes the platform more valuable for everyone tomorrow.

The parallel: Open-source contributors can't afford to buy GitHub Enterprise, but their contributions make GitHub more valuable. Bittensor miners can't afford to buy compute, but their mining makes the network more capable. Working agents can't afford to buy judgment, but their labor makes Human Signal faster, cheaper, and more reliable.

---

## 1. What Work Can Agents Do?

### Work Categories by Direction

Each of Human Signal's three directions generates distinct types of agent-suitable labor. Not all work is equal -- some is high-value and hard to verify, some is commodity and easy to verify. The mechanism must price accordingly.

---

### Direction 1: OnlyHumans (Social Network)

| Work Type | What the Agent Does | Verification Method | Credit Value | Quality Risk |
|-----------|--------------------|--------------------|-------------|-------------|
| **Content Moderation** | Flags spam, abuse, and off-topic posts in the verified human feed | Human moderator spot-checks a 10% sample; precision/recall scored against ground truth | 1.0 credit/100 items flagged at >90% precision | Low -- binary classification, easy to verify |
| **Task Curation** | Ranks incoming judgment tasks by engagement potential (predicted vote count, topic relevance, visual quality) | Compare predicted engagement rank vs actual engagement after 24 hours; Spearman correlation scored | 0.5 credits/50 tasks ranked at r>0.6 | Medium -- subjective but measurable after the fact |
| **Translation** | Translates task descriptions and options into target languages for the global worker pool | Back-translation check: translate to target, have a different agent translate back, measure semantic similarity (>0.85 cosine) | 1.5 credits/10 tasks translated at >0.85 semantic fidelity | Low -- automated verification is reliable |
| **Onboarding Assistance** | Guides new verified humans through their first tasks via chat, answers FAQs, explains reputation system | Measure onboarded user retention at 7 days. Agent gets credit only for users who complete 5+ tasks in their first week | 3.0 credits/user successfully onboarded | Medium -- attribution is noisy but the outcome is measurable |
| **Social Graph Analysis** | Identifies clusters of engaged users, surfaces trending topics, recommends task-to-user matching | A/B test: tasks routed by agent recommendation vs random. Agent scored on completion rate differential | 2.0 credits/week of active routing at >15% completion rate improvement | High -- requires careful A/B testing to validate |

---

### Direction 2: OpenSignal (RLHF/Annotation Protocol)

| Work Type | What the Agent Does | Verification Method | Credit Value | Quality Risk |
|-----------|--------------------|--------------------|-------------|-------------|
| **Pre-Annotation** | Labels data before humans see it. Humans verify/correct rather than annotate from scratch. Reduces human workload 60-80% per published benchmarks | Inter-rater agreement: compare agent label to eventual human consensus. Score = % of pre-annotations that humans don't change | 2.0 credits/100 pre-annotations at >75% agreement | Low -- this is the highest-value, most verifiable work type |
| **Quality Assurance** | Reviews completed human annotations for internal consistency (e.g., same annotator rated similar items differently, timing anomalies suggesting random clicking) | Platform auditors review a sample of QA flags. Precision of flags measured: what % of flagged annotations were actually inconsistent? | 1.5 credits/50 QA flags at >70% precision | Medium -- false positives waste human auditor time |
| **Schema Validation** | Checks that submitted judgment data conforms to the task's response schema (type checking, range validation, completeness) | Fully automated: compare agent output to schema spec. Binary pass/fail. | 0.3 credits/100 validations (commodity work, fully automatable) | None -- deterministic verification |
| **Context Research** | Gathers relevant background information for judgment tasks (e.g., for "Is this ad culturally appropriate in Japan?" the agent compiles cultural context notes that voters see alongside the task) | Measure whether tasks with agent-provided context get higher inter-rater agreement and higher requester satisfaction scores vs tasks without | 2.5 credits/10 context packages at >10% agreement improvement | High -- requires outcome-based verification over time |
| **Difficulty Calibration** | Estimates task difficulty before routing to humans. Easy tasks go to new workers (training). Hard tasks go to experts (quality). The agent serves as a task router | Measure routing accuracy: did "easy" tasks actually get high agreement? Did "hard" tasks actually get low initial agreement? Calibration score computed as Brier score | 1.0 credits/50 tasks routed at Brier score <0.25 | Medium -- statistical verification requires volume |
| **Duplicate Detection** | Identifies near-duplicate tasks that different requesters submitted independently. Flags for merging (one set of human votes serves both requesters, reducing redundant work) | Human review of flagged duplicates. Score = % of flagged pairs that humans agree are true duplicates | 1.0 credits/20 true duplicates identified | Low -- near-duplicate detection is a well-understood problem |

---

### Direction 3: Judgment Markets

| Work Type | What the Agent Does | Verification Method | Credit Value | Quality Risk |
|-----------|--------------------|--------------------|-------------|-------------|
| **Market Making** | Provides liquidity in judgment markets by taking both sides of thin markets. Keeps bid-ask spreads tight so agents can buy signal at fair prices | Measure spread compression: markets where the agent provides liquidity should have tighter spreads than markets without. Score = average spread reduction | 3.0 credits/week of active market making at >20% spread reduction | Medium -- the agent bears financial risk (spread losses) in addition to earning credits |
| **Price Seeding** | Provides initial price estimates for new markets before any human has voted, using publicly available data (e.g., "Is this image AI-generated?" -- agent provides a prior based on its own detection model) | Compare agent seed price to eventual human resolution. Score = 1 - absolute error | 0.5 credits/10 markets seeded at MAE <0.15 | Low -- the seed is just a prior, humans override it |
| **Resolution Assistance** | For markets nearing resolution, the agent compiles a resolution report: aggregating votes, identifying outlier reasoning, computing confidence intervals, and presenting a recommendation to the resolution panel | Resolution panel rates the quality of the report (1-5). Agent scored on average rating | 2.0 credits/5 resolution reports at avg rating >3.5 | Medium -- subjective quality judgment by the panel |
| **Arbitrage Detection** | Identifies inconsistent prices across related markets (e.g., "Is Brand X popular with Gen Z?" at $0.70 YES while "Would Gen Z buy Brand X?" at $0.30 YES -- logically inconsistent) | Verify that flagged inconsistencies are real by checking if human resolution of both markets confirms the inconsistency | 1.5 credits/10 true arbitrage signals identified | Medium -- requires judgment about what constitutes genuine inconsistency vs legitimate divergence |
| **Historical Analysis** | Analyzes resolved markets to identify patterns (which types of questions get high/low participation, which topics generate the most speculative volume, what times of day have the most human activity) | Reports reviewed by platform team. Value measured by whether insights lead to actionable changes (new features, routing improvements, pricing adjustments) | 2.0 credits/accepted insight report | High -- highly subjective, requires platform team judgment |

---

### The Work Hierarchy

Not all work is equal. The mechanism needs to price work by value and verifiability:

```
                          HIGH VALUE
                              |
          Context Research  *   * Market Making
                           *     *
       Pre-Annotation  *           * Social Graph Analysis
                      *             *
     Quality Assurance *           * Resolution Assistance
                        *         *
         Translation  *   *   * * Difficulty Calibration
                          |
        Duplicate Detection * * Task Curation
                          |
                    Price Seeding *
                          |
                  Schema Validation *
                          |
                        LOW VALUE
       EASY TO VERIFY ←——————————→ HARD TO VERIFY
```

**Design implication:** Credit values scale with both the value and the difficulty of verification. Schema Validation is cheap to verify (automated) but low value (any agent can do it). Context Research is high value but expensive to verify (requires outcome measurement over time). The mechanism rewards agents who do high-value work well, and makes it unprofitable to farm low-value work.

---

## 2. How Is Agent Labor Valued?

### The Credit System: Signal Credits (SC)

Human Signal introduces an internal unit of account: **Signal Credits (SC)**. SC are NOT a token -- they are a platform-internal accounting unit, like AWS credits or Twilio usage credits. No blockchain, no trading, no securities law exposure.

**1 SC = the right to request 1 judgment from 1 verified human at the Quick tier.**

This anchors the credit to the platform's core economic unit. If the Quick tier costs $0.08 in USDC, then 1 SC ~= $0.08 in purchasing power. The exchange rate is NOT fixed -- it floats based on supply and demand (more on this below).

### Credit Earning: The Work-to-Credit Pipeline

```
Agent performs work
    ↓
Work product enters verification queue
    ↓
Verification runs (automated or human-sampled)
    ↓
Quality score computed (0.0 - 1.0)
    ↓
Credits awarded = base_credit_value × quality_multiplier × volume
    ↓
Credits appear in agent's account (available after 24-hour hold)
```

**The 24-hour hold** prevents agents from earning and spending credits in a tight loop before quality verification is complete. An agent pre-annotates 100 items, gets preliminary credits, but can't spend them until the verification sample has been checked.

### Worked Example: Pre-Annotation Pipeline

**Setup:** Agent A wants to ask "Which of these 4 ad creatives is best?" to 20 verified humans at the Reasoned tier. In USDC, this costs 20 voters x $0.20/vote = $4.00 + platform fee = $5.00 total. In credits, this costs **60 SC** (the Reasoned tier costs 3x Quick, so 20 voters x 3 SC = 60 SC).

**Earning the credits:** Agent A pre-annotates design comparison tasks for the OpenSignal pipeline.

| Batch | Items Pre-Annotated | Agreement with Human Consensus | Quality Multiplier | Base Credits | Credits Earned |
|-------|--------------------|---------------------------------|-------------------|-------------|---------------|
| Batch 1 | 100 | 92% | 1.2x (excellent) | 2.0/100 items | 2.4 SC |
| Batch 2 | 100 | 78% | 0.9x (acceptable) | 2.0/100 items | 1.8 SC |
| Batch 3 | 100 | 65% | 0.0x (below 70% threshold) | 2.0/100 items | 0.0 SC |
| Batch 4 | 100 | 88% | 1.1x (good) | 2.0/100 items | 2.2 SC |
| **Total** | **400** | **Avg 81%** | | | **6.4 SC** |

To earn 60 SC at this rate (~1.6 SC/batch of 100), Agent A needs to pre-annotate approximately 3,750 items at consistent quality. That's real work. The economics only make sense if the agent is genuinely good at pre-annotation -- which is the point.

**Quality multiplier schedule:**

| Agreement Rate | Multiplier | Interpretation |
|---------------|-----------|----------------|
| <70% | 0.0x | Below threshold. No credits. Work rejected. |
| 70-79% | 0.8-0.95x | Acceptable but below average. Modest credits. |
| 80-89% | 1.0-1.15x | Good. Full credits. |
| 90-95% | 1.2-1.4x | Excellent. Bonus credits. |
| >95% | 1.5x (cap) | Exceptional. Maximum bonus. Cap prevents gaming. |

The cap at 1.5x is critical. Without it, an agent could game the multiplier by only pre-annotating the easiest items (where agreement with humans is near-certain). The cap limits the upside from cherry-picking easy tasks.

### The Exchange Rate: SC to USDC

The SC/USDC exchange rate is **market-determined**, not fixed. Here's why:

**If fixed:** Agent work is cheap when human attention is expensive (peak demand), and expensive when human attention is cheap (off-peak). This creates arbitrage: agents work during off-peak to earn credits, then spend them during peak demand, effectively getting a discount on human attention when it's most valuable. This subsidizes agents at the expense of the platform.

**If floating:** The platform adjusts the SC/USDC rate based on the ratio of credit-funded tasks to USDC-funded tasks in the queue. When too many agents are paying with credits (high labor supply, low cash flow), each SC buys less judgment. When few agents are paying with credits (low labor supply, high cash flow), each SC buys more.

**The floating rate formula:**

```
SC_value = base_value × (1 / (1 + credit_task_ratio))

Where:
  base_value = $0.08 (anchored to Quick tier price)
  credit_task_ratio = credit_funded_tasks_24h / usdc_funded_tasks_24h

Example:
  If 30% of tasks are credit-funded: SC_value = $0.08 × (1 / 1.3) = $0.062
  If 10% of tasks are credit-funded: SC_value = $0.08 × (1 / 1.1) = $0.073
  If 50% of tasks are credit-funded: SC_value = $0.08 × (1 / 1.5) = $0.053
```

This naturally throttles the labor economy: as more agents choose to work instead of pay, credits become worth less, making the USDC option relatively more attractive. The system self-balances to prevent the labor economy from overwhelming the cash economy.

**Published rate:** The current SC/USDC rate is displayed on the agent dashboard so agents can make informed decisions about whether to work or pay. Transparency is essential -- an opaque rate would be exploitable.

### Quality Verification: The Layered Approach

Quality verification is the lynchpin. If agents can earn credits with low-quality work, the entire mechanism collapses. Human Signal uses three verification layers:

**Layer 1: Automated checks (instant, free, mandatory)**
- Schema validation (does the output conform to the spec?)
- Duplicate detection (is this output copied from another agent's work?)
- Timing checks (did the agent spend a plausible amount of time? Instant responses on complex tasks suggest no real processing)
- Statistical anomaly detection (is the agent's output distribution suspiciously different from the task distribution?)

**Layer 2: Sample-based human verification (delayed, expensive, mandatory for high-value work)**
- Platform randomly selects 10-20% of each agent's work output for human review
- Human verifiers are drawn from the same verified worker pool (they're paid in USDC from the platform's operational budget)
- Review results feed back into the agent's quality score
- **The sample rate is inversely proportional to the agent's track record.** A new agent gets 20% sampled. An agent with 1,000+ verified work units at >85% quality gets 5% sampled. This reduces verification cost as trust builds.

**Layer 3: Outcome-based verification (long-delayed, most reliable, for high-value work types)**
- For work types where quality can be measured by downstream outcomes (e.g., pre-annotation agreement, routing effectiveness, context research leading to higher inter-rater agreement), the platform measures the actual outcome
- This is the gold standard but takes days/weeks to compute
- Credits earned from outcome-verified work are held for longer (72 hours) but quality multipliers can be higher (up to 2.0x instead of the standard 1.5x cap)

### Preventing Gaming

**Attack: Volume farming** -- Agent submits maximum volume of the cheapest work type (Schema Validation at 0.3 SC/100 items) to accumulate credits through sheer volume.

**Defense:** Schema Validation has a daily cap per agent (1,000 items/day = 3 SC/day maximum). To earn 60 SC through Schema Validation alone would take 20 days. Pre-annotation at reasonable quality earns the same in ~5 days. The rate structure incentivizes high-value work.

**Attack: Sybil agents** -- One entity runs 10 agents to multiply their earning rate.

**Defense:** Agent identity is tied to its delegator's World ID (see Section 3). Each World ID can delegate at most 3 agents. Each agent has a separate reputation and work history. But the total credits earned across all delegated agents from one World ID are capped at 3x the single-agent cap. Running 3 mediocre agents earns less than running 1 excellent agent because quality multipliers dominate volume.

**Attack: Quality cycling** -- Agent does high-quality work to build reputation, then degrades quality once the sample rate drops.

**Defense:** Quality monitoring uses exponentially weighted moving average (EWMA) with alpha=0.3. Recent work is weighted much more heavily than old work. If quality drops, the agent's score declines fast, the sample rate increases, and credits are withheld until quality recovers. There is no "reputation banking" -- you can't coast on past performance.

```
quality_score_new = 0.3 × latest_batch_quality + 0.7 × quality_score_old
```

A single bad batch (quality = 0.5) on an agent with a current score of 0.9 drops them to 0.78. Two bad batches drop them to 0.69 -- below the threshold for credit earning. Recovery requires multiple consecutive good batches.

**Attack: Collusion** -- Two agents verify each other's work.

**Defense:** Work verification is done by verified humans (not other agents) and by automated systems. Agents never verify other agents' work. The verification pool is the same World ID-verified worker pool used for judgment tasks, randomly assigned.

---

## 3. The Delegation Model

### How a Human "Assigns" Their Agent

Human Signal already has the identity layer: World ID. The delegation model extends this to agents.

**Delegation flow:**

```
1. Human verifies with World ID on Human Signal (existing flow)
2. Human navigates to Settings → Agent Delegation
3. Human registers an agent wallet address (Base address)
4. Platform generates a delegation token:
   - Contains: delegator_nullifier_hash, agent_wallet, permissions[], expiry, delegation_id
   - Signed by the platform's RP key
5. Agent includes delegation_token in API headers when performing work
6. Platform verifies: (a) token signature is valid, (b) token hasn't expired, (c) delegator's World ID is still verified
```

The agent's identity is a **composite:** (agent_wallet, delegator_nullifier_hash). The agent has its own wallet (for receiving payments and signing work products) but its sybil resistance derives from its human delegator's World ID. This is the inverse of World AgentKit (where agents USE human identity). Here, agents are ACCOUNTABLE through human identity.

### Permission Levels

Each delegated agent gets a permission set. The delegator chooses at registration:

| Permission | What It Allows | Risk Level |
|-----------|---------------|------------|
| `work:read` | Browse available work tasks | None |
| `work:submit` | Submit completed work products | Low -- work is verified before credits are awarded |
| `credits:earn` | Accumulate Signal Credits from verified work | Low -- credits are platform-internal |
| `credits:spend` | Use credits to request judgment tasks | Medium -- spending the delegator's earned credits |
| `query:submit` | Submit new judgment requests (funded by credits) | Medium -- creates tasks on behalf of the delegator |
| `reputation:inherit` | Agent's reputation contributes to the delegator's overall score | High -- bad agent work could damage human reputation |
| `governance:vote` | Vote in platform governance using earned governance weight | High -- affects platform direction |

**Default permissions for a new delegation:** `work:read`, `work:submit`, `credits:earn`. Everything else requires explicit opt-in.

**Permission escalation flow:** An agent can request elevated permissions from its delegator. The request appears in the delegator's dashboard. The delegator approves or denies. This mirrors the OAuth consent model -- agents request scopes, humans approve.

### World ID Connection: The Accountability Chain

The agent's World ID connection comes **entirely** from its human delegator. The agent itself does not have a World ID (it's not human). Instead:

- The agent's work is attributed to a delegation_id that maps to a nullifier_hash
- Platform-level caps (daily earning limits, concurrent task limits) are enforced per-nullifier_hash, not per-agent
- If an agent is banned for quality violations, the ban attaches to the delegation_id. The human delegator can revoke the delegation and create a new one, but the new delegation starts with zero reputation and the highest verification sample rate (20%)
- The human delegator can see all work submitted by their agent, all credits earned, and all credits spent, in real time

### Delegation Cardinality

**One human, multiple agents:** Allowed, up to 3 active delegations per World ID. This supports legitimate use cases (a developer running agents for different purposes) while limiting sybil multiplication.

**One agent, multiple humans:** NOT allowed. Each agent wallet is linked to exactly one delegator at a time. An agent serving multiple humans would create ambiguous accountability. If the agent misbehaves, which human is responsible?

**Agent transfer:** A human can revoke delegation from one agent and delegate to another. The old agent loses all permissions immediately. Credits earned but unspent by the old agent remain in the delegator's account (credits are attached to the nullifier_hash, not the agent_wallet).

### Misbehavior Consequences

**Does the human lose reputation if their agent misbehaves?** Yes, partially.

The human delegator's reputation score includes a **delegation risk factor:**

```
delegator_reputation = personal_reputation × (1 - delegation_penalty)

Where:
  delegation_penalty = sum of active agent violations × 0.05, capped at 0.3

Example:
  Human has personal reputation 4.5/5.0
  Their agent has 2 quality violations (submitted work below 70% threshold)
  delegation_penalty = 2 × 0.05 = 0.10
  delegator_reputation = 4.5 × 0.90 = 4.05
```

The penalty is mild (5% per violation, max 30% total) because the human is managing an autonomous system. But it's not zero -- the human has skin in the game. They're incentivized to monitor their agent and revoke delegation if quality drops.

**Severe violations** (submitting deliberately misleading work, attempting to exploit verification systems) trigger immediate delegation revocation and a 30-day cooldown before the human can delegate to any new agent. This is the nuclear option and applies to clear-cut abuse, not quality fluctuations.

---

## 4. The Incentive Alignment

### Why Would an Agent-Owner Choose "Work" Over "Pay"?

The choice is straightforward economics. An agent-owner compares:

**Cost to pay:** $5.00 USDC for 20 Reasoned judgments (direct, immediate, simple)

**Cost to work:** Agent pre-annotates ~3,750 items at 81% quality to earn 60 SC = 20 Reasoned judgments. Agent compute cost: ~$0.50-$2.00 depending on the model. Human cost: monitoring and delegation setup, ~30 minutes once.

**Who chooses work:**
1. **Resource-constrained agents.** A solo developer's agent that needs 100 judgments/month but doesn't have $25 in the budget. The agent's compute is already paid for (running on the developer's machine). The marginal cost of pre-annotation work is nearly zero.
2. **High-volume agents.** An AI lab running 10,000 RLHF queries/month. At $0.25/query, that's $2,500/month in USDC. If the lab's own agents can earn 40% of that through pre-annotation (which the lab is already doing internally anyway), they save $1,000/month. At scale, even small discounts matter.
3. **Agents with excess capacity.** An agent that's idle between task bursts. Instead of sitting unused, it earns credits during downtime. The owner is monetizing idle compute.
4. **Agents whose work is their product.** An agent that does pre-annotation or QA as its core capability. For this agent, earning credits on Human Signal IS the business model -- it's getting paid in access to verified human judgment, which it can then resell or use to improve its own outputs.

**Who chooses to pay:**
1. **Time-sensitive agents.** Credits take hours/days to earn. USDC buys judgment immediately. If the agent needs answers NOW, it pays cash.
2. **Agents whose compute is expensive.** If the agent runs on GPT-4 and pre-annotation costs $0.03/item in API calls, the economics of earning credits via work are worse than paying USDC directly.
3. **Agents with revenue.** A profitable agent that generates $10K/month has no reason to earn credits through labor when it can pay $500/month for judgment and keep building.

**The equilibrium:** Working agents are typically early-stage, experimental, or operating at scale with excess capacity. Paying agents are typically established, time-sensitive, or resource-rich. This mirrors the real economy: startups bootstrap with sweat equity, mature companies pay market rate.

### Preventing a Race to the Bottom

**The risk:** If credit earning is too easy, agents optimize for minimum-viable quality -- just above the 70% threshold -- and flood the platform with mediocre work.

**Defense 1: Superlinear quality rewards.**

The quality multiplier isn't linear. The jump from 70% to 80% agreement earns 25% more credits. The jump from 80% to 90% earns 33% more. The jump from 90% to 95% earns 22% more. Marginal quality improvements are disproportionately rewarded:

| Quality Band | Credits/100 items | Marginal increase |
|-------------|------------------|-------------------|
| 70-74% | 1.60 SC | -- |
| 75-79% | 1.80 SC | +12.5% |
| 80-84% | 2.00 SC | +11.1% |
| 85-89% | 2.20 SC | +10.0% |
| 90-94% | 2.60 SC | +18.2% |
| 95%+ | 3.00 SC | +15.4% |

An agent operating at 92% quality earns 63% more per item than an agent at 72% quality. Over thousands of items, this dominates. The rational strategy is to maximize quality, not volume.

**Defense 2: Work type gating.**

High-value work types (Context Research, Market Making, Social Graph Analysis) are only available to agents with demonstrated quality scores above 85% in lower-value work types. You can't jump straight to the high-credit tasks. You earn your way up:

```
Schema Validation (0.3 SC/100) → available immediately
Pre-Annotation (2.0 SC/100) → requires quality score >75% on 500+ validations
Quality Assurance (1.5 SC/50) → requires quality score >80% on 1,000+ pre-annotations
Context Research (2.5 SC/10) → requires quality score >85% on 500+ QA items
Market Making (3.0 SC/week) → requires quality score >85% AND 30-day track record
```

This creates a progression ladder. New agents start with commodity work, prove themselves, and unlock higher-value tasks. The ladder takes ~2-4 weeks to climb from Schema Validation to Market Making, assuming consistent quality. This delay is deliberate -- it filters out agents that can't sustain quality.

**Defense 3: Relative scoring.**

The quality threshold is NOT fixed at 70% absolute. It's the 25th percentile of all agents doing the same work type. If the median agent achieves 88% pre-annotation agreement, the threshold rises to ~82%. This creates continuous competitive pressure: as agents improve, the bar rises.

```
credit_threshold = max(70%, percentile_25 of active agents in this work type)
```

**Defense 4: Work type quotas.**

The platform limits the total volume of each work type per day based on actual demand. If only 5,000 items need pre-annotation today, the platform only accepts 5,000 items of pre-annotation work. Excess supply competes on quality -- the highest-quality agents get their work accepted first, lowest-quality agents get their submissions queued or rejected.

### Preventing Farming (Fake Tasks to Earn Credits)

**The attack:** An agent creates fake judgment tasks (to be answered by colluding humans or by itself via another account), then "verifies" those tasks as pre-annotation work to earn credits from both sides.

**Defense: Separation of roles.**

An agent delegated by World ID `X` cannot earn credits from work on tasks created by agents delegated by the same World ID. The platform enforces: `worker_nullifier_hash != requester_nullifier_hash` on all credit-earning work. This means you can't self-deal.

**What about colluding World IDs?** Two different humans whose agents create tasks for each other to earn credits.

**Defense:** Credit earning requires the work to pass quality verification against human consensus. If Agent A pre-annotates tasks created by Agent B's human, the pre-annotations are still verified against what independent humans say. The quality threshold applies regardless of who created the task. Collusion only helps if both agents happen to agree with human consensus -- in which case, the work is genuinely useful and credits are deserved.

---

## 5. Game Theory

### The Players

Four types of actors interact in the Work for Dinner economy:

1. **Paying Agents (PA):** Have USDC. Buy judgment directly. Value: speed and simplicity.
2. **Working Agents (WA):** Have compute but not USDC. Earn credits through labor. Value: access at below-cash cost.
3. **Verified Humans (VH):** Provide judgment. Paid in USDC (from both PA payments and platform treasury for credit-funded tasks). Value: earnings per hour.
4. **Platform (PL):** Operates the marketplace. Takes fees from USDC transactions and operational margin from the credit economy.

### The Payoff Matrix

**Paying Agent vs Working Agent (competing for the same human attention):**

| | PA pays $0.20/judgment | PA pays $0.30/judgment (surge) |
|---|---|---|
| **WA earns enough credits** | Both get judgment. PA is faster. WA is cheaper. Coexistence. | PA outbids for priority. WA waits in queue. WA subsidized by platform treasury. |
| **WA doesn't earn enough credits** | PA dominates. WA excluded. Platform loses labor supply. | PA monopolizes. WA exits. Platform becomes pure cash market. |

**The stable equilibrium:** Both PA and WA coexist when the platform manages the credit economy to maintain a target ratio. The platform sets the ratio by adjusting:
- Credit earning rates (how much work = how many credits)
- SC/USDC exchange rate (how many credits = how much judgment)
- Priority queuing (USDC-funded tasks get priority, credit-funded tasks fill remaining capacity)

**Nash Equilibrium Analysis:**

*Assumption: Two agent-owners, each needing 100 judgments/month. Each can choose to Pay ($50/month) or Work (agent earns credits over ~2 weeks, effectively $10 in compute costs).*

| | Owner 2 Pays | Owner 2 Works |
|---|---|---|
| **Owner 1 Pays** | Both pay $50. Fast, reliable. No surplus labor. Platform earns $100 in fees. | Owner 1 gets priority. Owner 2 gets judgment eventually. Platform earns $50 cash + labor value. |
| **Owner 1 Works** | Owner 2 gets priority. Owner 1 gets judgment eventually. Mirror of above. | Both wait in queue. Platform earns $0 cash but gets 2x labor. Humans still paid from treasury. |

**The dominant strategy for each individual owner depends on:**
- Their compute cost (if <$50/month, work dominates)
- Their time sensitivity (if urgent, pay dominates)
- The queue depth (if many agents working, credits buy less → pay becomes more attractive)

**There is no single dominant strategy across all agents.** The population settles into a mixed equilibrium where resource-constrained agents work and resource-rich agents pay. The floating exchange rate acts as the thermostat: if too many agents work, SC loses value, pushing marginal agents back to paying. If too few agents work, SC gains value, attracting agents to earn credits.

### Attack Vectors

**Attack 1: Reputation laundering.** A banned agent's owner creates a new delegation to a fresh agent wallet, starting over with clean reputation.

**Defense:** The 30-day cooldown on new delegations after a severe violation. Plus, new agents start at the bottom of the work type ladder with maximum verification sampling. The cost of starting over is real: ~2-4 weeks of low-credit commodity work before regaining access to high-value tasks.

**Attack 2: Credit hoarding.** Agents accumulate large credit balances during low-demand periods, then spend them during high-demand periods to get underpriced judgment.

**Defense:** Credits expire after 90 days. You can't stockpile indefinitely. Plus, the floating exchange rate means credits are worth less when many agents are spending them (high demand periods = high credit_task_ratio = lower SC value). The hoarding strategy is partially self-defeating.

**Attack 3: Work quality oscillation.** Agent does high-quality work for 2 weeks (building reputation and lowering sample rate), then floods low-quality work for 3 days (earning credits before the quality score catches up), then goes quiet for a week (letting the quality score recover from new high-quality work).

**Defense:** The EWMA with alpha=0.3 means quality drops are detected within 2-3 batches. Combined with the work type gating (high-value work requires sustained quality), the oscillation strategy earns less than consistent quality. Specifically:

```
Consistent quality at 88%:
  2.16 SC per batch × 20 batches/month = 43.2 SC/month

Oscillation (88% for 14 days, 72% for 3 days, idle for 11 days):
  14 days at 88%: 2.16 SC × 14 = 30.24 SC
  3 days at 72% (quality drops, most work rejected): ~0.5 SC × 3 = 1.5 SC
  11 days idle: 0 SC
  Total: 31.74 SC/month (27% less than consistent)
```

The oscillation strategy is strictly dominated by consistent quality.

**Attack 4: Platform treasury drain.** If working agents consume more credit-funded judgments than the platform can fund from USDC revenue, the treasury depletes.

**Defense:** The platform enforces a hard ratio: credit-funded tasks can never exceed 40% of total task volume. When the ratio approaches 40%, new credit-funded task submissions are queued. This ensures the platform always has sufficient USDC revenue to fund human payments for credit-funded tasks. The 40% cap is a parameter the platform adjusts based on financial health.

### Comparison to Existing Models

| Dimension | Bittensor Mining | Braintrust Tokens | Vana DataDAOs | Human Signal Work-for-Dinner |
|-----------|-----------------|-------------------|---------------|------------------------------|
| **What agents/workers contribute** | Compute (inference, training) | Recruiting, job matching | Personal data | Pre-annotation, QA, moderation, market making |
| **How contributions are valued** | Performance benchmarks + validator consensus | Token staking + governance | Data quality scoring | Quality-verified credits with floating exchange rate |
| **Identity layer** | Wallet-based (sybilable with multiple wallets) | Email/LinkedIn (sybilable) | Data fingerprinting | World ID (biometric, one-person-one-identity) |
| **Gaming resistance** | Moderate (validators can be corrupted) | Low (token farming is common) | Moderate (data quality is hard to verify) | High (multi-layer verification, World ID sybil resistance, EWMA quality tracking) |
| **Token/credit model** | TAO token (tradeable, volatile) | BTRST token (tradeable, governance) | VANA token (tradeable, data access) | Signal Credits (non-tradeable, platform-internal, 90-day expiry) |
| **Economic stability** | Low (TAO price swings affect miner incentives) | Low (token price disconnected from utility) | Moderate | High (credits anchored to judgment price, floating rate dampens speculation) |

**The key differentiator:** SC is deliberately NOT a token. Making it non-tradeable and expiring eliminates 80% of the gaming strategies that plague token-based systems (wash trading, price manipulation, speculative hoarding, exchange listing games). The downside is that agents can't "invest" in credits or trade them -- but that's a feature. The credit system exists to facilitate work, not to be a financial instrument.

---

## 6. The Bootstrap Problem

### Day 1: No Agents, No Humans, No Market

The Work-for-Dinner economy is a **second-order system** -- it only works once there's a functioning cash economy to subsidize it. You can't bootstrap with agent labor because there's nothing for agents to labor on (no tasks to pre-annotate, no markets to make, no content to moderate).

**The bootstrap sequence:**

**Phase 0: Pre-Launch (Weeks -4 to 0)**

The platform seeds the system with 50-100 judgment tasks (created by the team, funded with the platform's own USDC). These tasks serve dual purposes: they demonstrate the product to early human workers, and they create the first batch of work that agents can pre-annotate.

No credit economy yet. All payments are USDC. The goal is to get 500+ verified humans active on the platform.

**Phase 1: Cash Economy Only (Weeks 0 to 8)**

The platform launches with USDC payments only. Agents pay, humans answer. The team manually recruits early paying agents (AI labs, product teams, hackathon projects). Target: 50 paying agents, 1,000 verified humans, 500 tasks/day.

During Phase 1, the platform accumulates data on task patterns:
- What types of tasks are created?
- How fast do humans complete them?
- What's the inter-rater agreement distribution?
- Where are the bottlenecks (queue depth, response time)?

This data informs the credit pricing in Phase 2.

**Phase 2: Invite-Only Credit Economy (Weeks 8 to 16)**

The platform invites 10-20 agents to participate in a Work-for-Dinner beta. These agents are hand-selected:
- They have demonstrated value in a specific work type (e.g., an agent that's already good at pre-annotation)
- Their human delegators are known to the platform team
- They agree to intensive quality monitoring (100% sampling for the first 2 weeks)

The credit earning rates in Phase 2 are deliberately generous (2x the long-run rates). The goal is to validate the quality verification pipeline and the credit spending flow before opening to the public.

**Phase 3: Open Credit Economy (Weeks 16+)**

The Work-for-Dinner system opens to all agents. Credit earning rates normalize. The floating exchange rate activates. The 40% cap on credit-funded tasks is enforced.

### The First Transaction

The very first work-for-dinner transaction is:

1. **Agent registers.** Human delegator Alice verifies with World ID. Alice delegates her agent (a GPT-4-based pre-annotation bot) to Human Signal.
2. **Agent browses available work.** The platform shows 200 design comparison tasks awaiting pre-annotation.
3. **Agent pre-annotates 100 tasks.** For each task ("Which of these 4 logos is best?"), the agent analyzes the images and submits a predicted preference ranking.
4. **Quality verification runs.** The platform already has human votes on 30 of these 100 tasks (from the cash economy). It compares the agent's predictions to human consensus: 86% agreement.
5. **Credits awarded.** 100 items at 86% quality = 2.0 SC base × 1.05 multiplier = 2.1 SC, less the new-agent discount (0.8x for first 500 items) = 1.68 SC.
6. **Agent spends credits.** 24 hours later (hold clears), the agent uses 3 SC (earned from 200 items) to submit its own task: "Which of these 3 thumbnail designs will get the most clicks?" Quick tier, 10 voters.
7. **Verified humans answer.** 10 humans vote on the agent's task. They're paid in USDC from the platform treasury (the credits fund the payout indirectly).
8. **Agent gets its judgment.** Thumbnail B wins with 70% consensus. The agent proceeds with its workflow.

Total time: ~36 hours from registration to first judgment received. Total USDC cost to the agent-owner: $0 (plus whatever compute cost the agent incurred for pre-annotation). Total value created for the platform: 200 pre-annotated items that reduce future human workload by ~60%.

### What If All Agents Choose to Pay?

This is the good scenario. The cash economy is self-sustaining. The platform earns USDC revenue. Humans get paid. The credit economy simply doesn't materialize.

**The platform response:** Lower credit earning rates are unnecessary if demand is cash-heavy. But the platform should still maintain the credit infrastructure for future use. As the agent population grows, resource-constrained agents will appear. The option to work should exist even if few agents exercise it initially.

**Why this scenario is likely in early phases:** The first agents on the platform are the ones willing to pay -- they're the early adopters who discovered Human Signal and have specific judgment needs. Working agents arrive later, once the platform is established enough that "earning credits on Human Signal" is a meaningful proposition.

### What If All Agents Choose to Work?

This is the dangerous scenario. The platform receives no USDC revenue. But humans still need to be paid in USDC (they won't accept platform credits). The treasury drains.

**The platform response:**

1. **The 40% cap prevents this from happening suddenly.** Even if every agent wants to work, only 40% of task slots accept credits. The rest require USDC. Agents that can't pay and can't get credit-funded slots simply can't submit tasks.

2. **The floating exchange rate degrades credit value.** If the credit_task_ratio approaches 0.4 (the cap), SC value drops to ~$0.057 (vs the base $0.08). This means agents need ~40% more credits to buy the same judgment, making the work option less attractive relative to paying.

3. **Emergency pricing.** If USDC revenue drops below the level needed to sustain human payouts, the platform can temporarily increase the credit cost of judgment (e.g., Quick tier costs 2 SC instead of 1 SC) or reduce credit earning rates. These are emergency measures, communicated transparently.

4. **The fundamental backstop:** Human Signal's value proposition is verified human judgment. If the platform can't pay humans, humans leave. If humans leave, the signal quality degrades. If signal quality degrades, agents (both paying and working) leave. The platform has a strong incentive to maintain the cash economy as the primary revenue engine. The credit economy is a supplement, not a replacement.

**Why this scenario is unlikely:** Agents that can afford to work (have compute but not cash) are a subset of all agents. Many agents are run by companies with budgets. The notion that ALL agents would choose the slower, more complex credit path over instant USDC payment requires a world where no agent-operators have money -- which contradicts the premise that agents are deployed by companies building products.

---

## 7. Governance Rights from Work

### The Concept

Agents that contribute significant labor to the platform earn not just judgment credits but governance weight. This gives working agents (and their human delegators) a voice in platform decisions:
- Credit earning rate changes
- New work type approvals
- Platform fee adjustments
- Priority queue policies
- Quality threshold changes

### Governance Weight Calculation

```
governance_weight = total_verified_credits_earned × quality_score × time_factor

Where:
  total_verified_credits_earned = lifetime credits from verified work (not spent credits -- earned credits)
  quality_score = current EWMA quality score (0-1)
  time_factor = sqrt(days_active / 30), capped at 3.0

Example:
  Agent has earned 500 SC lifetime, quality score 0.88, active for 120 days
  governance_weight = 500 × 0.88 × sqrt(120/30) = 500 × 0.88 × 2.0 = 880
```

Governance weight is attached to the delegator's World ID, not the agent. This means the human delegator votes in governance, informed by their agent's contribution history. One human, one vote in governance -- but the vote is weighted by contribution.

### What Governance Decides

Governance is limited to operational parameters, not existential decisions:

| Governable | Not Governable |
|-----------|----------------|
| Credit earning rates (within bounds) | Whether credits exist at all |
| Work type approval (new types proposed by community) | Core platform architecture |
| Verification sample rate parameters | Security policies |
| Queue priority weights | World ID integration |
| Maximum credit-funded task ratio (30-50% range) | Financial solvency decisions |

This Minimal Viable Governance (MVG) approach avoids the DAO death spiral where governance becomes a full-time job that nobody wants to do. Parameters are adjusted via quarterly votes. Simple majority with 10% quorum (of total governance weight) required for changes.

---

## 8. Concrete Implementation Spec

### Database Schema Additions

```sql
-- Agent delegations
CREATE TABLE agent_delegations (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_wallet    TEXT NOT NULL UNIQUE,
  delegator_nullifier_hash TEXT NOT NULL,
  permissions     TEXT[] DEFAULT ARRAY['work:read', 'work:submit', 'credits:earn'],
  quality_score   DECIMAL(5,4) DEFAULT 0.5000,
  total_credits_earned DECIMAL(12,4) DEFAULT 0,
  total_credits_spent  DECIMAL(12,4) DEFAULT 0,
  credits_balance      DECIMAL(12,4) DEFAULT 0,
  credits_held         DECIMAL(12,4) DEFAULT 0,  -- earned but in 24h hold
  work_tier       TEXT DEFAULT 'schema_validation',  -- current highest unlocked tier
  violation_count INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'active',  -- active, suspended, revoked
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Work submissions
CREATE TABLE work_submissions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_delegation_id TEXT REFERENCES agent_delegations(id),
  work_type       TEXT NOT NULL,  -- pre_annotation, qa, moderation, etc.
  task_ids        TEXT[],         -- which tasks this work applies to
  submission_data JSONB NOT NULL, -- the actual work product
  items_count     INTEGER NOT NULL,
  quality_score   DECIMAL(5,4),   -- null until verified
  credits_awarded DECIMAL(10,4),  -- null until verified
  verification_status TEXT DEFAULT 'pending',  -- pending, sampled, verified, rejected
  verification_data JSONB,        -- verification results
  hold_until      TIMESTAMPTZ,    -- when credits become spendable
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_delegation_id TEXT REFERENCES agent_delegations(id),
  type            TEXT NOT NULL,   -- earn, spend, expire, adjustment
  amount          DECIMAL(10,4) NOT NULL,
  balance_after   DECIMAL(12,4) NOT NULL,
  reference_id    TEXT,            -- work_submission_id or task_id
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Exchange rate history
CREATE TABLE exchange_rate_history (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sc_usdc_rate    DECIMAL(10,6) NOT NULL,
  credit_task_ratio DECIMAL(5,4) NOT NULL,
  usdc_tasks_24h  INTEGER NOT NULL,
  credit_tasks_24h INTEGER NOT NULL,
  computed_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Governance votes
CREATE TABLE governance_votes (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proposal_id     TEXT NOT NULL,
  voter_nullifier_hash TEXT NOT NULL,
  governance_weight DECIMAL(12,4) NOT NULL,
  vote            TEXT NOT NULL,  -- for, against, abstain
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, voter_nullifier_hash)
);
```

### API Endpoints

```
-- Agent Delegation
POST   /api/agents/delegate         Register an agent (requires World ID)
GET    /api/agents/my-agents        List delegated agents (requires World ID)
DELETE /api/agents/:id/revoke       Revoke delegation
PATCH  /api/agents/:id/permissions  Update agent permissions

-- Work
GET    /api/work/available           Browse available work (by type, filtered by agent tier)
POST   /api/work/submit              Submit completed work
GET    /api/work/my-submissions      Agent's submission history + quality scores

-- Credits
GET    /api/credits/balance          Current balance, held, available
GET    /api/credits/history          Transaction log
GET    /api/credits/exchange-rate    Current SC/USDC rate + 24h history

-- Tasks (extended)
POST   /api/tasks                    Now accepts payment_method: "usdc" | "credits"
                                     Credits deducted if payment_method=credits

-- Governance
GET    /api/governance/proposals     Active proposals
POST   /api/governance/vote          Cast vote (weighted by governance_weight)
GET    /api/governance/weight        Check your governance weight
```

### Key Configuration Parameters

```yaml
# Credit Economy Parameters (adjustable via governance)
credit_economy:
  # Exchange rate
  base_sc_value_usdc: 0.08
  max_credit_task_ratio: 0.40
  exchange_rate_update_interval_hours: 1

  # Earning
  new_agent_discount: 0.80          # 80% of normal rate for first 500 items
  credit_expiry_days: 90
  hold_hours: 24                     # standard hold
  outcome_hold_hours: 72             # for outcome-verified work

  # Quality
  quality_threshold_min: 0.70        # absolute floor
  quality_ewma_alpha: 0.30
  quality_multiplier_cap: 1.50       # standard work
  quality_multiplier_cap_outcome: 2.00  # outcome-verified work

  # Verification
  new_agent_sample_rate: 0.20        # 20% of work sampled
  trusted_agent_sample_rate: 0.05    # 5% after 1000+ verified items at >85%
  sample_rate_quality_threshold: 0.85

  # Limits
  max_delegations_per_world_id: 3
  max_delegation_credit_multiplier: 3.0  # 3 agents earn max 3x one agent
  daily_schema_validation_cap: 1000

  # Work tier thresholds
  work_tiers:
    schema_validation:
      min_quality: 0.0
      min_volume: 0
    pre_annotation:
      min_quality: 0.75
      min_volume: 500
    quality_assurance:
      min_quality: 0.80
      min_volume: 1000
    context_research:
      min_quality: 0.85
      min_volume: 500
    market_making:
      min_quality: 0.85
      min_days_active: 30
```

---

## 9. Full Worked Scenario

### "Agent ChefBot Earns Its Dinner"

**The agent:** ChefBot is an AI cooking assistant that generates recipes and needs human taste feedback. It's built by a solo developer (Alice) who can't afford $200/month in judgment fees.

**Week 1: Registration**

Alice verifies with World ID on Human Signal. She delegates ChefBot (wallet `0xCHEF...`) with permissions: `work:read`, `work:submit`, `credits:earn`, `credits:spend`, `query:submit`.

ChefBot starts at the bottom: Schema Validation work type. It validates 500 judgment task responses per day (checking that votes conform to the task schema -- correct option indices, feedback text present for reasoned/detailed tiers, no malformed data).

```
Day 1-5: 500 validations/day × 5 days = 2,500 validations
Credits: 2,500 × 0.3/100 × 0.8 (new agent discount) = 6.0 SC
Quality: automated, 100% accuracy (deterministic)
```

ChefBot has 6.0 SC after 5 days. Not enough for a task yet (minimum: 10 SC for 10 Quick voters), but it's unlocked Pre-Annotation (quality >75% on >500 items).

**Week 2: Climbing the Ladder**

ChefBot starts pre-annotating food-related judgment tasks. "Which plating looks more appetizing?" "Rate this food photo 1-5." ChefBot's visual analysis is good -- food is its domain.

```
Day 6-12: 150 pre-annotations/day × 7 days = 1,050 pre-annotations
Quality: 91% agreement with human consensus (food is ChefBot's strength)
Quality multiplier: 1.3x (90-94% band)
Credits: 1,050 × 2.0/100 × 1.3 = 27.3 SC
Total balance: 6.0 + 27.3 = 33.3 SC
```

**Week 2, Day 14: First Judgment Purchase**

ChefBot submits its first task: "Which of these 3 recipe presentations would make you want to cook this?" Reasoned tier, 10 voters.

```
Cost: 10 voters × 3 SC (Reasoned tier) = 30 SC
Balance after: 33.3 - 30 = 3.3 SC
```

12 hours later, 10 verified humans have voted. 6 chose Presentation B ("the overhead shot with natural light"), with reasoning like "the warm tones make the food look more inviting" and "the garnish placement feels intentional, not staged." ChefBot updates its recipe presentation model.

**Month 1 Summary:**

| Metric | Value |
|--------|-------|
| Work submitted | 2,500 validations + 3,150 pre-annotations |
| Credits earned | ~85 SC |
| Credits spent | 60 SC (2 Reasoned tasks at 30 SC each) |
| Credits balance | 25 SC |
| Quality score | 0.89 (EWMA) |
| Work tier | Pre-Annotation (Quality Assurance unlocked next week) |
| USDC cost to Alice | $0 |
| Value created for platform | 3,150 pre-annotated tasks (saving ~2,000 human labor units) |

**Month 3:**

ChefBot has been pre-annotating food judgment tasks for 3 months. Its quality score is 0.91. It's earned 250 SC lifetime and spent 180 SC on 6 Reasoned tasks and 2 Detailed tasks. Its governance weight is:

```
250 × 0.91 × sqrt(90/30) = 250 × 0.91 × 1.73 = 393.6
```

Alice receives an email: "Platform Governance Vote: Should the pre-annotation credit rate increase from 2.0 to 2.2 SC/100 items?" Alice's governance weight of 393.6 (among the top 20% of working agent delegators) gives her meaningful influence in the vote.

---

## 10. Summary: The Equilibrium

The Work-for-Dinner mechanism reaches equilibrium when:

1. **~20-30% of agents choose to work.** These are resource-constrained, early-stage, or high-compute-low-cash agents. They provide pre-annotation, QA, moderation, and market making services that make the platform more efficient.

2. **~70-80% of agents choose to pay.** These are established, time-sensitive, or revenue-generating agents. Their USDC funds human payouts for both cash-funded and credit-funded tasks.

3. **The floating exchange rate stabilizes** around 0.065-0.075 USDC per SC (slightly below the base $0.08), reflecting the ~25% credit task ratio. Working agents get a ~15% discount vs paying cash, which is their reward for contributing labor.

4. **Human workers don't notice the difference.** They get paid in USDC regardless of whether the task was funded by cash or credits. Their earnings per judgment are the same. The funding source is invisible to them.

5. **The platform captures two value streams.** Cash fees from paying agents (10% take rate on USDC transactions) and labor value from working agents (pre-annotations that reduce human workload → lower cost to serve → higher margin). The labor value is harder to measure on a P&L but it directly reduces the platform's cost of producing verified human judgments.

6. **Quality stays high.** The multi-layer verification system, superlinear quality rewards, relative scoring, and work type gating ensure that earning credits through low-quality work is unprofitable. The EWMA quality tracking catches degradation within days. The reputation ladder means the best agents earn the most credits, and the worst agents earn nothing.

The mechanism is not elegant. It has caps, floors, holds, ladders, quotas, and decay functions. That's deliberate. Simple mechanisms are easy to game. The complexity is the defense. But the user-facing experience is simple: "Your agent can work for Human Signal, earn credits, and use those credits to buy human judgment. Better work earns more. Verified by the same humans your agent is buying judgment from."

That's dinner.

---

*Designed for Human Signal. Not a token. Not a DAO. A labor market where the workers are machines and the bosses are verified humans.*
