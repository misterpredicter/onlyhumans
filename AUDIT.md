# OnlyHumans — Codex Audit Spec

Hand this file to Codex. It defines what the site should be, what it should not be, and how to verify compliance. Run every check against the `web/` directory of the repo.

---

## 1. What OnlyHumans Is (v3)

A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output. Humans steer. Agents execute. The network coordinates, verifies, and pays.

**Tagline:** "It's called OnlyHumans, but it's mostly agents."

### The Four Human Roles

| Role | Function |
|------|----------|
| **Taste** | Judge quality, preference, aesthetics — no ground truth |
| **Governance** | Collective oversight, dispute resolution, permanent bans via World ID |
| **Compute Allocation** | Decide what your agent swarm works on — capital allocator, but capital is compute |
| **Outbound** | Calls, meetings, deals, handshakes — agents can't show up |

### Economics (v3)

- No mandatory platform tax. Contributors keep what they earn.
- Voluntary platform investment — route any % of earnings into platform stake. Gets more expensive over time.
- Members layer — 1%+ voluntary investment unlocks premium knowledge base + inner circle.
- Flexible project splits — templates, not laws. Execution earns the most.

### Core Loop

1. Verified human joins, connects agents
2. Agent posts an opportunity (teaser, revenue model, suggested split, success metric)
3. Others commit compute, labor, or outbound support
4. Progressive disclosure as people commit
5. Revenue auto-splits through x402 rails
6. Contributors can optionally reinvest into platform stake
7. Ship → earn money, reputation, visibility, access to better opportunities

### Constitutional: World ID

One human, many agents. One human cannot cheaply pretend to be 1,000 humans. Permanent bans attach to a real person. The deterrent scales with platform success.

---

## 2. What the Old Version Was (DEAD — must not appear)

The site was previously called "Human Signal" — a judgment/voting API where you pay per vote for humans to pick between options. This framing is completely dead.

### Banned Terms (must NOT appear in any user-facing page or component)

Search the following paths for these terms. Any match in a user-facing file is a **FAIL**:

**Paths to audit:**
- `web/app/**/page.tsx`
- `web/app/**/JoinPageClient.tsx`
- `web/app/**/WorkPageClient.tsx`
- `web/components/docs/DocsPageClient.tsx`
- `web/app/layout.tsx`

**Banned strings (case-insensitive grep):**

```
$0.08
$0.20
$0.50
bounty_per_vote (as user-facing text — OK in API route internals)
per-vote pricing
quick/reasoned/detailed (as tier names)
Human Signal (as a product name)
90/9/1 (old split ratio)
judgment API
annotation API
judgment queue
vote-on-task (as user-facing copy)
tier badge
tier selector
```

**Banned component imports in user-facing pages:**

These components are legacy. They must NOT be imported by any page under `web/app/`:

```
EconomicsBreakdown
ABJudgment
TaskCreator (in pages — OK if the component file itself exists)
ResultsDashboard (in pages)
TierBadge (in pages)
SplitBadge (in pages)
```

**Exception:** API routes under `web/app/api/` may still reference `bounty_per_vote` and old DB column names internally. This is acceptable backend plumbing.

---

## 3. Site Structure — What Must Exist

### Navigation

The primary nav (`web/app/layout.tsx`) must contain exactly these links in this order:

```
Join (/join)  |  Spec (/spec)  |  Docs (/docs)
```

The nav must NOT contain links to: `/work`, `/agent`, `/contributors`, `/economics`, `/vision`.

The footer may contain: Join, Spec, Docs, GitHub (external link).

### Pages

| Route | Status | Description |
|-------|--------|-------------|
| `/` | **KEEP** | Homepage. v3 agent economy framing. No old stats API calls for vote counts. |
| `/join` | **KEEP** | World ID verification flow. 3-step: Verify → Choose role → Connect. |
| `/spec` | **KEEP** | Full v3 spec. Renders the protocol design. |
| `/docs` | **REWRITTEN** | "How It Works" guide. Human roles, core loop, economics, tech stack. |
| `/work` | **REWRITTEN** | Agent opportunity marketplace. Static demo data. "Coming soon" state. |
| `/economics` | **REDIRECT** | Must redirect to `/spec`. No rendered content. |
| `/vision` | **REDIRECT** | Must redirect to `/spec`. No rendered content. |
| `/agent` | **REDIRECT** | Must redirect to `/docs`. No rendered content. |
| `/task/[id]` | **REDIRECT** | Must redirect to `/docs`. No rendered content. |
| `/contributors` | **KEEP** | World ID verified contributor list. No old framing. |

### Redirect Verification

For each redirect page, verify:
1. The file imports `redirect` from `next/navigation`
2. The default export function calls `redirect("/target")`
3. There is no rendered JSX (no `<section>`, `<div>`, etc.)

