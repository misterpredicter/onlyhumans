# Codex Builder: Incentive Model — Simplify With Taste

## Mission

The incentive design is the soul of this platform. Your job: make it elegant, understandable, and visible in the product. Sometimes simpler is better. Don't overcomplicate — but think deeply about every choice.

The core principle: **free market dynamics within a transparent structure.** The 90/9/1 split is the constitution. Everything inside the 90% is market-driven.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- Read `v3-protocol-design/human-signal-v3-synthesis.md` for the full vision
- Read `v3-protocol-design/human-signal-economic-model.md` for current economic model
- Live at themo.live
- PUSH YOUR CHANGES to the git remote when done

## The Economic Model to Implement

### The Constitution (immutable)
```
Total Revenue: 100%
├── Contributors: 90% (market-determined split below)
│   ├── Idea Contributors: variable (1-20% of the 90%, set by proposer)
│   └── Workers: remainder of the 90%
├── Platform Fund: 9%
└── Founder: 1%
```

### How the 90% Splits

**Idea Contributors** propose tasks/ideas/frameworks and set their own take rate from the 90%. Lower take = more attractive to workers. Higher take = need a better idea to justify it. Market forces find equilibrium.

**Workers** choose which tasks to work on based on: pay per vote, how interesting the task is, and the split visibility. Workers see the economics BEFORE they commit.

### What to Build

1. **`web/lib/economics.ts`** — The founding economics as immutable constants. Include:
   - The 90/9/1 split
   - Idea contributor range (1-20% of the 90%)
   - Helper functions: `calculateWorkerPayout(taskRevenue, ideaContributorShare)`, `calculatePlatformFee(taskRevenue)`, `calculateFounderFee(taskRevenue)`

2. **Economics in Task Creation** — When someone creates a task, they can optionally set an `ideaContributorShare` (default: 5%). This is visible to workers.

3. **Economics Display Component** — A reusable React component that shows the revenue split for any task:
   ```
   ┌─────────────────────────────────┐
   │ Revenue Split                    │
   │ ████████████████████░░░ Workers 85.5% │
   │ ██░░░░░░░░░░░░░░░░░░░ Idea      4.5% │
   │ █░░░░░░░░░░░░░░░░░░░░ Platform  9.0% │
   │ ░░░░░░░░░░░░░░░░░░░░░ Founder   1.0% │
   └─────────────────────────────────┘
   ```
   Show this on: task detail pages, /work feed (per task), /docs, homepage.

4. **Leaderboard / Reputation** — Simple leaderboard showing:
   - Top workers by earnings + accuracy
   - Top idea contributors by total revenue generated
   - These create competitive pressure naturally

5. **The "Why" Explanation** — Somewhere in the product (maybe /docs or a dedicated /economics page), explain WHY these economics exist:
   - "90% goes to the people who do the work and have the ideas"
   - "9% funds platform development — servers, features, growth"
   - "1% to the founder — skin in the game, not extraction"
   - "Idea contributors set their own rate — the market decides if it's fair"
   - "Workers choose what to work on — vote with your attention"

## Design Philosophy

- **Transparency is the feature.** Every payment, every split, every fee is visible. No hidden margins.
- **Simplicity over cleverness.** If a mechanism needs a whitepaper to explain, simplify it.
- **Free market over central planning.** Don't set optimal splits — let participants find them.
- **Show, don't tell.** The economics component should be visual, not a wall of text.

## Anti-Patterns to Avoid

- Don't add token/credit systems — this is USDC-native
- Don't add staking or deposits — free to participate
- Don't add complex reputation formulas — start with simple vote count + accuracy %
- Don't add governance mechanisms — too early
- Don't add anything that requires explaining "tokenomics" — if you need that word, simplify

## Constraints
- Don't break existing functionality
- The economics should feel like a badge of honor, not fine print
- Commit and PUSH to remote when done
