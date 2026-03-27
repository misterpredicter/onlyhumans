# Human Signal

**Sybil-resistant A/B preference oracle built on World ID + x402 + Base Sepolia**

Post a judgment task. Verified humans vote (one person, one vote via World ID ZKP).
Requesters set bounty per vote + max voters, pay total upfront via x402. Workers earn the bounty automatically per vote.

---

## Architecture

```
Requester → POST /api/tasks?total=X → 402 → pays bounty×voters → task created → XMTP broadcast
Worker → World ID ZKP → nullifier stored → votes → treasury sends bounty USDC
```

**Stack:** Next.js 15 / Neon Postgres / @worldcoin/idkit / @x402/next / viem / Base Sepolia

---

## Setup

### 1. Create `.env.local` in `web/`

```bash
# World ID — create app at developer.world.org (5 min)
WORLD_APP_ID=app_xxxxx
WORLD_RP_ID=app_xxxxx
RP_SIGNING_KEY=your_signing_key
NEXT_PUBLIC_WORLD_APP_ID=app_xxxxx
NEXT_PUBLIC_WORLD_ACTION=vote-on-task

# Treasury wallet on Base Sepolia
# Get testnet USDC: https://faucet.circle.com
TREASURY_WALLET_ADDRESS=0x...
TREASURY_PRIVATE_KEY=0x...

# Database
# Option A: Vercel → Storage → Create Neon database (auto-populates)
# Option B: Local docker: docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install and run

```bash
cd web
npm install
npm run dev
```

### 3. Initialize database

Visit `http://localhost:3000/api/init` to create tables (dev only).

### 4. Test World ID

Use the World ID simulator at `simulator.worldcoin.org` to get a test proof without an Orb device.

### 5. Test x402 gate

```bash
# Should return 402
curl -X POST http://localhost:3000/api/tasks \
  -H "content-type: application/json" \
  -d '{"description":"test","option_a":"a","option_b":"b","requester_wallet":"0x1234"}'
```

---

## Deploy to Vercel

```bash
# Push to GitHub, then:
vercel --prod

# Set env vars in Vercel dashboard:
# - All vars from .env.local
# - Add Neon storage in Vercel dashboard (auto-populates DATABASE_URL)
```

---

## XMTP Agent (stretch goal)

Broadcasts new tasks to registered workers via XMTP / World Chat.

```bash
# In agent/, create .env:
# XMTP_WALLET_KEY=0x...      (new wallet for agent)
# XMTP_DB_ENCRYPTION_KEY=... (32-byte hex, generate: openssl rand -hex 32)
# DATABASE_URL=...            (same as web)
# APP_URL=https://www.themo.live
# XMTP_ENV=production

cd agent
npm install
npm start

# Deploy to Railway: railway init && railway up
```

---

## API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | /api/tasks?total=X | x402 variable | Create judgment task (bounty × voters) |
| GET | /api/tasks | — | List open tasks |
| GET | /api/tasks/:id | — | Task + live results |
| POST | /api/tasks/:id/vote | World ID nullifier | Submit vote + trigger payment |
| POST | /api/verify-world-id | — | Verify ZKP → store nullifier |
| GET | /api/auth/rp-signature | — | IDKit RP signing |
| GET | /api/init | dev only | Create database tables |

---

## Anti-sybil mechanism

The `UNIQUE(task_id, nullifier_hash)` constraint in the `votes` table is the entire sybil-resistance implementation. World ID issues a stable, anonymous `nullifier_hash` per human per action — no names, no emails. Postgres enforces one vote per human per task atomically (no race conditions).

---

## Hackathon

World x Coinbase x402 Hackathon, March 2026.
Submission: https://devfolio.co/...
