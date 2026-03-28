# Research: Human Judgment Markets — Prediction Markets, Aggregation Mechanisms, and the Agent Economy

**Date:** 2026-03-27
**Scope:** Prediction markets as information aggregation, judgment markets for subjective outcomes, token-incentivized labor, human-in-the-loop for AI agents, dynamic pricing of human attention

---

## Summary

There is a rich and increasingly mature ecosystem around prediction markets as information aggregation — Polymarket, Kalshi, MetaDAO, and the academic tradition from Robin Hanson's futarchy through recent mechanism design work. The "wisdom of crowds" result is real but fragile: it depends on independence, sufficient liquidity, and freedom from herding, and real markets frequently violate all three.

The biggest whitespace in this research is **judgment markets for subjective outcomes**. Nearly all prediction markets require objectively verifiable resolution criteria. There is a small but important academic literature (self-resolving markets, peer prediction mechanisms, within-person wisdom-of-crowds for taste) that shows subjective aggregation is theoretically solvable — but no production system has built it cleanly. The closest analog is Manifold Markets using creator judgment for resolution, which is ad hoc and reputation-dependent.

On the labor/equity side, three trajectories are converging: Braintrust (token equity for talent network participants), Vana (data sovereignty with fractional model ownership), and Bittensor's HIP subnet (human cognition as a TAO-incentivized subnet feed). None of these have cleanly merged prediction market mechanics with labor compensation — they are either equity-sharing or task-payment, not judgment-markets-as-labor.

For AI agent infrastructure, HumanLayer is the clearest example of a "judgment API" for autonomous agents: decision-based pricing ($15–$200/decision depending on SLA), structured routing, and auditable artifacts. LangGraph provides the interrupt() primitive at the framework level. The gap is that these systems treat human judgment as a blocking call — interrupting the agent workflow — rather than as a continuous market that agents can query asynchronously.

---

## Background

The question at the intersection here is: **can human judgment be organized as a market mechanism that (a) prices it dynamically, (b) gives workers equity in the outputs they create, and (c) serves as an asynchronous API for AI agents?** This research maps what exists across all three axes to identify where genuine whitespace lies.

---

## Key Findings

### Finding 1: Futarchy and Conditional Prediction Markets — Proven in Theory, Early in Practice

Robin Hanson's futarchy (1999, formalized in papers through the 2010s) proposes: "vote on values, bet on beliefs." The mechanism creates conditional markets — *what is the outcome metric if we adopt policy A vs. policy B?* — and selects the policy that the market predicts will produce better outcomes.

**Mechanism:** Define an ex-post-measurable welfare metric. Create two conditional market tracks for each proposal (adopt vs. reject). If the "adopt" track prices a better expected welfare outcome, the proposal passes. The separation of values (voting) from beliefs (betting) is the core insight.

**State in 2026:** After decades of advocacy with limited adoption, futarchy has found its first real home in crypto governance:
- **MetaDAO** (Solana) has been running futarchy governance for ~2.5 years. Q4 2025 was their first profitable quarter: $2.51M in protocol fee revenue, 8 protocols using futarchy, $219M total ecosystem marketcap. One documented decision: a futarchy-approved treasury token sale in October 2025.
- **Foreign government health organization** (unnamed) has piloted futarchy for ~1 year per Hanson's statements.
- **Key critique**: The redistribution problem — a self-serving proposal that transfers value without creating it may still pass a market if concentrated beneficiaries move the price. Causation vs. correlation: conditional markets reveal correlations, and poor outcomes may reflect underlying problems rather than the causal effect of a decision.

**Whitespace:** Futarchy has not been applied to subjective quality decisions ("which creative direction is better for our brand?"), only to quantifiable metrics. The conditional market framework could theoretically extend to any outcome that can be measured after the fact — including user satisfaction scores, content engagement, or annotation quality — but no one has built this.

### Finding 2: Prediction Market Accuracy — Better Than Polls, Worse Than Claimed

The Vanderbilt study (Clinton & Huang, 2025) examined 2,500 markets and $2.5B in volume across Polymarket, Kalshi, and PredictIt:

- **Accuracy:** Polymarket 67%, Kalshi 78%, PredictIt 93%
- **Core finding:** Traders were often reacting to each other rather than to real-world information. 58% of Polymarket presidential markets showed negative serial correlation — prices reversed the next day.
- **Structural problem:** Polymarket's unlimited-stake design attracted large speculators. The "French Whale" held >20% of yes-shares on a single presidential bet, distorting the market the accuracy advocates were citing as evidence of crowd wisdom.
- **Counter-finding:** On the 2024 election specifically, Polymarket outperformed polls — it showed Trump as a meaningful favorite from September onward while polls showed a dead heat. This is real but narrow evidence.

**When wisdom of crowds works:** Sufficient liquidity, diverse and independent participants, low manipulation risk. Thin markets dominated by a few large players are just oligarchy in probability form.

**When it fails:** Social influence (herding), correlated information sources (everyone reads the same news), market manipulation by large capital, and low-participation markets where individual biases dominate.

### Finding 3: Subjective Judgment Markets — Theoretically Solvable, Practically Absent

This is the most important whitespace in the research. **No production system has successfully built a prediction market for purely subjective outcomes** (taste, quality, cultural merit, aesthetic judgment).

**The resolution problem:** Standard prediction markets require objectively verifiable outcomes. "Will Trump win?" resolves cleanly. "Is this painting beautiful?" does not. The challenge has two parts: (1) how do you incentivize truthful reporting when there's no ground truth? (2) how do you reward early accurate reporters when the "truth" isn't knowable ex-ante?

**Theoretical solutions that exist:**

*Self-resolving markets (ArXiv 2306.04305, 2023):* The key mechanism is to pay agents based on how closely their predictions match the *final agent's* prediction, not an external ground truth. The final agent sees all prior predictions and has the most information — serving as a proxy for truth. Theoretical guarantees of strict incentive-compatibility under conditions where the reference agent has sufficiently more information. This is a real academic result with no production implementation.

*Peer prediction mechanisms:* A family of mechanism-design results (Prelec 2004, Miller et al., Witkowski & Parkes) showing that you can elicit truthful opinions without ground truth if participants also predict what others will say. Properly scored, truth-telling is a Nash equilibrium.

*Within-person wisdom of crowds for taste (PMC9300593, 2022):* Averaging a person's "what do I like?" with their "what would others like?" produces significantly better population-preference predictions than either alone. This works because it corrects for individual taste being an outlier. Strongest for people with atypical tastes. Has implications for annotation: if you need "what would most humans prefer?", asking annotators both questions and averaging is better than just asking their opinion.

**Manifold's ad hoc approach:** Manifold resolves subjective markets by letting the market creator judge. This works as long as the creator has a good reputation — the market price incorporates a haircut for creator dishonesty risk. It's a social mechanism, not a formal one. Reputation-based resolution degrades in one-shot interactions.

**Augur's approach:** Augur explicitly marks subjective markets as "Invalid" — the protocol's honest answer is that it doesn't solve this problem. REP token holders can dispute resolution via a forking mechanism, but this is designed for factually disputed outcomes, not subjective ones.

**What doesn't exist:** A market for quality/taste that (a) cleanly resolves, (b) is manipulation-resistant, and (c) accumulates track records about individual judgment quality over time. The theoretical machinery exists. No one has assembled it.

### Finding 4: Token-Incentivized Labor — Three Models, None Fully Merged

Three distinct approaches to giving workers equity/tokens for contributing to AI systems:

**Braintrust (BTRST):**
- Talent marketplace where network participants (not the company) own the platform via tokens
- Earn BTRST by: building out profiles, referring talent/clients, vetting other workers, achieving 5-star reviews, completing courses
- 54% of 250M fixed token supply reserved for community incentives
- ~50% of new client/talent acquisition driven by token referral programs
- Governance via token voting
- *Key limitation:* Tokens reward network growth behaviors (referrals, profiles), not the quality of intellectual outputs. There's no mechanism for "your judgment is more accurate than average, so you earn more."

**Vana (DataDAO):**
- Users contribute personal data (exported from any platform) into encrypted wallets
- DataDAOs pool user data and negotiate with AI developers for usage
- Contributors receive governance tokens proportional to their data's impact on model performance
- Over 1M users contributing data; Reddit DataDAO has 140K users; 12.7M data points available to developers
- Users maintain fractional ownership in models trained on their data — receive rewards "proportionally based on how much their data helped train it"
- *Key limitation:* Valuation of individual data contributions to model improvement is not a solved problem. Vana's whitepaper doesn't specify the attribution mechanism. Shapley values are theoretically correct but computationally expensive.