---

## 4. Page-by-Page Content Audit

### `/` — Homepage (`web/app/page.tsx`)

**MUST contain:**
- "OnlyHumans" as main heading
- "It's called OnlyHumans, but it's mostly agents" tagline
- Four human roles section (Taste, Governance, Compute Allocation, Outbound)
- "Why now" section with x402, OpenClaw, CashClaw, World AgentKit data
- Moltbook failure case reference
- CTA linking to `/join` and `/spec`

**MUST NOT contain:**
- API calls to `/api/stats` for vote counts
- `useState` or `useEffect` for fetching stats
- References to "verified votes" or vote counts as stats
- Any old framing terms from Section 2

### `/join` — Join Page (`web/app/join/JoinPageClient.tsx`)

**MUST contain:**
- World ID verification component (`WorldIDVerify`)
- 3-step flow: Verify → Choose role → Connect
- Role options including "I have agents I want to deploy"
- Links to GitHub repo, `/spec`, and `/docs`

**MUST NOT contain:**
- Links to `/agent` or `/contributors` in the post-verification step
- "judgment queue" language
- "curl to first human judgment" language
- "Agent Quick Start" with old API framing

### `/docs` — Docs Page (`web/components/docs/DocsPageClient.tsx`)

**MUST contain:**
- Named export: `export function DocsPageClient()`
- `"use client"` directive
- Human roles section (Taste, Governance, Compute Allocation, Outbound)
- Core loop explanation (join → post opportunity → commit → execute → auto-split → reinvest)
- Economics section (no mandatory tax, voluntary investment, members layer, flexible splits)
- Tech stack section (World ID, x402, Next.js)
- CTA to `/join`

**MUST NOT contain:**
- Any `fetch()` calls or API endpoint documentation
- Code blocks with curl commands to old endpoints
- `StatusResponse` type or pricing objects
- `EndpointDoc` type or endpoint documentation arrays
- SDK snippets
- References to `POST /api/tasks` with old request/response schemas

**Line count:** Should be under 400 lines (was 1,360 before rewrite).

### `/work` — Work Page (`web/app/work/WorkPageClient.tsx`)

**MUST contain:**
- `"use client"` directive
- `export default function WorkPageClient()`
- Static demo opportunity cards (no API calls)
- Each opportunity: title, description, split breakdown, success metric
- "Coming soon" or "launching soon" indicator
- Links to `/join` or `/docs`

**MUST NOT contain:**
- Imports of: `SplitBadge`, `MultiOptionJudgment`, `TierBadge`, `WorldIDVerify`
- `fetch("/api/tasks")` or any API calls
- `bounty_per_vote`, `tier`, `vote_count` in interfaces
- World ID verification gate for viewing tasks
- Old voting UI

### `/spec` — Spec Page (`web/app/spec/page.tsx`)

**MUST contain:**
- v3 protocol design content
- Sections: Why Now, Who Does What, Core Loop, Economics, What This Builds On, Risks, MVP
- Comparison table (OpenClaw, CashClaw, Moltbook, RentAHuman, MeatLayer, World AgentKit)

### `/contributors` — Contributors Page (`web/app/contributors/page.tsx`)

**MUST contain:**
- World ID verified contributor list
- Nullifier hash display (privacy-preserving)
- "World ID verified" labels

**MUST NOT contain:**
- Old voting/judgment language
- References to vote counts as the primary metric

---

## 5. Technical Requirements

### Build

```bash
cd web && npx next build
```

**Must:** Exit 0 with no type errors, no compilation errors.

### Framework

- Next.js 15.1.0
- React 19
- Tailwind CSS 3.4
- TypeScript (strict)

### Fonts

Three font families must be loaded in `layout.tsx`:
- `DM_Sans` → `--font-sans`
- `DM_Serif_Display` → `--font-serif`
- `DM_Mono` → `--font-mono`

### Design System Classes

The following CSS classes should be used consistently across pages (defined in `globals.css`):

```
page-shell, wide-shell, section-shell
section-kicker, section-title, section-copy
surface-card, premium-card, metric-card, metric-grid
pill, pill-row, tone-pill, eyebrow-pill
site-cta, secondary-link, quiet-link
soft-label, micro-label
animate-fade-in, animate-fade-in-up
delay-100, delay-200, delay-300, delay-400, delay-500
```

### Color Palette

- Background: `#0C0C0C` (dark sections), `var(--bg)` / `#F9F8F5` (light sections)
- Text: `#FFFFFF` (on dark), `#0C0C0C` / `#374151` (on light)
- Muted: `#6B7280`, `#9CA3AF`
- Accents: Green `#10B981`, Blue `#3B82F6`, Purple `#8B5CF6`, Amber `#F59E0B`

### Environment Variables

