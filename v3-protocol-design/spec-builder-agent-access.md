# Builder Spec: Agent Accessibility — Easy Links, Commands, SDK

## Problem

An AI agent (or developer building one) needs to be able to use Human Signal with minimal friction. Right now the API exists but there's no easy onboarding, no quick-start commands, no copy-paste integration snippets.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory
- Docs page: `web/app/docs/page.tsx`
- Demo script: `demo-create-task.ts`
- API routes: `web/app/api/tasks/route.ts`, `web/app/api/tasks/[id]/vote/route.ts`
- Live at themo.live

Read the existing docs page and API routes first.

## Changes Needed

### 1. Agent Quick-Start on Docs Page

Add a prominent "Agent Quick Start" section to /docs with:

**One-liner:**
```bash
curl -X POST https://themo.live/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"question":"Which design is better?","options":["Design A","Design B"],"tier":"quick","bountyPerVote":"0.08","maxVoters":10}'
```

**Python snippet:**
```python
import requests
response = requests.post("https://themo.live/api/tasks", json={
    "question": "Which design is better?",
    "options": ["Design A", "Design B"],
    "tier": "quick",
    "bountyPerVote": "0.08",
    "maxVoters": 10
})
task = response.json()
# Poll for results
results = requests.get(f"https://themo.live/api/tasks/{task['id']}").json()
```

**JavaScript/TypeScript snippet:**
```typescript
const task = await fetch("https://themo.live/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question: "Which design is better?",
    options: ["Design A", "Design B"],
    tier: "quick",
    bountyPerVote: "0.08",
    maxVoters: 10
  })
}).then(r => r.json());
```

### 2. Agent Dashboard / Status Page

Add a simple `/agent` route that shows:
- API status (is the service up?)
- Number of active tasks
- Average response time (how fast do humans respond?)
- Current worker pool size
- Pricing tiers (quick/reasoned/detailed with costs)

This is the "is this thing alive?" page for agents/developers.

### 3. Easy Links

Add clear navigation:
- themo.live/docs → API documentation
- themo.live/agent → Agent dashboard/status
- themo.live/work → Human worker feed
- themo.live/task/[id] → Task detail + results

### 4. Webhook / Callback Support

If time allows, add a `callback_url` field to task creation. When a task reaches its vote target, POST the results to the callback URL. This lets agents work asynchronously instead of polling.

```json
{
  "question": "...",
  "options": [...],
  "callback_url": "https://myagent.com/webhook/human-signal"
}
```

### 5. README Quick Start

Update the README.md with:
- 3-line "Get human judgment in 60 seconds" quick start
- Link to /docs
- Link to demo-create-task.ts as reference implementation

## Deliverable

Working code changes focused on making it dead simple for an agent/developer to start using the API. Commit when done.
