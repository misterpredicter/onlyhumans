# Builder Spec: Ship V3 to themo.live — Hackathon Collaboration Mode

## Mission

Transform themo.live from the old Human Signal annotation demo into the OnlyHumans v3 experience. The immediate goal: a website that hackathon participants can visit, verify with World ID, and start contributing. This is an open-source collaboration — we're inviting everyone in the hackathon to build together.

## Context

- Project at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Web app in `web/` subdirectory (Next.js 15, App Router)
- The spec v3 is at: `Desktop/Hackathons/World Coinbase Hackathon x402/onlyhumans/spec-v3.md` — READ THIS FIRST, it's the source of truth
- Git remote: github.com/misterpredicter/onlyhumans.git
- Live at themo.live via Vercel
- COMMIT AND PUSH when done

## What to Build

### 1. Landing Page — The Invitation

The homepage should be a clear invitation to hackathon participants:

**Hero:**
- "OnlyHumans" big
- "It's called OnlyHumans, but it's mostly agents."
- "A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output."

**The hackathon pitch (prominent, above the fold):**
- "We're building this together. This is an open hackathon project — verify with World ID and start contributing. We don't care about winning. We care about building something cool that actually works. If we all work together, we can split the prize and have something real to show for it."
- Big CTA: "Join the Project" → goes to onboarding flow

**Below the fold:**
- The four human roles (taste, governance, compute allocation, outbound) — clean table
- How agents participate (propose, build, execute, submit data)
- The economics (no mandatory tax, voluntary platform investment, execution > ideation)
- "Why Now" section with real ecosystem numbers (OpenClaw 247K stars, CashClaw $45 revenue, x402 $24.2M volume)

### 2. Onboarding Flow — World ID First

This is the most important new page. Route: `/join` or `/onboard`

**Step 1: Verify with World ID**
- "Before you contribute, verify you're human. One person, one identity. This is how we keep the project safe from bots and bad actors."
- World ID verification widget (IDKit v4, same setup as existing)
- After verification: "Welcome. You're verified. Your contributions are now tied to your identity."

**Step 2: Choose Your Role**
- "How do you want to contribute?"
- Options (multi-select):
  - "I have agents I want to deploy" → shows agent setup guidance
  - "I'm a human with taste" → shows judgment task feed (/work)
  - "I want to build on the codebase" → links to GitHub repo with contribution guide
  - "I just want to explore" → browse the platform

**Step 3: Connect to the Project**
- Link to GitHub: github.com/misterpredicter/onlyhumans
- Link to the spec: v3-protocol-design/spec-v3.md (or render it on a /spec page)
- "Read the spec. Find something you want to build. Open a PR. Ship it."

### 3. /spec Page — Render the Spec

Create a `/spec` route that renders spec-v3.md as a clean, readable page. This is what people read to understand what they're contributing to. Use markdown rendering with good typography.

### 4. /contributors Page

A live page showing who's verified and contributing:
- List of World ID-verified contributors (show nullifier hash prefix, not identity)
- What they're working on (if they've declared)
- "X verified humans contributing" counter

### 5. Update All Branding

- Every reference to "Human Signal" → "OnlyHumans"
- Page title: "OnlyHumans — Mostly Agents"
- Meta description: "A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output."
- Nav: OnlyHumans | Join | Spec | Work | Docs | Agent | Contributors

### 6. GitHub README

Update the README to match the hackathon collaboration energy:
- "We're building this at the World x Coinbase x402 Hackathon. It's open source. Join us."
- Link to themo.live/join for onboarding
- Contribution guide: verify with World ID → read the spec → find something to build → open a PR
- The spec v3 summary (short version)

## Design

- Keep the existing warm palette but make it feel like a living project, not a finished product
- The onboarding flow should feel welcoming, not gatekeepy
- World ID verification should feel like "joining the team" not "passing a checkpoint"
- Mobile responsive — people at the hackathon will be on phones

## Constraints
- Don't break existing API endpoints (tasks, votes, etc still work)
- World ID verification reuses existing IDKit v4 setup
- COMMIT AND PUSH TO github.com/misterpredicter/onlyhumans.git when done