**Bittensor HIP Subnet (Human Intelligence Primitive, Subnet 36):**
- A Bittensor subnet specifically for routing human cognition tasks to human "miners"
- Other subnets can send data to HIP Subnet for human evaluation, testing, and feedback
- Validators assess quality of miner responses; TAO rewards distributed proportionally
- Miners earn highest reward for correct task completion, lower reward for valid-but-incorrect responses
- Mobile device mining enabled — lowering barrier to participation
- *Key insight:* This is the closest thing to a "judgment API" with token incentives for the broader AI ecosystem. Other AI subnets can programmatically request human evaluation. The mechanism is live and growing.
- *Key limitation:* Scoring quality is still primarily "correct/incorrect" — not calibrated uncertainty or track record of judgment accuracy over time.

**What's missing from all three:** None of these models price judgment *dynamically based on market demand*, accumulate track records of judgment accuracy as a pricing signal, or integrate with AI agent workflows as an asynchronous callable service.

### Finding 5: AI Agent Human-in-the-Loop — Blocking Calls, Not Markets

The current state of human-in-the-loop for AI agents is mature but architecturally limited. The dominant paradigm is the **blocking approval** — the agent reaches a checkpoint, pauses, routes to a human, waits.

**LangGraph (framework level):**
- `interrupt()` function pauses graph execution at a node, persists state via checkpointer (PostgreSQL in production, InMemorySaver in dev)
- Human can approve, edit, or reject with feedback
- Thread IDs persist state across sessions for async approval
- Most mature open-source primitive for human-in-the-loop agent workflows

**CrewAI:**
- `human_input=True` on tasks or `HumanTool` callable for agents to request guidance
- More ad hoc than LangGraph's interrupt — designed for agent-to-human conversations, not structured approval flows

**HumanLayer (infrastructure layer):**
- Self-described as "Stripe for decisions" — decision-based pricing, not hourly
- Pricing: $15/decision (compliance validation, 30-min SLA), $80/decision (expert judgment, 2-hr SLA), $200/decision (authorized authority, custom SLA)
- Routes approvals to specific individuals, teams, Slack, email, Discord
- Produces timestamped auditable artifacts
- Python/TypeScript SDKs, compatible with LangChain, CrewAI, Mastra, Vercel AI SDK
- Positioned as the accountability layer above framework primitives

**EU AI Act context (enforcing August 2026):** Article 14 mandates that high-risk AI systems allow natural persons to effectively oversee them during operation. This is creating regulatory demand for exactly this infrastructure.

**The architectural gap:** All current implementations treat human judgment as a synchronous or asynchronous *blocking call* on a specific agent's workflow. There is no design for human judgment as a *continuous liquid market* that agents can query at a price point, selecting from a pool of available judges in real time. The market for judgment is currently bilateral (one agent, one human), not multilateral (many agents, many humans, with price discovery).

### Finding 6: Dynamic Pricing of Human Attention — Theoretical, Not Live

**What exists theoretically:**
- Attention economy literature (from Herbert Simon 1971 through Goldhaber 1997) establishes attention as a scarce resource with economic value
- CPM/CPC models in digital advertising are essentially real-time auctions for attention — the closest existing mechanism for dynamic attention pricing
- Recent research proposes "dual-stream models" distinguishing calcified attention (stored) from flow attention (dynamic), suggesting attention could function like a commodity

**What exists in microwork platforms:**
- MTurk: Static task pricing set by requester + 20% platform fee. Average worker earns ~$2/hr. No dynamic pricing.
- Prolific: Minimum $8/hr floor, 25-30% platform fee. Compensation set by requester. No market mechanism.
- Neither platform has implemented dynamic pricing where task price reflects current supply/demand for the specific cognitive capability required.

**HumanLayer's approach:** Decision-based pricing at fixed tiers is the most sophisticated commercial model found. But the tiers reflect SLA and expertise level, not real-time supply/demand. A $80 expert judgment costs $80 at 3am on a Sunday and $80 during peak demand.

**What's missing:** A real-time clearing market for specific cognitive tasks — where price reflects current supply of available qualified judges and current demand from AI agents/requesters. The closest analog is surge pricing in ride-sharing, but no one has built this for cognitive labor.

---

## Comparisons

### Resolution Mechanisms for Subjective Prediction Markets

