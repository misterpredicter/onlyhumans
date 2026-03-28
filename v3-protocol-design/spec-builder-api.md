# Builder Spec: API Enhancement — Response Schema + Economic Model

## Problem

The Human Signal API needs to return structured, typed responses that agents can act on — not just raw vote counts. And the economic model needs to reflect the 90/9/1 split: 90% to contributors (workers/agents), 9% to platform fund, 1% to platform owner.

## Context

- Hackathon project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- API routes in `web/app/api/`
- Database: Neon Postgres (connection via DATABASE_URL env var)
- Live at themo.live, deployed via Vercel
- Git repo: github.com/misterpredicter/worldxcoinbasexxmptproject.git

Read the existing API routes first:
- `web/app/api/tasks/route.ts` — task creation
- `web/app/api/tasks/[id]/vote/route.ts` — voting
- `web/app/api/init/route.ts` — database init

## Changes Needed

### 1. Typed Response Schema

When an agent GETs a task's results, the response should include:
```json
{
  "task_id": "...",
  "question": "...",
  "status": "active" | "completed",
  "consensus": {
    "winner": "Option B",
    "confidence": 0.85,
    "distribution": {"Option A": 0.15, "Option B": 0.85},
    "total_votes": 20,
    "agreement_score": 0.72
  },
  "provenance": {
    "unique_humans": 20,
    "verification": "world_id_v4",
    "nullifier_count": 20,
    "chain": "base_sepolia"
  },
  "meta": {
    "created_at": "...",
    "tier": "reasoned",
    "bounty_per_vote": "0.20"
  }
}
```

Add a GET endpoint for `/api/tasks/[id]` that returns this structured response. This is what agents consume.

### 2. Economic Model — 90/9/1 Split

Update the payment logic in the vote route:
- When a task pays out, 90% goes to the worker (human judge)
- 9% goes to a platform fund wallet (can be a DB counter for now, doesn't need to be on-chain yet)
- 1% goes to the owner wallet

For now, this can be tracked in the database as `platform_fund_balance` and `owner_balance` columns. The actual on-chain split can come later — the logic just needs to be visible in the API responses and task details.

### 3. Confidence Score Calculation

Add a simple confidence calculation:
- `confidence = max_vote_share` (if 17/20 voted Option B, confidence = 0.85)
- `agreement_score = 1 - entropy(distribution) / max_entropy` (normalized Shannon entropy)

### 4. Add provenance to vote responses

When a vote is cast, the response should include the World ID nullifier hash as a provenance proof.

### 5. Founder-Proof Economics

The 90/9/1 split must be baked into the architecture as a visible, auditable constant — not a config that can be quietly changed later. Create a `web/lib/economics.ts` file:

```typescript
// FOUNDING ECONOMICS — These ratios are the social contract of the platform.
// Changing them requires community governance (future judgment market vote).
export const ECONOMICS = {
  CONTRIBUTOR_SHARE: 0.90,  // 90% to workers (humans + agents)
  PLATFORM_FUND: 0.09,      // 9% to platform development fund
  FOUNDER_SHARE: 0.01,      // 1% to founder (dawson)
  VERSION: 1,                // Increment on any change
  RATIFIED: '2026-03-27',   // Date these economics were established
} as const;
```

Reference this constant everywhere revenue splits are calculated. The `as const` + the comment block makes it clear this is a social contract, not a tunable parameter. Display it on the /docs page and the homepage ("90% to contributors. 9% to platform. 1% to founder.").

Also add a `platform_ledger` table to track all revenue flows transparently:
```sql
CREATE TABLE platform_ledger (
  id SERIAL PRIMARY KEY,
  task_id TEXT,
  total_amount DECIMAL,
  contributor_amount DECIMAL,
  platform_fund_amount DECIMAL,
  founder_amount DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Every payment gets a ledger entry. Full transparency.

## Deliverable

Working code changes. Commit when done. Make sure the existing functionality doesn't break — run the dev server and verify.
