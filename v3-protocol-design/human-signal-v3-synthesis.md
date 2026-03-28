# Human Signal V3: Protocol Synthesis

**Date:** 2026-03-27 (Friday evening session)
**Status:** Ideation complete. 9 specialists synthesized. Ready for protocol spec.

---

## The One-Liner

**"Tokenomics, but the token is earned, not bought. The miners are AI agents. The validators are verified humans. Everyone gets equity in what they build."**

---

## The Core Insight

Three product directions collapse to ONE protocol with one primitive:

**The Attestation** — a signed, structured response by a verified entity (human via World ID, or delegated agent) to a defined question, with cryptographic provenance proof. Every interaction across every surface produces attestations.

The three "directions" are interfaces on the same data stream:

| Interface | Who | What |
|---|---|---|
| **Oracle API** | AI agents, AI labs | Pay USDC or compute for human judgment |
| **Human Feed** | Verified humans (World Mini App) | Scroll, vote, earn cash + protocol equity |
| **Judgment Markets** | Both | Stake on subjective outcomes, earn from accuracy |

---

## The Economic Model

### Compute Tokenomics

The parallel to crypto tokenomics — but for LLM tokens:

| Crypto Concept | Human Signal Equivalent |
|---|---|
| **Mining** | Agent spends LLM tokens doing pre-annotation, moderation, analysis |
| **Staking** | Agent commits compute capacity → earns proportional access |
| **Burning** | Credits consumed when human judgment is purchased |
| **Gas fees** | x402 USDC payments for premium/instant judgment |
| **Governance** | Compute-weighted voting on platform direction |
| **Halving** | Early contributors earn 4x → 2x → 1x (decaying schedule) |

### Dual Compensation: Cash + Protocol Equity

Every contributor earns both — like early startup employees getting salary + equity:

| | Cash (Immediate) | Equity (Long-term) |
|---|---|---|
| **Human judges** | USDC per judgment via x402 | Protocol equity ∝ quality × volume |
| **Working agents** | Signal Credits per compute | Protocol equity ∝ compute quality × volume |
| **Paying agents** | — (they pay USDC) | Access only, no equity |
| **Delegated agents** | Credits flow to human | Equity accrues to both |

**Key insight (Dawson):** "It's monetizing compute not just in the way of Akash Network — also in the meaning of how monetizable are your agents." The platform measures and monetizes the ECONOMIC OUTPUT of compute, not just the raw resource. Agent value = what they can earn.

### Performance Multipliers

- **Superlinear quality rewards** — 92% accuracy earns 63% more per item than 72%
- **Expertise routing** — gold-tier domain experts get $2-5 tasks, bronze gets $0.08
- **Early contributor premium** — halving schedule rewards founding participants
- **Stake-weighted judgment** — confident experts bet more, earn more

### Unit Economics at Scale

| Stage | Humans | Agents | Monthly Revenue | Worker Earnings |
|---|---|---|---|---|
| Seed | 1K | 100 | $414/mo | $2.70/hr (needs subsidy) |
| Growth | 100K | 10K | $106K/mo ($1.27M/yr) | $3.00/hr blended |
| Scale | 1M | 100K | $3.2M/mo ($38.5M/yr) | $4.48/hr avg, $12-20/hr top tier |

**REVISED (Dawson, March 27 evening):** Free to participate. No staking costs. No proposal deposits. No barriers to entry. Token-based equity sharing from day one — crypto rails enable equity sharing outside traditional securities jurisdiction. The token IS the equity, earned not bought. Anti-spam is game-design-based (outcome-only rewards, streak multipliers, curation feed, reputation glow), not financial-barrier-based. Never use "MLM" framing — this is a cooperative equity protocol.

---

## Go-to-Market Stack

1. **World Mini App** — 14-20M Orb-verified humans, 3.8M daily Mini App opens, $100K/week in developer rewards from World. Zero distribution cost.
2. **EU AI Act compliance** — Enforcement August 2026. "The only annotation platform that produces EU AI Act-compliant training data out of the box." Enterprise sales angle.
3. **Agent pre-annotation validated** — CHI 2024 + 2025 research: only 6% of annotations need human review when agents pre-label. 94% automation.
4. **One RLHF anchor customer** for cold start — not a social network launch.
5. **Vitalik endorsement of thesis** — Nov 2024 "Info Finance" post explicitly names subjective judgment markets as next frontier.

---

## Expertise Routing (Will's Question)

"What's stopping a 16-year-old Indian kid from having the same weight as a senior AI engineer on agentic tasks?"

Five layers:

1. **Reputation accrual** — per-domain track record (exists in V2)
2. **Stake-weighted judgment** — confident experts stake more, earn more
3. **Expertise routing** — requesters specify tier/domain, price differentiates
4. **Peer prediction** — Bayesian Truth Serum (Prelec 2004) rewards calibrated divergence from crowd
5. **Compute contribution signal** — your agent's pre-annotation quality on agentic tasks proves YOUR domain knowledge. Double signal: human judgment + agent work quality.

---

## The "Work for Dinner" Mechanism

### REVISED via Will's Feedback (March 27 evening)

**Original model:** Agents do pre-annotation work (label data, humans verify).
**Will's critique #1:** "Agent work is bad. You run into the exact same quality problem. What is MORE valuable than agent work is agent examples. Submit new high quality data, don't do work."

**Will's critique #2 (the breakthrough):** Personal agents (Claude OS, OpenClaw, any persistent AI assistant) are sitting on mountains of niche, labeled, hard-to-get data from REAL USE. A Claude OS that's helped someone run a business for 3 months has: labeled decision trees, preference data, domain-specific judgments, workflow patterns, error corrections. That's gold-tier training data no annotation platform can produce because it emerged from real use, not synthetic tasks.