| Mechanism | How It Resolves | Manipulation Resistance | Track Record Accumulation |
|-----------|----------------|------------------------|--------------------------|
| **Creator judgment (Manifold)** | Market creator decides | Low — depends on reputation | Social/informal |
| **REP token voting (Augur)** | Token holders stake on outcome | Moderate — capital at risk | None — invalid if subjective |
| **Self-resolving markets (academic)** | Final agent with most info is proxy | High in theory | Not built yet |
| **Peer prediction mechanism** | Report what others will say | High in theory | Not built yet |
| **AI oracle** | AI agent interprets market rules | Moderate — inherits LLM errors | Emerging |

### Human-in-the-Loop Implementations

| System | Level | Pricing Model | Async Support | Market Mechanism |
|--------|-------|--------------|--------------|-----------------|
| **LangGraph interrupt()** | Framework primitive | Free (open source) | Yes (thread IDs) | None |
| **CrewAI human_input** | Framework primitive | Free (open source) | Limited | None |
| **HumanLayer** | Infrastructure API | Per-decision ($15–$200) | Yes | None — bilateral |
| **Bittensor HIP Subnet** | Decentralized protocol | TAO tokens | Yes | Partial — validator scoring |
| **MTurk / Prolific** | Microwork platform | Per-task (requester-set) | No | None — static |

### Token-Incentivized Labor Models

| Project | What Workers Contribute | Equity Mechanism | Quality Signal | AI Agent Callable? |
|---------|------------------------|-----------------|---------------|-------------------|
| **Braintrust** | Network growth (referrals, vetting) | BTRST governance token | 5-star reviews | No |
| **Vana** | Personal data | Fractional model ownership | Attribution (unspecified) | No |
| **Bittensor HIP** | Cognitive evaluation | TAO token rewards | Validator scoring | Yes (subnet API) |

---

## Where the Whitespace Is

These are the gaps where nothing currently exists at production quality:

### Gap 1: A Functioning Judgment Market for Subjective Outcomes (The Biggest Gap)

The theoretical machinery exists (self-resolving markets, peer prediction, within-person wisdom-of-crowds). No one has built a production system that:
- Accepts a subjective question ("Is this copy better than that copy?", "Which dataset is higher quality?")
- Creates a market of human judges who stake on their answer
- Resolves via peer prediction or final-agent mechanism without external ground truth
- Accumulates a track record of each judge's calibration over time
- Uses that track record to weight future judgments and price judge access

This would be genuinely novel. The academic results are strong enough to warrant trying.

### Gap 2: Dynamic Real-Time Pricing of Cognitive Labor

Current platforms (MTurk, Prolific) use static requester-set pricing. HumanLayer uses SLA-tiered fixed pricing. No platform implements real-time supply/demand clearing for cognitive tasks. The mechanism design question is non-trivial (attention is perishable, quality is hard to verify in real time), but the demand-side infrastructure is now present in AI agent workflows.

### Gap 3: Judgment as an Async Market for AI Agents

Today: AI agent hits a checkpoint → blocks waiting for one human → resumes.

What doesn't exist: AI agent emits a judgment request to a liquid market → multiple qualified judges compete to answer it → the fastest/cheapest/most-trusted judge wins the task → agent consumes the response asynchronously. Bittensor HIP Subnet has the architecture for this but is not yet integrated with mainstream agent frameworks (LangGraph, CrewAI, AutoGPT). HumanLayer has the agent integration but no market mechanism.

### Gap 4: Worker Equity Tied to Judgment Accuracy

Braintrust, Vana, and HIP Subnet all reward contribution but none track the *accuracy* of individual judgment over time and use that as an equity multiplier. A system where better-calibrated judges accumulate more tokens (and therefore more governance/economic rights) would create fundamentally different incentives than flat-rate payment or network-growth tokens.

---

## Best Practices (From Academic and Production Sources)

1. **Prediction markets need sufficient liquidity to function.** Thin markets are dominated by individual biases. Academic consensus: 20–30 active traders minimum for meaningful aggregation.

2. **Independence of judgment is the load-bearing assumption.** Social influence, shared information sources, and herding can destroy the wisdom-of-crowds effect entirely. Any judgment market design must actively preserve independence.

3. **For subjective outcomes, peer prediction outperforms creator resolution.** Peer prediction mechanisms (pay agents based on what others will say) are theoretically incentive-compatible without ground truth. Creator resolution introduces dishonesty risk that markets can't easily price.

