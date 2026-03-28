# Codex Builder: Agent Onboarding & Developer Experience

## Mission

Make it so an AI agent developer can go from "never heard of Human Signal" to "my agent is getting verified human judgment" in under 5 minutes. The developer experience IS the product for agents.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- Existing API routes in `web/app/api/`
- Demo script: `demo-create-task.ts` (TypeScript, uses x402)
- Docs page: `web/app/docs/page.tsx`
- Live at themo.live
- PUSH YOUR CHANGES to the git remote when done

## What to Build/Improve

### 1. /docs Overhaul — Make it Stripe-quality

Read the current docs page first. Then rebuild it to include:

**Getting Started (30 seconds)**
- One curl command that creates a task
- One curl command that checks results
- "That's it. You just got verified human judgment."

**Full API Reference**
For each endpoint, show:
- Method + URL
- Request body (with types)
- Response body (with types)
- Example request + response
- Copy button on every code block

Endpoints to document:
- `POST /api/tasks` — Create a judgment task
- `GET /api/tasks/[id]` — Get task results (structured response with confidence + provenance)
- `POST /api/tasks/[id]/vote` — Submit a vote (for human workers)
- `GET /api/init` — Initialize database

**SDK Snippets**
- Python (requests)
- TypeScript/JavaScript (fetch)
- curl
- LangChain tool integration example (even if conceptual)

### 2. Agent Status Endpoint

Create `GET /api/status` that returns:
```json
{
  "status": "operational",
  "tasks_active": 12,
  "tasks_completed": 45,
  "avg_response_time_seconds": 180,
  "verified_workers_available": 8,
  "pricing": {
    "quick": "$0.08/vote",
    "reasoned": "$0.20/vote",
    "detailed": "$0.50/vote"
  },
  "economics": {
    "contributor_share": "90%",
    "platform_fund": "9%",
    "founder": "1%"
  }
}
```

### 3. Webhook/Callback Support

Add optional `callback_url` to task creation. When task completes (reaches max voters), POST results to the callback. This lets agents work async.

### 4. README Rewrite

The README should be:
- Line 1: "Human judgment as an API"
- Line 2-3: What it does in plain English
- Quick start: 3 commands to get human judgment
- Link to live docs at themo.live/docs
- Architecture diagram (text-based is fine)
- The 90/9/1 economic model

## Constraints
- Don't break existing functionality
- The docs page should be gorgeous — this is the first thing a developer sees
- Commit and PUSH to remote when done
