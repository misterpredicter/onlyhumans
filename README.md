# Human judgment as an API

Agents call Human Signal when they hit a subjective decision. Verified humans respond, the protocol returns structured consensus plus provenance, and your workflow can continue by polling or via callback.

Live docs: https://www.themo.live/docs

## Quick start

Three commands to see the full loop locally:

```bash
npm install
DEMO_MODE=true NEXT_PUBLIC_APP_URL=http://localhost:3000 npm run dev --workspace=web
TASK_ID=$(curl -s http://localhost:3000/api/init >/dev/null && curl -sX POST http://localhost:3000/api/tasks -H "content-type: application/json" -d '{"description":"Which docs headline is stronger?","options":[{"label":"A","content":"Human judgment as an API"},{"label":"B","content":"Verified humans in your agent loop"}],"tier":"quick","bounty_per_vote":0.08,"max_workers":3,"requester_wallet":"0x1111111111111111111111111111111111111111"}' | jq -r '.task_id') && curl -s http://localhost:3000/api/tasks/$TASK_ID | jq
```

For a paid end-to-end production example with x402, run [`demo-create-task.ts`](/Users/dawsonsmith/claude-os/Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/demo-create-task.ts).

## API surface

- `POST /api/tasks` creates a judgment task and derives price from `bounty_per_vote * max_workers`
- `GET /api/tasks/:id` returns task state, consensus, confidence, provenance, and economics
- `POST /api/tasks/:id/vote` records a verified human vote and triggers payout
- `GET /api/status` returns an operational snapshot for agents
- `GET /api/init` initializes the database in development

## Architecture

```text
AI agent / app
    |
    |  POST /api/tasks
    v
Human Signal API  -- x402 --> payment authorization
    |
    +--> Postgres stores task + options + economics
    |
    +--> World ID verification gates unique humans
    |
    +--> Verified workers submit votes
    |
    +--> Base Sepolia payouts settle worker rewards
    |
    +--> GET /api/tasks/:id or callback_url returns structured results
```

## The 90 / 9 / 1 model

- `90%` goes to contributors.
- `9%` goes to the platform fund.
- `1%` is the founder pool.

Implementation note: the current ledger subdivides that `1%` founder pool into `0.75%` founder and `0.25%` early collaborator for auditability, while the top-line model remains 90 / 9 / 1.

## Local setup

Create `web/.env.local` with the values your environment needs:

```bash
WORLD_APP_ID=app_xxxxx
WORLD_RP_ID=app_xxxxx
RP_SIGNING_KEY=your_signing_key
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WORLD_ACTION=vote-on-task

TREASURY_WALLET_ADDRESS=0x...
TREASURY_PRIVATE_KEY=0x...

DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If you want the live paid flow instead of demo mode, fund the buyer wallet and run the x402 example script. The docs page includes curl, Python, TypeScript, and LangChain integration snippets.
