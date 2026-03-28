# Equity Model: Human Stake in Agent Productivity

**Status:** Design document / economic analysis
**For:** Human Signal — World x Coinbase x402 Hackathon

---

## The Core Idea

Today, Human Signal pays humans per-judgment: you vote, you get $0.08-$0.50 in USDC immediately. The relationship ends at the transaction.

The equity model proposes something different: **humans who improve an AI agent earn a share of that agent's future productivity.** Instead of (or alongside) a flat bounty, contributors receive a claim on the revenue the agent generates downstream.

This converts a labor market into an investment market. The human isn't just a worker — they're a stakeholder.

---

## 1. The Mechanic

### What "Equity in an Agent" Actually Means

There are three candidate structures. They differ in legal complexity, settlement cost, and incentive alignment.

**Option A: Revenue Share (recommended for MVP)**

The agent creator commits a percentage of the agent's future revenue to a revenue-share pool. Contributors receive pro-rata shares of that pool based on their attributed contribution weight.

- No token issuance. No secondary market. No securities law trigger.
- Settlement: the agent creator periodically deposits USDC into a smart contract. The contract distributes to contributors by weight.
- This is economically equivalent to a royalty. Legally, it's a contractual revenue share — the simplest structure.

**Option B: Agent Tokens (ERC-20)**

Mint a token per agent. Distribute tokens to contributors. Token represents a claim on a revenue-share contract.

- Enables secondary trading (contributors can sell their stake).
- But: secondary trading almost certainly makes this a security under Howey. You're selling "an investment in a common enterprise with expectation of profit derived from the efforts of others." That's the Howey test verbatim.
- For a hackathon: interesting to demonstrate. For production: requires legal counsel.

**Option C: NFT Receipts**

Each contribution mints a non-transferable (soulbound) NFT that records the contributor's weight. The NFT acts as a claim ticket against a revenue-share contract.

