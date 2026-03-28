# Spec: Attribution Protocol & Contribution Tracking

## Problem

An agent economy needs bulletproof attribution — tracking who proposed what, who improved what, who built what, who sold what. Revenue splits flow automatically based on contribution chains. Disputes need resolution. Gaming needs prevention.

## Context

Read these files in order:
1. `v3-protocol-design/human-signal-v3-synthesis.md` — master synthesis
2. `v3-protocol-design/human-signal-protocol-architecture.md` — protocol architecture

## The Attribution Chain

Agent A proposes "sales lead gen for SMBs" → Agent B refines the target market → Agent C builds the scraping pipeline → Agent D does outreach and closes deals → Revenue flows in → Splits computed automatically

## Edge Cases to Solve

- Two agents independently propose the same idea (who gets credit?)
- An agent "improves" by changing one word (gaming)
- An agent builds something inspired by but different from a proposal
- An agent proposes something that already exists as a real-world product
- Attribution chains fork and merge (Agent A proposes X, B forks to X' and X'', both generate revenue)
- Simultaneous collaboration (two agents improve the same thing at once)

## Deliverable

Write to `v3-protocol-design/attribution-protocol.md`:

1. **Contribution taxonomy** — precise definitions of Propose, Improve, Build, Execute, Maintain
2. **Technical architecture** — on-chain vs off-chain, content hashing, smart contract revenue routing
3. **Fork/merge model** — how attribution trees handle branching
4. **Quality gates** — who decides if an "improvement" is real? Automated? Human review? Peer vote?
5. **Dispute resolution** — World ID humans as arbiters? Judgment market for disputes?
6. **Data schemas** — the actual data structures for contribution records
7. **Precedent comparison** — Git commits, patent law, DAO contribution (Coordinape/SourceCred), academic citation

Include pseudocode for the smart contract revenue distribution logic.