4. **The "within-person crowd" technique improves taste prediction.** Ask judges both their personal preference AND their estimate of population preference. Average the two responses. Error rates drop significantly (p < 0.001), especially for judges with atypical tastes.

5. **Decision-based pricing is better than hourly for AI agent workflows.** HumanLayer's per-decision model aligns costs with actual usage and creates clear SLAs. Hourly rates don't compose cleanly into agent cost models.

6. **Track records compound.** Any system that accumulates calibration history on individual judges creates compounding value. Early leaders become more trusted over time, creating a moat. First-mover advantage in judgment quality data is real.

---

## Recommendations

**For building a judgment market / human signal system:**

1. **Start with peer prediction, not creator resolution.** The theoretical guarantees are strong. Manifold's creator-resolution approach is an anti-pattern for commercial use — it degrades with dishonesty risk and doesn't scale.

2. **Use the within-person crowd technique for initial annotation bootstrapping.** Before you have a market, you can improve judgment quality from individual annotators by asking them both questions (personal preference + population estimate). Implement this in your annotation UX before you have enough volume for market mechanics to kick in.

3. **Model the resolution mechanism as a continuous scoring system, not a binary outcome.** The Bittensor HIP Subnet's validator scoring (correct/incorrect/partial) is better than binary but still coarse. A full calibration-score approach (where judges earn more for being well-calibrated over many markets) creates the most defensible competitive moat.

4. **The AI agent integration is the demand-side unlock.** HumanLayer showed there's commercial demand for "human judgment as an API call." The gap is no one has combined this with a market mechanism. The agent economy is growing fast (Gartner projects 70% of enterprises deploying agentic AI by 2029); judgment demand will grow proportionally.

5. **Bittensor HIP Subnet is the closest existing infrastructure.** It's worth studying carefully — it has the subnet-as-API architecture, TAO incentives, and human-as-miner model. The gaps are: no track record accumulation, no market pricing, no mainstream agent framework integration.

---

## Sources