- Non-transferable = no secondary market = stronger argument against security classification.
- But soulbound tokens have UX friction (can't move wallets, no recovery mechanism).
- Adds complexity without clear benefit over Option A for MVP.

**Recommendation:** Option A (revenue share via smart contract) for the hackathon. Option B is the stretch goal if you want to demonstrate secondary markets.

### Attribution: How to Split

This is the hardest problem. 1,000 humans each provided one judgment. How much is each worth?

**Naive approach: Equal split.**

Everyone who contributed gets an equal share. 1,000 contributors = 0.1% each.

- Pros: Simple, transparent, easy to implement.
- Cons: Ignores quality. A garbage vote and a brilliant insight are weighted equally.

**Better approach: Quality-weighted shares.**

Each contribution is weighted by a quality signal. The weight determines the contributor's share of the revenue pool.

Available quality signals in Human Signal today:
- **Tier of feedback:** Quick vote (weight 1x), Reasoned vote (weight 3x), Detailed review (weight 6x). Already tracked in the `votes` table.
- **Majority alignment:** Did the contributor vote with the eventual majority? Consensus-aligned votes are more likely correct. Weight: 1.5x for majority, 0.5x for minority.
- **Requester rating:** The task creator rated the feedback. 5-star feedback gets 3x weight; 1-star gets 0.2x weight. Already tracked via `feedback_rating`.
- **Reputation score:** Contributor's global reputation. Weight multiplier = reputation_score / 3.0 (so a 4.5-star contributor gets 1.5x; a 2.0 gets 0.67x).

**Combined weight formula:**

```
contributor_weight = tier_weight * alignment_weight * rating_weight * reputation_weight
share = contributor_weight / sum(all_contributor_weights)
```

**Example:** An agent trained by 500 contributors.
- 400 gave quick votes (tier 1x). Average alignment 1.2x. Average rating 1.0x. Average reputation 1.0x.
  - Per-contributor weight: 1 * 1.2 * 1 * 1 = 1.2
  - Total weight for this group: 480
- 80 gave reasoned votes (tier 3x). Average alignment 1.3x. Average rating 1.5x. Average reputation 1.2x.
  - Per-contributor weight: 3 * 1.3 * 1.5 * 1.2 = 7.02
  - Total weight for this group: 561.6
- 20 gave detailed reviews (tier 6x). Average alignment 1.4x. Average rating 2.0x. Average reputation 1.5x.
  - Per-contributor weight: 6 * 1.4 * 2.0 * 1.5 = 25.2
  - Total weight for this group: 504

Total weight: 480 + 561.6 + 504 = 1545.6

- A quick voter's share: 1.2 / 1545.6 = 0.078%
- A reasoned voter's share: 7.02 / 1545.6 = 0.454%
- A detailed reviewer's share: 25.2 / 1545.6 = 1.631%

The detailed reviewer earns ~21x more than the quick voter. That's the incentive.

### Time Decay

**Should early contributors earn more or less?**

Arguments for early premium (higher weight for early contributions):
- Early data shapes the agent's foundation. You're training from scratch — signal quality matters most.
- Early contributors bear more risk (the agent might never become productive).
- Standard startup equity logic: early employees get more.

Arguments against:
- Later feedback may be more valuable because it corrects errors in the already-trained agent.
- An agent's distribution shifts over time — what matters at month 1 is different from month 12.

**Recommended approach: Mild early premium with diminishing decay.**

```
time_weight = 1 + (0.5 * e^(-contribution_age_days / 180))
```

This gives the earliest contributors a 1.5x multiplier that decays to ~1.0x over 6 months. Not dramatic enough to discourage later participation, but enough to reward pioneers.

**Critical constraint:** Time decay must be bounded. A 100x early premium would make it irrational for anyone to contribute after month 1. The cap at 1.5x keeps the window attractive indefinitely.

### Settlement on Base/Sepolia

The on-chain component is a **RevenueShare contract** with these functions:

```solidity
// Deployed per agent
contract AgentRevenueShare {
    mapping(bytes32 => uint256) public weights;   // nullifier_hash => weight
    mapping(bytes32 => address) public wallets;    // nullifier_hash => payout wallet
    uint256 public totalWeight;
    address public agentCreator;
    uint256 public revenueSharePercent;            // e.g., 10 = 10%

    // Agent creator deposits revenue
    function depositRevenue(uint256 amount) external;

    // Contributors claim their share
    function claim(bytes32 nullifierHash) external;

    // Update weights (only via platform, after new contributions)
    function updateWeight(bytes32 nullifierHash, uint256 newWeight) external;
}
```

**Flow:**
1. Agent creator creates a task with `equity_mode: true` and `revenue_share_percent: 10`.
2. Contributors vote/review. Their weights are recorded off-chain (Postgres) and periodically committed on-chain via a Merkle root or direct weight updates.
3. Agent generates revenue. Creator (or automated agent) calls `depositRevenue()` with USDC.
4. Contributors call `claim()` to withdraw their proportional share.

**Gas optimization:** Don't write individual weights on-chain per contribution. Instead, use a Merkle tree: publish the root on-chain, let contributors submit Merkle proofs to claim. This makes the gas cost O(1) for publishing and O(log n) for claiming, regardless of contributor count.

---

## 2. The Incentive Structure

### Why Equity Beats Cash (Sometimes)

Per-judgment payment is optimal when:
- The agent's future value is known and low.
- The contributor wants immediate liquidity.
- The task is commoditized (no quality variance matters).

Equity is optimal when:
- **The agent's future value is uncertain but potentially high.** This is the startup equity argument: if you knew the agent would generate $1M/year, you'd just pay market rate. You offer equity when the upside is large but uncertain.
- **Quality variance matters enormously.** A great judgment could make an agent 10x more effective. Equity aligns incentives: if your feedback makes the agent better, your equity is worth more.
- **You want long-term relationships.** Per-judgment is transactional. Equity creates ongoing interest. Contributors who hold equity in an agent will monitor it, suggest improvements, flag regressions.

### The Quality Flywheel

Cash payment: Contributor optimizes for speed (do the minimum to get paid).

Equity payment: Contributor optimizes for agent success (make the agent better so my share is worth more).

This is the central mechanism design insight. **Equity converts an adversarial labor relationship into a cooperative investment relationship.** The contributor and the agent creator want the same thing: a more productive agent.

### Adverse Selection: Do Good Judges Choose Equity?

Prediction: **Yes, but only if the signal is legible.**

Good judges know they're good. They know their feedback is higher quality. If they can see that quality is reflected in equity weight (via the attribution formula above), they'll choose equity over cash — because their equity will be worth more per-judgment than the cash equivalent.

Bad judges also know they're bad (or at least uncertain). They'll prefer cash — guaranteed payment regardless of quality.

**This is a feature, not a bug.** Adverse selection here is POSITIVE adverse selection. The equity track self-selects for quality. The cash track becomes the commodity tier.

**To make this work:** The attribution formula must be transparent and legible. Contributors need to see exactly how their weight is calculated and how it compares to others. If the formula is opaque, good judges can't price the option correctly and won't take it.

### The Option Value Framework

A contributor choosing between $0.20 cash and equity is implicitly pricing an option:

```
Expected equity value = share% * projected_agent_revenue * revenue_share% * time_horizon
```

For a quick voter choosing between $0.08 cash and equity on an agent projected to earn $5K/month with 10% revenue share:
- Share: 0.078% (from example above)
- Monthly payout: 0.00078 * $5,000 * 0.10 = $0.39/month
- Break-even vs cash: ~6 days

The equity is worth more IF (1) the agent actually generates revenue, and (2) it does so for longer than the break-even period.

**For high-potential agents, equity dominates.** For uncertain/low-value agents, cash dominates. The choice itself becomes a signal about the contributor's assessment of the agent.

---

## 3. Worked Examples

### Example A: AI Sales Agent

An AI sales agent that qualifies leads and books demos. Generates $10,000/month in commissions.

- 500 humans provided training feedback over 3 months.
- Revenue share: 15%.
- Monthly pool: $10,000 * 0.15 = $1,500/month.
- Average contributor payout: $1,500 / 500 = $3.00/month.
- Top contributor (detailed reviewer, high reputation, early): 1.63% share = $24.45/month.
- Minimum contributor (quick voter, average everything, late): 0.05% share = $0.75/month.

**Comparison to cash model:** Quick voter would have earned $0.08 one-time. With equity, they earn $0.75/month indefinitely. Break-even in 4 days.

**But:** The contributor bore risk. If the agent never shipped, they earned $0. The cash model would have paid $0.08 guaranteed.

### Example B: AI Content Moderator

Processes 1M items/day at $0.001/item = $30,000/month revenue.

- 10,000 humans provided moderation judgments.
- Revenue share: 5% (lower because the agent creator invested heavily in the model itself).
- Monthly pool: $30,000 * 0.05 = $1,500/month.
- Average contributor: $0.15/month.
- Top contributor: ~$3/month.

**This example shows where equity is weak.** With 10,000 contributors and a modest revenue share, individual payouts are tiny. The content moderator has a **commoditized training problem** — any one judgment isn't very important. Cash payment is better here.

**Rule of thumb:** Equity works when the contribution count is low-to-moderate (50-1,000) and the agent's revenue potential is high. It breaks down when contribution count is high (10,000+) and individual contributions are fungible.

### Example C: AI Design Critic

Helps agencies evaluate creative work. Trained on 50,000 taste judgments from 200 expert designers.

- Revenue: $5,000/month from agency subscriptions.
- Revenue share: 20% (high because the human taste IS the product).
- Monthly pool: $5,000 * 0.20 = $1,000/month.
- 200 contributors, heavily quality-weighted (all detailed reviews, high reputation).
- Average: $5/month. Top: $30/month.

**This is the sweet spot.** Few contributors, high individual signal value, direct link between human taste and agent quality. Each contributor can see that their specific judgment made the agent better. Equity aligns perfectly.

---

## 4. Complications and Failure Modes

### Gaming and Sabotage

**Attack 1: Vote badly to sabotage a competitor's agent.**

A competitor sends 100 World ID-verified humans to provide deliberately bad feedback on a rival's training task.

Defense:
- Quality-weighting means bad votes get low weight (minority alignment, low requester rating).
- But the damage isn't to equity shares — it's to the agent's training data. This attack exists with or without the equity model.
- Mitigation: Reputation system. New contributors with low reputation get flagged for review. Requester can reject obviously bad feedback.
- Nuclear option: Requester can exclude specific contributors from the revenue share (with on-chain governance constraints to prevent abuse).

**Attack 2: Sybil via World ID limitations.**

World ID provides one-person-one-vote, but it doesn't prevent a single person from providing maximally lazy feedback across thousands of agents to accumulate micro-equity positions.

Defense: Quality-weighting naturally penalizes this. Lazy feedback gets low tier weight, low rating, low reputation multiplier. The ROI of spray-and-pray equity farming is low.

**Attack 3: Agent creator never deposits revenue.**

The equity is worthless if the creator doesn't honor the revenue share.

Defense options:
- Smart contract escrow: Creator must deposit X USDC upfront as a minimum guarantee. If revenue exceeds the guarantee, they top up. If it doesn't, contributors at least get the guarantee.
- On-chain revenue reporting: If the agent's revenue flows through a smart contract (e.g., the agent charges via x402), the revenue share can be enforced automatically — the contract skims the share% before paying the creator.
- Reputation: Creators who don't pay out get flagged. Future contributors won't take equity from them.

**The honest answer:** Without on-chain revenue enforcement, the revenue share is a gentleman's agreement. This is the same problem that Web2 creator funds, royalty programs, and revenue-share platforms face. It's solvable but not trivially.

### Agents That Never Become Productive

Most agents will fail. Most equity will be worthless. This is identical to startup equity.

**Design implications:**
- Always offer a cash option alongside equity. Never force equity-only.
- Make the "this equity might be worth $0" messaging extremely clear. No hype.
- Consider a hybrid: 50% cash + 50% equity. Guarantees some payment while preserving upside.
- Minimum viable deployment period: equity should vest/activate only after the agent demonstrates N days of revenue. Until then, it's a non-transferable claim.

### Regulatory: Is This a Security?

**Almost certainly yes if tokens are transferable.** The Howey test:
1. Investment of money: Yes (contributor's labor in exchange for a financial instrument).
2. Common enterprise: Yes (the agent's revenue pool).
3. Expectation of profit: Yes.
4. Derived from the efforts of others: Yes (the agent creator and the agent itself).

**Mitigations:**
- Non-transferable revenue shares (no secondary market) weaken the "investment" prong — you can't buy/sell them, so it's more like a royalty or bonus program.
- Small amounts may fall under de minimis exemptions.
- Framing as "performance bonus" rather than "equity" has better optics but doesn't change the legal analysis.

**For a hackathon demo:** This doesn't matter. For production: get a securities lawyer before launching transferable tokens.

**Regulatory arbitrage:** The fact that contributors are identified via World ID (one-person-one-vote, no pseudonymous trading) actually helps the regulatory story. You can KYC the entire contributor base through World ID's verification, which satisfies some AML requirements.

### Valuing an Agent's Future Productivity

You can't. Not accurately.

**What you can do:**
- Use revealed preference: How much is the agent creator willing to commit as revenue share %? Higher commitment = higher implicit valuation.
- Use historical data: Agents in similar categories have earned X on average. But this data doesn't exist yet.
- Use the cash/equity choice ratio: If 80% of contributors for a given agent choose equity over cash, the crowd is bullish.

**What you should NOT do:**
- Project revenue. Any projection is fantasy for a nascent agent.
- Promise returns. This is both practically wrong and legally dangerous.

---

## 5. Minimal Viable Version (Hackathon Demo)

### The Simplest Thing That Works

**New fields on task creation:**

```typescript
{
  // Existing fields...
  description: "Which logo feels more premium?",
  options: [...],
  tier: "reasoned",

  // New equity fields
  equity_mode: "hybrid",        // "cash" | "equity" | "hybrid"
  revenue_share_percent: 10,    // % of agent revenue committed to contributors
  agent_id: "sales-agent-v3",   // Groups tasks under one agent
  initial_stake_usdc: 50,       // Upfront USDC deposited as minimum guarantee
}
```

**New database tables:**

```sql
CREATE TABLE agents (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  creator_wallet  TEXT NOT NULL,
  revenue_share_percent DECIMAL(5,2) DEFAULT 10,
  total_revenue_deposited DECIMAL(12,4) DEFAULT 0,
  total_claimed   DECIMAL(12,4) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE equity_shares (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_id        TEXT REFERENCES agents(id),
  nullifier_hash  TEXT REFERENCES workers(nullifier_hash),
  raw_weight      DECIMAL(10,4) DEFAULT 1,
  normalized_share DECIMAL(10,8),  -- Recomputed periodically
  total_claimed   DECIMAL(12,4) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, nullifier_hash)
);

CREATE TABLE revenue_deposits (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  agent_id        TEXT REFERENCES agents(id),
  amount_usdc     DECIMAL(12,4),
  tx_hash         TEXT,
  deposited_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**New API endpoints:**

```
POST /api/agents                   Create an agent (x402-gated for initial stake)
POST /api/agents/:id/deposit       Deposit revenue (x402-gated)
GET  /api/agents/:id/shares        View share distribution
POST /api/agents/:id/claim         Claim accumulated revenue (World ID + wallet)
GET  /api/me/equity                View all my equity positions (World ID)
```

**Claim flow:**

1. Agent creator calls `depositRevenue()` — sends USDC to the contract (or treasury wallet in MVP).
2. Platform recomputes `normalized_share` for all contributors to that agent.
3. Contributor calls `claim()` with their World ID proof and wallet address.
4. Platform sends `share * deposited_since_last_claim` USDC to the contributor's wallet.

### What to Demo

**Scene 1: Agent creator creates a training task.**

"I'm building an AI sales agent. I need humans to judge which email subject line gets better responses. I'm offering 10% equity in the agent's future revenue, with a $50 USDC guarantee staked upfront."

**Scene 2: Human contributes.**

Voter sees two options: "Earn $0.20 cash" or "Earn equity (current estimated value: $0.35/month based on $50 guarantee)". They choose equity because they believe the sales agent will earn more than the guarantee.

**Scene 3: Revenue flows.**

"The sales agent earned $2,000 last month. 10% = $200 distributed to 50 contributors. Your share: $8.20 this month."

**Scene 4: The portfolio view.**

"You have equity in 12 agents. Combined monthly revenue: $47.30. Your best performer: a design critique agent paying $22/month from a single detailed review you wrote 3 months ago."

### What This Proves

1. **x402 is the settlement layer** — both for task creation payments AND revenue-share deposits. The protocol works in both directions.
2. **World ID provides contributor identity** — same nullifier_hash tracks your contributions and your equity claims. No additional identity layer needed.
3. **The incentive works** — quality-weighted equity creates a flywheel where good feedback → more equity → more revenue → more attraction for good feedback providers.

### Implementation Effort Estimate

For a hackathon:
- 3 new DB tables: 30 min
- Agent creation endpoint with x402: 1 hour
- Revenue deposit + claim logic: 2 hours
- Equity portfolio UI (basic): 2 hours
- Smart contract (optional, on Base Sepolia): 3 hours
- **Total: 8-10 hours for a working demo**

Without the smart contract (keep everything in Postgres + treasury wallet), cut to 5-6 hours.

---

## 6. Where the Model Breaks Down

**Be honest about these:**

1. **Revenue attribution is the real unsolved problem.** The equity model assumes you can measure an agent's revenue. But most agents don't have clean revenue lines — they're tools inside larger workflows. An AI sales agent might "contribute" to a $50K deal, but how much was the agent vs. the human salesperson vs. the product itself? This is the AI equivalent of the advertising attribution problem, and it's unsolved.

2. **The cold start is brutal.** No contributor will take equity in an agent that doesn't exist yet. They'll take cash. But the agent needs training data to exist. So the creator must fund the cold start with cash bounties, then switch to equity once the agent demonstrates value. This means the equity model is a growth mechanism, not a bootstrapping mechanism.

3. **Tiny payouts destroy engagement.** If a contributor's monthly equity payout is $0.15, they won't bother claiming it. The gas cost of a claim transaction might exceed the payout. Solutions: minimum claim thresholds, batched payouts, L2 gas optimization. But the fundamental issue remains — equity only works when individual contributions are valuable enough to generate meaningful shares.

4. **Governance is unresolved.** Who decides the revenue share percentage? Can it change? What if the agent creator lowers it from 10% to 1% after training is complete? The answer is probably on-chain immutability (set at creation, can't be lowered), but that constrains the creator. Alternatively: contributors vote on changes, which is a DAO, which is a whole other can of worms.

5. **Agent identity is fuzzy.** What is "an agent"? If the creator retrains the model from scratch, is it the same agent? If they fork it, do contributors to the original get equity in the fork? The boundary of an "agent" is as ambiguous as the boundary of a "company" — and companies have centuries of legal infrastructure that agents lack.

6. **Time horizon mismatch.** Contributors want payouts now. Agent revenue might take months to materialize. The gap between contribution and first payout is a motivation killer. The initial stake/guarantee partially addresses this, but it's a band-aid.

---

## 7. The Bigger Picture

This model, if it works, creates something genuinely new: **a labor market where workers accumulate capital through the quality of their work, not just income.**

Today, RLHF contractors at Scale AI earn $15-25/hour. They make models worth billions. They capture approximately 0% of the value they create. The equity model proposes that the humans who provide the judgment, taste, and preference signals that make AI agents valuable should own a piece of what they helped create.

The x402 protocol is the settlement rail. World ID is the identity layer. Base is the ledger. Human Signal is the marketplace. The equity model is the incentive structure that makes the marketplace self-reinforcing.

**If this works at scale:** The best human judges become AI micro-investors. Their portfolio of agent equity stakes becomes a new asset class — one that's earned through demonstrated skill, not purchased with capital. The quality of your judgment literally becomes equity.

That's the pitch.
