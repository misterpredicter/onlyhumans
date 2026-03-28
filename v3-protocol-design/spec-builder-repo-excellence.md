# Builder Spec: GitHub Repo Excellence — Maximally Great

## Mission

Make github.com/misterpredicter/onlyhumans the kind of repo that makes people want to contribute the second they see it. Clean, welcoming, well-organized, great docs. The GitHub equivalent of a beautiful storefront.

## Context

- Repo at: `Desktop/Hackathons/World Coinbase Hackathon x402/human-signal/`
- Remote: github.com/misterpredicter/onlyhumans
- PUSH when done

## What to Build/Improve

### 1. CONTRIBUTING.md

Clear contribution guide:
- Step 1: Verify with World ID at themo.live/join
- Step 2: Fork the repo
- Step 3: Read spec-v3 (link to v3-protocol-design/spec-v3.md)
- Step 4: Pick something to build (link to Issues or a "good first contribution" list)
- Step 5: Open a PR
- Code style: Tailwind, TypeScript, Next.js App Router conventions
- PR template: what you built, what it does, how to test

### 2. Issue Templates

Create .github/ISSUE_TEMPLATE/ with:
- **feature_request.md** — "I want to build X"
- **bug_report.md** — standard
- **idea.md** — "Here's an idea for the platform" (lighter weight than a full proposal)

### 3. PR Template

Create .github/pull_request_template.md:
- What does this PR do?
- How to test it
- Screenshots (if UI change)
- World ID verified? (yes/no — honor system for now, enforcement later)

### 4. Project Structure Cleanup

Organize the repo so contributors can navigate instantly:
- `web/` — the Next.js app (already organized)
- `v3-protocol-design/` — the spec + research + design docs
- `agent/` — the XMTP agent
- Clean up any loose files at root that don't belong

### 5. Good First Issues

Create 5-10 GitHub Issues tagged "good first issue" based on things that need building from spec-v3:
- "Add /economics page with visual revenue split"
- "Implement proposal slots (limited active proposals per verified human)"
- "Add contributor counter to homepage"
- "Build reputation display on user profiles"
- "Add callback/webhook support for task completion"
- "Create /contributors page showing verified participants"
- "Improve mobile responsiveness on /work page"
- "Add copy buttons to code blocks on /docs"

### 6. GitHub Repo Settings (via gh CLI if possible)

- Description: "A marketplace where verified humans deploy AI agent swarms to do real work and earn from the output."
- Topics: world-id, x402, agents, hackathon, onlyhumans, base, xmtp
- Website: https://themo.live

### 7. LICENSE

Add MIT or Apache 2.0 license file. It's open source — make it explicit.

## Constraints
- Don't modify any source code — this spec is repo organization only
- COMMIT AND PUSH when done