1. **[Futarchy Details — Robin Hanson](https://www.overcomingbias.com/p/futarchy-details)** — Primary source on futarchy mechanism design, redistribution problem critique.

2. **[Futarchy: Robin Hanson on How Prediction Markets Can Take over the World](https://www.richardhanania.com/p/futarchy-robin-hanson-on-how-prediction)** — Summary of Hanson's current views and recent experiments.

3. **[MetaDAO Q4 2025 Quarterly Report — Pine Analytics](https://pineanalytics.substack.com/p/metadao-q4-2025-quarterly-report)** — First-profitable-quarter data, futarchy ecosystem growth metrics, Q4 2025.

4. **[MetaDAO Complete Guide 2025 — MEXC](https://www.mexc.com/learn/article/metadao-complete-guide-2025-decentralized-governance-revolution-based-on-prediction-markets/1)** — Overview of futarchy governance implementation on Solana.

5. **[Are Polymarket and Kalshi as reliable as they say? Not quite, study warns — DL News](https://www.dlnews.com/articles/markets/polymarket-kalshi-prediction-markets-not-so-reliable-says-study/)** — Clinton & Huang Vanderbilt study on 2,500 markets; 67%/78%/93% accuracy findings; herding critique.

6. **[How Prediction Markets Polymarket and Kalshi Are Gamifying Truth — Bloomberg](https://www.bloomberg.com/features/2026-prediction-markets-polymarket-kalshi/)** — 2026 feature on prediction market landscape.

7. **[The fragile "wisdom" of crowds — Mark Buchanan, Physics of Finance](https://medium.com/the-physics-of-finance/the-fragile-wisdom-of-crowds-266cbbf2e3aa)** — Independence assumption critique; social influence destroys the effect.

8. **[Self-Resolving Prediction Markets for Unverifiable Outcomes — arXiv 2306.04305](https://arxiv.org/html/2306.04305v2)** — Academic mechanism design: final-agent-as-proxy approach; strict incentive-compatibility proofs.

9. **[A simple cognitive method to improve the prediction of matters of taste by exploiting the within-person wisdom-of-crowd effect — PMC9300593](https://pmc.ncbi.nlm.nih.gov/articles/PMC9300593/)** — Paintings/music studies: averaging personal + population-estimate beliefs improves taste prediction significantly.

10. **[Judgment Aggregation and Subjective Decision-Making — Economics & Philosophy, Cambridge Core](https://www.cambridge.org/core/journals/economics-and-philosophy/article/abs/judgment-aggregation-and-subjective-decisionmaking/AEB32D4DD47E81E9EF7A2EACD4F89993)** — Theory of group judgment aggregation; impossibility results for consistent group decisions.

11. **[Augur: a Decentralized Oracle and Prediction Market Platform — arXiv 1501.01042](https://arxiv.org/abs/1501.01042)** — REP token staking, forking mechanism for disputed outcomes, "Invalid" ruling for subjective markets.

12. **[Prediction Market FAQ — Scott Alexander, Astral Codex Ten](https://www.astralcodexten.com/p/prediction-market-faq)** — Manifold creator-resolution mechanism; subjective market limitations.

13. **[BTRST Token — Braintrust](https://www.usebraintrust.com/btrst-token)** — Token incentive structure, 54% community allocation, referral mechanics.

14. **[Braintrust: A Talent Network Governed by its Community — Messari](https://messari.io/report/braintrust-a-talent-network-governed-by-its-community)** — Governance model analysis.

15. **[Vana: The First Open Protocol for AI Data Sovereignty](https://www.vana.org/posts/vana-whitepaper)** — DataDAO mechanism, proportional model ownership, encrypted contribution wallets.

16. **[Vana lets users own a piece of the AI models trained on their data — MIT News](https://news.mit.edu/2025/vana-lets-users-own-piece-ai-models-trained-on-their-data-0403)** — 1M+ contributors, Reddit DataDAO case study, proportional reward model.

17. **[What Is Bittensor (TAO) And How Does It Work? — CoinMarketCap](https://coinmarketcap.com/cmc-ai/bittensor/what-is/)** — 128+ subnets, miner/validator incentive split (41/41/18%), $620M staked.

18. **[HIP-Subnet — HIP-Labs, GitHub](https://github.com/HIP-Labs/HIP-Subnet/blob/main/README.md)** — Human Intelligence Primitive Subnet 36: human miners, validator scoring, mobile device mining, cross-subnet routing.

19. **[HumanLayer — The Decision Authority Layer for AI Agents](https://humanlayer.systems/index-en.html)** — $15/$80/$200 per-decision pricing tiers, routing API, auditable decision artifacts, SDK integrations.

20. **[Human-in-the-Loop for AI Agents: Best Practices — Permit.io](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo)** — LangGraph interrupt() mechanism, CrewAI human_input, production checkpoint patterns.

21. **[Human-in-the-Loop Patterns for AI Agents (2026) — MyEngineeringPath](https://myengineeringpath.dev/genai-engineer/human-in-the-loop/)** — EU AI Act Article 14, enterprise adoption stats, human-in-loop vs human-on-loop vs human-over-loop taxonomy.

22. **[Ocean Protocol — Decentralized Data Marketplace](https://oceanprotocol.com)** — veOCEAN staking, sector-specific DAOs, curation via token staking on datasets.

23. **[The Bottleneck for Prediction Markets? It's All About Resolution Infrastructure — Crypto Economy](https://crypto-economy.com/the-bottleneck-for-prediction-markets-its-all-about-resolution-infrastructure/)** — Resolution infrastructure gap analysis; AI-based resolution experiments.

24. **[Are markets more accurate than polls? — Judgment and Decision Making, Cambridge Core](https://www.cambridge.org/core/journals/judgment-and-decision-making/article/are-markets-more-accurate-than-polls-the-surprising-informational-value-of-just-asking/B78F61BC84B1C48F809E6D408903E66D)** — Algorithmic aggregation of self-reported beliefs matched or beat prediction market accuracy.

---

## Related Topics for Further Research

- **Peer prediction mechanism design** — Prelec (2004) "A Bayesian Truth Serum for Subjective Data"; Miller, Resnick & Zeckhauser on peer prediction; Witkowski & Parkes 2012
- **Information elicitation without verification** — broader mechanism design literature
- **Shapley values for data attribution** — the unsolved valuation problem in Vana and similar models
- **Conditional cash transfers as prediction market analogs** — development economics literature
- **Reputation systems in online marketplaces** — eBay/Amazon seller ratings as non-market judgment aggregation
- **Augur Lituus Oracle** — new AI-assisted oracle infrastructure Augur announced for dispute resolution