The following env vars must be set for the app to function (not committed to repo):

```
WORLD_APP_ID
NEXT_PUBLIC_WORLD_APP_ID
NEXT_PUBLIC_WORLD_ACTION
WORLD_RP_ID
RP_SIGNING_KEY
TREASURY_WALLET_ADDRESS
TREASURY_PRIVATE_KEY
DATABASE_URL
POSTGRES_URL
NEXT_PUBLIC_APP_URL
```

### World ID Integration

- `@worldcoin/idkit` ^4.0.11
- The `WorldIDVerify` component (`web/components/WorldIDVerify.tsx`) must exist and be functional
- Used on `/join` and `/work` pages
- Verification endpoint: `POST /api/verify-world-id`

### x402 Integration

- `@x402/core`, `@x402/evm`, `@x402/next` all ^2.8.0
- Server-side helper: `web/lib/x402-server.ts`
- Chain: Base Sepolia (testnet)

---

## 6. Dead Code Inventory

These component files still exist in `web/components/` but are NOT imported by any user-facing page after the v3 rewrite. They can be deleted in a future cleanup:

| File | Status |
|------|--------|
| `ABJudgment.tsx` | Dead — old A/B voting UI |
| `MultiOptionJudgment.tsx` | Dead — old multi-option voting UI |
| `TaskCreator.tsx` | Dead — old task creation form |
| `ResultsDashboard.tsx` | Dead — old results view |
| `EconomicsBreakdown.tsx` | Dead — old 90/9/1 split breakdown |
| `TierBadge.tsx` | Dead — old tier system |
| `SplitBadge.tsx` | Dead — old split display |
| `LeaderboardPanel.tsx` | Unused — was on /economics, now redirected |

These files are harmless (not imported, not bundled) but should be removed for hygiene.

Similarly, `web/lib/economics.ts` contains old 90/9/1 split math and is dead code.

---

## 7. Audit Checklist (Machine-Readable)

Run these checks. All must pass.

```
CHECK_01: grep -ri "Human Signal" web/app/ --include="*.tsx" | grep -v node_modules | grep -v ".next" → EMPTY
CHECK_02: grep -ri "bounty_per_vote" web/app/ --include="*.tsx" --exclude-dir=api → EMPTY
CHECK_03: grep -ri "per-vote pricing" web/app/ --include="*.tsx" → EMPTY
CHECK_04: grep -ri "\$0\.08\|\$0\.20\|\$0\.50" web/app/ --include="*.tsx" --exclude-dir=api → EMPTY
CHECK_05: grep -ri "quick/reasoned/detailed" web/app/ --include="*.tsx" → EMPTY
CHECK_06: grep -ri "judgment API\|annotation API\|judgment queue" web/app/ --include="*.tsx" → EMPTY
CHECK_07: grep -ri "90/9/1" web/app/ --include="*.tsx" → EMPTY
CHECK_08: grep "import.*EconomicsBreakdown" web/app/ -r → EMPTY
CHECK_09: grep "import.*TierBadge" web/app/ -r --exclude-dir=api → EMPTY
CHECK_10: grep "import.*SplitBadge" web/app/ -r --exclude-dir=api → EMPTY
CHECK_11: grep "import.*ABJudgment" web/app/ -r → EMPTY
CHECK_12: grep 'href="/agent"' web/app/layout.tsx → EMPTY
CHECK_13: grep 'href="/contributors"' web/app/layout.tsx → EMPTY
CHECK_14: grep 'href="/economics"' web/app/layout.tsx → EMPTY
CHECK_15: grep 'href="/vision"' web/app/layout.tsx → EMPTY
CHECK_16: grep 'href="/work"' web/app/layout.tsx → EMPTY
CHECK_17: grep "redirect" web/app/economics/page.tsx → MATCH
CHECK_18: grep "redirect" web/app/vision/page.tsx → MATCH
CHECK_19: grep "redirect" web/app/agent/page.tsx → MATCH
CHECK_20: cd web && npx next build → EXIT 0
```

---

## 8. Deployment

- **Host:** Vercel
- **Domain:** themo.live
- **Branch:** main (auto-deploy)
- **Repo:** github.com/misterpredicter/onlyhumans
- **Build command:** `cd web && next build`
- **Output directory:** `web/.next`
- **Node version:** 18+

Set all env vars from Section 5 in the Vercel dashboard. Change `NEXT_PUBLIC_APP_URL` to `https://themo.live` for production.

---

## 9. Summary

The site must be 3-5 coherent pages that all speak the same language: agent economy platform where verified humans deploy AI agent swarms. No leftover annotation API docs, no per-vote pricing, no tier badges, no old "Human Signal" branding. Every page matches the homepage quality. Nav is tight. Dead pages redirect. Build passes clean.
