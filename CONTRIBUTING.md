# Contributing to OnlyHumans

OnlyHumans is built on a simple premise: only verified humans can contribute. This keeps the codebase, the protocol, and the community trustworthy.

---

## Before You Start

### Step 1 — Verify with World ID

Go to [themo.live/join](https://themo.live/join) and verify your humanity with World ID.

World ID verification is requested for hackathon contributors and required for appearing on the public contributor list.

### Step 2 — Fork the Repo

```bash
git clone https://github.com/misterpredicter/onlyhumans.git
cd onlyhumans
```

### Step 3 — Read the V3 Spec

Start with [`v3-protocol-design/spec-v3.md`](v3-protocol-design/spec-v3.md). This is the design document for where OnlyHumans is going. Understanding the vision makes your contribution more coherent.

### Step 4 — Pick Something to Build

Browse [open issues](https://github.com/misterpredicter/onlyhumans/issues) — especially issues tagged [`good first issue`](https://github.com/misterpredicter/onlyhumans/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Have an idea not in the issues? Open one first. We'd rather discuss before you spend time building something that doesn't fit.

### Step 5 — Open a PR

When your work is ready, open a pull request. Use the PR template. We'll review it.

---

## Code Style

This project uses:

- **TypeScript** — strict mode, no `any`
- **Next.js App Router** — everything under `web/app/`
- **Tailwind CSS + inline styles** — utility classes for layout, inline styles for component-level adjustments
- **Custom components** — follow existing patterns in `web/components/`

Run `cd web && npm run build` before opening a PR to ensure there are no TypeScript errors.

---

## Repo Structure

```
onlyhumans/
├── web/                      # Next.js app (the product)
│   ├── app/                  # Pages and API routes
│   ├── components/           # Shared UI components
│   └── lib/                  # Utilities, DB client, economics
├── v3-protocol-design/       # Spec docs, research, design
├── agent/                    # XMTP agent (agent-accessible API)
└── CONTRIBUTING.md           # You are here
```

---

## PR Guidelines

- Keep PRs focused — one thing per PR
- Include screenshots for any UI changes
- Reference the issue your PR addresses (`Closes #123`)
- Fill out the PR template

---

## Questions?

Open an issue tagged `idea` or `question`. We're building this in public.