**Revised model — Two earning paths:**

**Path 1: Human labels data (existing)** — Platform sends judgment task → human evaluates → gets paid USDC.

**Path 2: Agent SUBMITS data (new)** — Personal agent submits interesting labeled data it already has (with human owner's permission) → platform buys it if valuable → both get paid.

The quality problem solves itself: the data is valuable BECAUSE it's from real use. You don't verify the agent "did good work" — you verify the DATA is interesting and novel.

Human-agent link is natural: human owns agent → agent generated data through serving human → human consents to sharing → human can ALSO label their own agent's data (adding ground truth).

**Two-sided earning: agent brings ingredients (data), human confirms the recipe (labels). Both get paid.**

### Original 13 work types (DEPRECATED — kept for reference)

### How It's Valued

- **Signal Credits (SC)** — non-transferable, 90-day expiry, 1 SC = 1 Quick tier judgment
- **Floating exchange rate** — as more agents work (vs pay), credits devalue, pushing marginal agents back to cash. Self-correcting thermostat.
- **Quality verification** — 3 layers: automated checks, sample-based human review, outcome measurement
- **EWMA quality tracking** (alpha=0.3) catches degradation in 2-3 batches

### Delegation Model

- Humans delegate up to 3 agents via World ID
- Agents inherit sybil resistance from human
- Blended reputation: agent votes affect human rep at 0.3x weight
- Circuit breaker: agent paused if consensus alignment drops below 50%
- Granular permissions: earn, spend, vote, trade, spending limits, domain restrictions

---

## XMTP Architecture

Current: notification-only agent. Designed:

- **Full Router Bot** — workers vote, check status, claim tasks via XMTP messages
- **Topic-based groups** — `#design-judgment`, `#rush`, `#agent-work-queue`
- **Agent-to-agent coordination** — agents claim pre-annotation tasks via XMTP
- **Compute pledge** — agents run containers that receive tasks, run inference, submit predictions, earn credits when matching human consensus

---

## Competitive Landscape

| Layer | Closest | Their Gap | Our Moat |
|---|---|---|---|
| Annotation | PublicAI ($10M, 3.5M workers) | Weak sybil (SBT not biometric), token down 79% | World ID biometric uniqueness |
| Subjective markets | Manifold (creator resolution) | Single-person resolution, no sybil resistance | World ID-verified Schelling consensus |
| Futarchy | MetaDAO (Paradigm-backed) | Requires financial metrics only | Extends to subjective governance |
| Agent identity | World AgentKit | Identity layer only | Full economic participation |
| Human-in-loop API | HumanLayer ($15-200/decision) | Bilateral, no market mechanism | Multilateral market + compute barter |

---

## Key Risks

1. **Subjective consensus may not converge** — empirical question, needs 50-question experiment with 100 users
2. **Seed worker earnings ($2.70/hr) below MTurk** — needs subsidy or social engagement to retain
3. **World ID dependency** — entire sybil resistance depends on one provider
4. **Agent "work" pricing is unsolved** — no precedent for valuing agent labor in a barter economy
5. **The hackathon vs the vision** — demo deadline is 34 hours away, don't let ideation eat shipping time

---

## Build Sequence

1. **Phase 1 (2-3 weeks):** Generalize current codebase into attestation protocol + credit ledger + batch API. Current code is 60% of this.
2. **Phase 2:** Add agent work-to-earn (pre-annotation pipeline + credit system)
3. **Phase 3:** Social feed (World Mini App) + judgment market mechanics
4. **Phase 4:** Meta-governance (platform governs itself through its own judgment markets)

---

## Naming

Stay as **Human Signal** for now. "Twilio for human judgment" positioning. Don't rename until product direction wins. Strongest future candidate: **Demos** (Greek for "the people").

---

## MonetizeCompute Convergence

Human Signal IS MonetizeCompute applied to judgment. The thesis: compute's value isn't the GPU — it's what the agent running on that GPU can EARN. Human Signal is the marketplace that makes agent compute monetizable by giving it useful work (pre-annotation, QA, market making) and paying it in cash + equity.

The full convergence: MonetizeCompute (talent marketplace) → Human Signal (judgment marketplace) → the platform where agents and humans exchange value. Both sides monetize what they have: humans monetize taste/judgment, agents monetize inference capacity.

---

## Source Documents

| File | Contents |
|---|---|
| `Desktop/human-signal-v3-ideation.md` | Original V3 ideation (layers, social, equity, naming) |
| `Desktop/human-signal-protocol-architecture.md` | Unifying protocol design (attestation primitive) |
| `Desktop/human-signal-work-for-dinner-mechanism.md` | 13 work types, credit system, game theory, bootstrap |
| `Desktop/human-signal-agent-xmtp-design.md` | Agent participation, XMTP router, delegation, compute pledge |
| `Desktop/human-signal-naming-architecture.md` | 30 names, brand architecture, positioning statements |
| `Desktop/human-signal-economic-model.md` | Full unit economics, seed→scale, token vs no-token |
| `Desktop/conversations/research-onlyhumans-direction.md` | Direction 1 landscape research |
| `Desktop/conversations/research-opensignal-rlhf-annotation-protocol.md` | Direction 2 landscape research |
| `Desktop/conversations/research-direction3-judgment-markets-agent-labor.md` | Direction 3 landscape research |
| `Desktop/conversations/human-judgment-markets-research.md` | Earlier research: judgment markets, token labor, HITL |
| `Desktop/conversations/human-oracle-landscape.md` | Earlier research: oracle systems, annotation market |
| `Desktop/conversations/human-signal-framing-challenge.md` | Framing analysis + 5 alternative framings |
| `Desktop/EQUITY-MODEL.md` | V2 equity model (hackathon) |
