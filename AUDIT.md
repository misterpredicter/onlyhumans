# OnlyHumans — Codex Review Spec

You are a senior engineer and design reviewer. Your job is to audit this hackathon project, find issues, suggest concrete improvements, and report back. Do not just check compliance — think like a hackathon judge who has 90 seconds to decide if this project is real.

**Repo:** `github.com/misterpredicter/onlyhumans`
**Live site:** `themo.live`
**Hackathon:** World x Coinbase x402, March 2026

---

## 1. Context — What This Project Is

A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output. Humans steer. Agents execute. The network coordinates, verifies, and pays.

**Tagline:** "It's called OnlyHumans, but it's mostly agents."

**The four human roles agents can't fill:**
- **Taste** — Judge quality, preference, aesthetics (no ground truth)
- **Governance** — Collective oversight, dispute resolution, permanent bans via World ID
- **Compute allocation** — Decide what your agent swarm works on (capital allocator, but capital is compute)
- **Outbound** — Calls, meetings, deals, handshakes (agents can't show up)

**Economics:** No mandatory platform tax. Voluntary investment into platform stake. Flexible project splits (templates, not laws). Execution earns the most.

**Constitutional:** World ID. One human, many agents. Permanent bans attach to a real person.

**Tech:** Next.js 15 · World ID v4 · x402 Protocol on Base Sepolia · Neon Postgres · XMTP

---

## 2. How to Review

### Phase 1: Read everything

Read every file listed below. Understand the full picture before suggesting changes.

**Repository-level:**
- `README.md` — Does it sell the project in 30 seconds? Is every link valid? Does the Quick Start actually work?
- `CONTRIBUTING.md` — Is every claim accurate? (Check code style claims against actual code.)
- `package.json` (root + `web/`) — Is the project name correct? Any stale dependencies?

**Site pages (all under `web/`):**
- `app/layout.tsx` — Nav links, footer links, metadata, fonts
- `app/page.tsx` — Homepage
- `app/join/JoinPageClient.tsx` — World ID verification flow
- `app/spec/page.tsx` — Full v3 protocol spec
- `components/docs/DocsPageClient.tsx` — "How It Works" guide
- `app/work/WorkPageClient.tsx` — Agent opportunity marketplace
- `app/contributors/page.tsx` — Verified contributor list
- `app/economics/page.tsx` — Should redirect to /spec
- `app/vision/page.tsx` — Should redirect to /spec
- `app/agent/page.tsx` — Should redirect to /docs

**Design system:**
- `app/globals.css` — CSS classes, color palette, responsive breakpoints

**Dead code check:**
- `web/components/` — Should only contain: `CopyButton.tsx`, `ScrollReveal.tsx`, `WorldIDVerify.tsx`, `docs/DocsPageClient.tsx`
- Any other component file is dead weight from the old "Human Signal" voting API

### Phase 2: Evaluate like a hackathon judge

Ask these questions for every page:

1. **First impression (3 seconds):** Does this page look professional? Or does it scream "auto-generated"?
2. **Content quality:** Is the copy specific and credible, or vague and fluffy? Does it use concrete numbers (x402: $24.2M volume) or empty claims?
3. **Differentiation:** If I click from homepage to /docs, do I learn something NEW? Or is it the same content repeated with different headings?
4. **Coherence:** Does every page speak the same language (agent economy, human steering, flexible splits)? Or do some pages slip into old framing (voting, judgment API, per-vote pricing)?
5. **Dead ends:** Does every page have a clear next action? (Join, Read Spec, etc.) No orphan pages.
6. **Technical credibility:** Does the code match the claims? If the README says "x402 payments," is there actual x402 integration code?

### Phase 3: Report

Organize findings into three tiers:

**P0 — A judge notices this in the first 30 seconds:**
- Broken links, wrong project names, claims that contradict the code
- Pages that feel like padding or repeat content
- Any surviving old "Human Signal" framing

**P1 — The difference between "hackathon project" and "this is real":**
- Copy that could be sharper
- Design inconsistencies (inline styles vs CSS classes, wrong font variables)
- Dead code or stale files visible in the repo
- Missing metadata (page titles, OG cards)

**P2 — Extra credit:**
- Mobile responsiveness gaps
- Accessibility issues
- Performance concerns
- API routes that don't match the current product narrative

For each finding:
- **File path + line number(s)**
- **What's wrong** (be specific)
- **Suggested fix** (exact text change, file deletion, or code edit)
- **Why it matters** (what a judge would think)

---

## 3. Banned Terms — Hard Failures

These strings must NOT appear in any user-facing file (pages, components rendered by pages). Matches in API routes (`web/app/api/`) are acceptable backend plumbing.

```
$0.08, $0.20, $0.50
bounty_per_vote (as user-facing text)
per-vote pricing
quick/reasoned/detailed (as tier names)
Human Signal (as a product name)
90/9/1 (old split ratio)
judgment API, annotation API, judgment queue
vote-on-task (as user-facing copy)
```

Banned component imports in pages (these files should not exist):
```
EconomicsBreakdown, ABJudgment, TaskCreator, ResultsDashboard, TierBadge, SplitBadge, LeaderboardPanel
```

---

## 4. Site Structure Requirements

### Navigation (`layout.tsx`)

Header nav must contain exactly: **Join** (`/join`) | **Spec** (`/spec`) | **Docs** (`/docs`)

Must NOT link to: `/work`, `/agent`, `/contributors`, `/economics`, `/vision`

Footer: Join, Spec, Docs, GitHub (external)

### Page requirements

| Route | Type | What it should do |
|-------|------|-------------------|
| `/` | Homepage | Sell the vision. Four human roles, why now, coordination thesis. CTA: Join + Spec |
| `/join` | World ID flow | 3-step: Verify → Choose role → Connect. Links to GitHub, /spec, /docs |
| `/spec` | Protocol spec | Full v3 design. Why Now, Who Does What, Core Loop, Economics, Risks, MVP |
| `/docs` | How It Works | Platform mechanics guide. Core loop, economics, tech stack. NOT a copy of the homepage |
| `/work` | Marketplace preview | Static demo opportunities with "launching soon" state. NOT the old voting queue |
| `/contributors` | Contributor list | World ID verified humans. Nullifier hashes, privacy-preserving |
| `/economics` | Redirect → `/spec` | No rendered content |
| `/vision` | Redirect → `/spec` | No rendered content |
| `/agent` | Redirect → `/docs` | No rendered content |

### Cross-page differentiation (important)

A judge clicking Homepage → Docs → Spec should NOT see the same content three times. Each page must add unique value:

- **Homepage:** Sells the vision (what + why + social proof)
- **Docs:** Explains the mechanics (how the core loop works, economics, tech stack)
- **Spec:** Full protocol design (detailed analysis, comparison table, risks, MVP plan)

If you find content duplicated across pages, flag it as P0.

---

## 5. Design System

### Fonts (defined in `layout.tsx`)
- `--font-sans` → DM Sans
- `--font-serif` → DM Serif Display
- `--font-mono` → DM Mono

If any file references `--font-dm-serif`, `--font-dm-sans`, or `--font-dm-mono` — that's wrong. The correct names have no `dm-` prefix.

### Color palette
- Dark sections: `#0C0C0C` bg, `#FFFFFF` text
- Light sections: `var(--bg)` / `#F9F8F5`
- Muted text: `#6B7280`, `#9CA3AF`
- Accents: Green `#10B981`, Blue `#3B82F6`, Purple `#8B5CF6`, Amber `#F59E0B`

### CSS classes (in `globals.css`)
```
page-shell, wide-shell, section-shell
section-kicker, section-title, section-copy
surface-card, premium-card, metric-card, metric-grid
pill, pill-row, tone-pill, eyebrow-pill
site-cta, secondary-link, quiet-link
soft-label, micro-label
animate-fade-in, animate-fade-in-up
delay-100 through delay-500
```

If pages use raw inline styles for properties that have CSS class equivalents, flag it as P1 (design inconsistency).

---

## 6. README Quality Check

The README is the first thing a judge reads on GitHub. Check:

1. **Does the first paragraph sell the project?** (Not "this is a monorepo" — "this is what we built and why it matters")
2. **Is the Quick Start actually quick?** (3 commands max to see the site running)
3. **Are all links valid?** (No links to pages that redirect or don't exist in the nav)
4. **Does "Why Now" use real data?** (x402 volume, OpenClaw stars, CashClaw revenue — not vague claims)
5. **Is the Stack section accurate?** (Every listed dependency actually exists in package.json)
6. **Is there any stale content from the old "Human Signal" framing?**

---

## 7. Technical Verification

```bash
# Must pass
cd web && npx next build

# Must return empty (no banned terms in user-facing pages)
grep -ri "Human Signal" web/app/ --include="*.tsx" | grep -v node_modules | grep -v ".next"
grep -ri "bounty_per_vote" web/app/ --include="*.tsx" --exclude-dir=api
grep -ri "per-vote pricing\|judgment API\|annotation API\|judgment queue" web/app/ --include="*.tsx"
grep -ri "90/9/1" web/app/ --include="*.tsx"

# Dead component imports must not exist in app/
grep -r "import.*EconomicsBreakdown\|import.*ABJudgment\|import.*TaskCreator\|import.*ResultsDashboard\|import.*TierBadge\|import.*SplitBadge\|import.*LeaderboardPanel" web/app/

# Redirects must work
grep "redirect" web/app/economics/page.tsx  # → must match
grep "redirect" web/app/vision/page.tsx     # → must match
grep "redirect" web/app/agent/page.tsx      # → must match
```

---

## 8. After Your Review

Return your full report organized by P0/P1/P2. For each finding, include:
- Exact file path and line numbers
- What's wrong and why a judge would care
- The specific fix (exact code change, not vague advice)

Then suggest a prioritized action plan: "If you only have 2 hours, do items 1-5. If you have 4 hours, also do 6-10."

Do not be polite. Be useful. The deadline is tomorrow morning.
