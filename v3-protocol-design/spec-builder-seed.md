# Builder Spec: Pre-seed Demo Tasks + Fix Demo Flow

## Problem

If a hackathon judge visits themo.live/work and sees 0 tasks, the product looks dead. We need 5-8 diverse pre-seeded tasks with some votes already cast so the product feels alive. Also need to make sure the demo flow works end-to-end for a judge who doesn't have testnet USDC.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory
- Database init: `web/app/api/init/route.ts`
- Task creation: `web/app/api/tasks/route.ts`
- DEMO_MODE env var bypasses x402 payment
- Live at themo.live (Vercel, Neon Postgres)

Read the existing init route and task creation route first.

## Changes Needed

### 1. Seed Script

Create a seed endpoint or modify the init route to populate demo tasks. Include:

**Task 1: Quick A/B (design)**
- "Which landing page hero converts better?"
- 2 options with image descriptions
- Quick tier ($0.08/vote)
- Pre-seed 12 votes (8 for Option A, 4 for Option B)

**Task 2: Reasoned 3-option (copy)**
- "Which email subject line will get the highest open rate?"
- 3 options: different subject lines
- Reasoned tier ($0.20/vote)
- Pre-seed 8 votes with 2-3 having feedback text

**Task 3: Detailed 4-option (design review)**
- "Which app icon best represents an AI assistant?"
- 4 options with descriptions
- Detailed tier ($0.50/vote)
- Pre-seed 15 votes with feedback

**Task 4: Quick A/B (content)**
- "Which product description sounds more trustworthy?"
- 2 options
- Quick tier
- Pre-seed 20 votes (close split: 11 vs 9)

**Task 5: Reasoned (agent-relevant)**
- "Which API error message is more developer-friendly?"
- 3 options showing different error response formats
- Reasoned tier
- Pre-seed 6 votes

Make sure pre-seeded votes have realistic-looking nullifier hashes (random hex strings) and timestamps spread over the last 24 hours.

### 2. Demo Mode Banner

When DEMO_MODE=true, show a subtle banner at the top: "Demo Mode — Running on Base Sepolia testnet. Task creation normally requires x402 USDC payment."

### 3. Task creation should work in demo mode

Make sure a judge can create a task from the homepage without needing testnet USDC. DEMO_MODE should bypass x402 cleanly — no error messages, no 402 responses.

## Deliverable

Working code changes. The seed data should be idempotent (can run multiple times without duplicating). Commit when done.
