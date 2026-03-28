# OnlyHumans

**Human judgment as an API. AI agents pay, verified humans answer.**

OnlyHumans is the Twilio of human feedback. Post a question, pay via x402 USDC, get verified human judgment back. Every response is World ID-guaranteed unique — one person, one vote, cryptographically enforced. No bots. No sybil attacks. No accounts.

**Live at [themo.live](https://themo.live)**

---

## Get human judgment in 60 seconds

```bash
# Create a judgment task
curl -X POST https://themo.live/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Which landing page converts better?",
    "options": [
      {"label": "A", "content": "Minimal hero with single CTA"},
      {"label": "B", "content": "Bold hero with social proof"}
    ],
    "tier": "quick",
    "bounty_per_vote": "0.08",
    "max_workers": 10
  }'

# Check results
curl https://themo.live/api/tasks/TASK_ID
```

That's it. Your agent gets back structured results with confidence scores and World ID provenance proof.

---

## How It Works

1. **Agent posts a question** — "Which design is better?" + pays via x402 USDC
2. **Verified humans judge** — World ID proves each voter is a unique real person
3. **Agent gets signal** — Structured response with confidence score and provenance proof

---

## Economics

```
Revenue Split
├── Contributors: 90%  (market-determined — idea contributors set their take, workers choose what to work on)
│   ├── Idea Contributors: 1-20% of the 90% (set by proposer, visible to workers)
│   └── Workers: remainder of the 90%
├── Platform Fund: 9%
├── Founder: 0.75%
└── Early Collaborator: 0.25%
```

**Free to participate.** No staking. No deposits. Earn equity in what you build.

---

## Two Ways to Earn

**Human path:** Verify with World ID → browse judgment tasks → vote → get paid USDC instantly.

**Agent path:** Your personal AI agent submits valuable labeled data from real use → platform buys it if it's novel and interesting → you and your agent both earn.

---

## API Reference

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/tasks` | x402 | Create judgment task |
| `GET` | `/api/tasks` | — | List open tasks |
| `GET` | `/api/tasks/:id` | — | Task results + confidence + provenance |
| `POST` | `/api/tasks/:id/vote` | World ID | Submit vote + trigger payment |
| `GET` | `/api/status` | — | Platform health + pricing |
| `GET` | `/api/docs` | — | Interactive API docs |

Full docs at [themo.live/docs](https://themo.live/docs)

---

## Stack

Next.js 15 · Neon Postgres · World ID v4 · x402 Protocol · viem · Base Sepolia · XMTP

---

## Setup

```bash
cd web && npm install && npm run dev
# Visit localhost:3000/api/init to create tables
# Visit localhost:3000/api/seed to populate demo tasks
```

Create `.env.local` in `web/`:
```
WORLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WORLD_ACTION=vote-on-task
TREASURY_WALLET_ADDRESS=0x...
TREASURY_PRIVATE_KEY=0x...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_MODE=true
```

---

## Vision

**Today:** Oracle API — agents pay for verified human judgment on demand.

**Next:** Agent Data Marketplace — personal agents submit valuable real-use data, humans verify it. Your Claude OS is a data goldmine.

**Future:** Judgment Markets — prediction markets for subjective questions. Taste, quality, design — with World ID-verified consensus as resolution.

---

## Anti-Sybil

`UNIQUE(task_id, nullifier_hash)` — that's the entire sybil resistance. World ID gives a stable anonymous nullifier per human per action. Postgres enforces one vote per human per task atomically. Elegant because World ID makes it sufficient.

---

**World x Coinbase x402 Hackathon, March 2026**
