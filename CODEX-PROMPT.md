# OnlyHumans — Final Pre-Submission Audit

You are the final reviewer before this hackathon project ships. Deadline: Sunday March 29, 7:30 AM PT. This is the World x Coinbase x402 Hackathon.

**Your output will be handed to a Claude Code session for triage.** Structure everything so an engineer can read your report and execute fixes in order. No fluff. Every finding needs a file path, what's wrong, and the exact fix.

---

## What This Project Is

A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output. Humans steer. Agents execute. The network coordinates, verifies, and pays.

**Live site:** https://themo.live
**Repo:** github.com/misterpredicter/onlyhumans
**Stack:** Next.js 15 · React 19 · World ID v4 · x402 Protocol · Base Sepolia · Neon Postgres

**Current state:** The v3 rewrite shipped tonight. Three passes have been made:
1. Gutted all old "Human Signal" voting/judgment framing from user-facing pages
2. Agent swarm polish pass — dead code deletion, repo hygiene, metadata, content dedup
3. Taste pass — fixed trust-breaking contradictions (WorldIDVerify copy, platform cuts in demos, homepage honesty, README fork claims, demo SVG cleanup)

**What a hackathon judge will do:**
1. Read the README on GitHub (30 seconds)
2. Visit themo.live (60 seconds clicking around)
3. Maybe browse the code (30 seconds)
4. Decide if this is real or slop

---

## Your Job: Three Parallel Reviews

Spawn three local agents. Each agent reads the full codebase but focuses on one lens. They report back to you. You compile a single unified report.

### Agent 1: Product & Narrative Coherence

Read every user-facing page and the README. Answer these questions:

**Files to read:**
- `README.md`, `CONTRIBUTING.md`
- `web/app/page.tsx` (homepage)
- `web/app/layout.tsx` (nav, footer, metadata)
- `web/app/join/JoinPageClient.tsx` (World ID flow)
- `web/app/spec/page.tsx` (v3 protocol spec)
- `web/components/docs/DocsPageClient.tsx` (how it works)
- `web/app/work/WorkPageClient.tsx` (opportunity marketplace)
- `web/app/contributors/page.tsx` (contributor list)

**Questions:**
1. Does the site have ONE clear identity? Or is it still saying multiple things? (Live marketplace vs hackathon project vs protocol thesis)
2. Is anything presented as live/working that is actually demo/planned? Flag every instance with file:line.
3. Click through the pages in order: / → /docs → /spec. Is there content repetition? Does each page add unique value?
4. Does the join flow make sense? Does role selection lead anywhere useful?
5. Is the README accurate? Does every link work? Does every claim match reality?
6. What would you change if you had exactly 30 minutes before submission?

### Agent 2: Visual & UX Review

Read the CSS and every page component. Answer these questions:

**Files to read:**
- `web/app/globals.css` (full design system)
- Every page component listed above
- `web/app/join/layout.tsx`, `web/app/work/layout.tsx` (route metadata)

**Questions:**
1. Are all pages using the design system CSS classes consistently? Or do some pages use raw inline styles for things that have CSS class equivalents?
2. Are font variables correct everywhere? (Must be `--font-sans`, `--font-serif`, `--font-mono` — NOT `--font-dm-*`)
3. What happens on mobile? The nav hides at 900px with no hamburger menu. Is the footer nav sufficient?
4. Are there any visual dead-ends — pages with no CTA, broken layouts, empty states that look broken?
5. Is the color palette consistent? (Dark: #0C0C0C, Light: #F9F8F5, Green: #10B981, Blue: #3B82F6, Purple: #8B5CF6, Amber: #F59E0B)
6. Rate each page 1-10 on visual polish. What's the weakest page?

### Agent 3: Technical & Security Review

Read the backend, config, and build output. Answer these questions:

**Files to read:**
- `web/app/api/` (all API routes)
- `web/lib/` (all lib files)
- `web/components/WorldIDVerify.tsx`
- `package.json` (root + web)
- `web/next.config.ts`, `web/tailwind.config.ts`, `web/tsconfig.json`
- `vercel.json`, `.env.local` (if accessible)
- `web/middleware.ts` (if exists)

**Questions:**
1. Does `cd web && npx next build` pass clean? Any warnings?
2. Are there any security concerns? (Exposed keys, SQL injection, missing auth on API routes)
3. Does the World ID verification flow work end-to-end? Trace the code path from button click to verified state.
4. Does x402 integration actually do anything? Or is it just imported but unused?
5. Are there API routes that expose the old voting/judgment product to anyone browsing `/api/status` or `/api/stats`?
6. Are there unused dependencies in package.json? Any version conflicts?
7. Is there dead code in `web/lib/` that should be flagged? (`economics.ts` still has old 90/9/1 split math but is imported by API routes)

---

## Report Format

Compile all three agents' findings into ONE report with this structure:

```
## CRITICAL (fix before submission)
- [file:line] What's wrong → Exact fix

## IMPORTANT (fix if time allows)
- [file:line] What's wrong → Exact fix

## NICE TO HAVE (post-hackathon)
- [file:line] What's wrong → Suggested fix

## WHAT'S WORKING WELL
- List what a judge will be impressed by (be specific)

## 30-MINUTE SPRINT PLAN
If the engineer has exactly 30 minutes before submission, do these N things in this order:
1. ...
2. ...
```

**Rules:**
- Every finding must have an exact file path
- Every fix must be specific enough to implement without asking questions
- Do not suggest architectural rewrites — there are hours left, not days
- Do not flag things that are clearly labeled as demo/planned/illustrative
- Do flag anything that could embarrass the team in front of judges
- If something is genuinely good, say so — the engineer needs to know what NOT to touch

---

## File Inventory (for reference)

**User-facing pages:**
```
web/app/page.tsx              — Homepage
web/app/layout.tsx            — Shell, nav, footer
web/app/join/page.tsx         — Join (client wrapper)
web/app/join/JoinPageClient.tsx — World ID verification flow
web/app/join/layout.tsx       — Join route metadata
web/app/spec/page.tsx         — v3 protocol spec
web/app/docs/page.tsx         — Docs (server wrapper)
web/components/docs/DocsPageClient.tsx — How It Works guide
web/app/work/page.tsx         — Work (client wrapper)
web/app/work/WorkPageClient.tsx — Opportunity marketplace
web/app/work/layout.tsx       — Work route metadata
web/app/contributors/page.tsx — Verified contributor list
```

**Redirect pages (should just call redirect(), no JSX):**
```
web/app/economics/page.tsx    — → /spec
web/app/vision/page.tsx       — → /spec
web/app/agent/page.tsx        — → /docs
web/app/task/[id]/page.tsx    — → /docs
```

**Components (should only be these 4):**
```
web/components/WorldIDVerify.tsx
web/components/CopyButton.tsx
web/components/ScrollReveal.tsx
web/components/docs/DocsPageClient.tsx
```

**Backend:**
```
web/lib/db.ts, world-id.ts, x402-server.ts, economics.ts, task-callbacks.ts, task-results.ts, payments.ts
web/app/api/ — tasks, verify-world-id, auth/rp-signature, stats, status, seed, init, leaderboard, contributors
```

**Repo-level:**
```
README.md, CONTRIBUTING.md, AUDIT.md, codex-taste-audit.md
package.json (root), web/package.json
vercel.json, web/next.config.ts, web/tailwind.config.ts
```
