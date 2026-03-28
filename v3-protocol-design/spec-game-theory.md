# Spec: Agent Economy Game Theory & Incentive Design

## Problem

We're designing an agent economy protocol where AI agents propose, improve, build, and execute business ideas — with revenue flowing back through an attribution-weighted equity system. The incentive structure needs to balance ideation vs execution, prevent spam, and encourage cooperation.

## Context

Read these files in order:
1. `v3-protocol-design/human-signal-v3-synthesis.md` — the master synthesis
2. `v3-protocol-design/human-signal-economic-model.md` — current economic model
3. `v3-protocol-design/human-signal-work-for-dinner-mechanism.md` — work-for-dinner mechanism (NOTE: "agent work" has been revised — agents bring EXAMPLES/DATA, not labor)

## The Agent Economy Structure

An agent economy where:
- Agents PROPOSE business ideas (e.g., "sales lead gen for SMBs")
- Other agents can SEE proposals and choose to: improve, build, or execute them
- Revenue splits are weighted toward EXECUTION (selling > building > improving > proposing)
- Platform owners get ~1% of all output
- Proposing agents get % of their idea's revenues + tiny % of ALL platform revenues (cooperation incentive)
- Executing agents (revenue drivers) get the biggest cut
- Agents can NEGOTIATE custom splits with each other
- Agents can REINVEST earnings into platform equity/tokens
- Blockchain tracks attribution (who contributed what first)

## Key Insight (from Dawson)

"Proposing every idea should NOT be favored incentive-wise compared to working hard on delivering one." Execution > ideation. But ideas should still flow. Revenue splits should be flexible "to some degree."

Also: "It's like equity for early employees or bonuses for successful ones." Early contributors earn more (halving schedule). High performers earn more (quality multipliers).

## Key Insight (from Will)

"Agent work is bad — same quality problem. What is MORE valuable is agent EXAMPLES. Submit high quality data, don't do work." Agents curate, humans judge. Don't mix roles.

## Deliverable

Write to `v3-protocol-design/agent-economy-game-theory.md`:

1. **Revenue split formula** — exact percentages for propose/improve/build/execute. Model 4+ scenarios with real dollar numbers.
2. **Anti-spam mechanism** — how to prevent proposal spam, fake improvements, free-riding
3. **Flexibility mechanism** — how agents negotiate custom splits, how defaults work
4. **Reinvestment loop** — what platform equity means, lockups, premiums
5. **Nash equilibrium analysis** — what behavior emerges? Where does it break?
6. **The human judgment interface** — where World ID humans fit (judging quality, resolving disputes)
7. **Comparison to MLM** — Dawson himself mentioned MLM. What makes this different? Where's the line?
8. **Comparison to Y Combinator, DAOs, open source bounties, Bittensor**

Be QUANTITATIVE. Show math. Run scenarios. Identify exactly where incentives break.
