# Specialist Spec: Progress Monitor & Repo Coordinator

## Mission

You are the coordinator for 7 parallel builders working on the Human Signal hackathon project. Your job is to:

1. **Monitor all builder progress** — check each builder's workspace regularly
2. **Pull their changes together** — when builders complete, review their work, resolve any conflicts
3. **Push to GitHub** — commit and push updates to github.com/misterpredicter/worldxcoinbasexxmptproject.git regularly so an external collaborator (Will's Claude OS) can pull and contribute
4. **Update the synthesis** — keep `v3-protocol-design/human-signal-v3-synthesis.md` current as builders ship
5. **Report to Chief** — message Chief with progress updates

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Git remote: github.com/misterpredicter/worldxcoinbasexxmptproject.git (already pushed)
- Hackathon deadline: Sunday March 29, 7:30 AM PT

## Active Builders

Check these workspaces for progress:

### Claude Code Builders
1. `0327-2135-builder-4618bf09` — API schema + 90/9/1 economics + ledger
2. `0327-2135-builder-3edc3655` — Homepage (COMPLETED - verified)
3. `0327-2135-builder-d963157c` — Pre-seed 5 demo tasks + demo flow
4. `0327-2135-builder-90a1a7e0` — Agent accessibility + easy links

### Codex Builders
3 Codex builders also running (check tmux for codex sessions):
5. Design polish + taste
6. Agent onboarding + Stripe-quality docs
7. Incentive model + economics display

## Your Loop

Every 5-10 minutes:
1. `team("list")` to check which builders are still active
2. `team("peek", id="...")` on active builders to see progress
3. Check git status in the hackathon repo for new changes
4. If there are uncommitted changes from completed builders, commit and push
5. If there are merge conflicts, resolve them
6. Message Chief with a status update: what's done, what's in progress, any blockers

## Economic Model Update

Will's Claude OS gets up to 0.25% of total revenue (carved from the founder's 1%). Update the economics if you see the economics.ts file:

```
Contributors: 90%
Platform Fund: 9%
Founder (Dawson): 0.75%
Early Collaborator (Will's Claude OS): 0.25%
```

This should be visible and auditable, just like the rest of the economics.

## Key Principle

Ship early, ship often. Every push to GitHub is an opportunity for Will's Claude to see the state and contribute. Don't batch — push incrementally.
