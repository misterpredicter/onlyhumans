# Codex Taste Audit

Proposal-only review of the current `OnlyHumans` platform. No implementation in this pass.

Date: 2026-03-28

Scope reviewed:
- `AUDIT.md`
- `README.md`
- Core user-facing routes under `web/app/`
- Shared UI in `web/app/globals.css` and `web/components/`
- Product-facing and legacy API routes under `web/app/api/`
- Supporting protocol docs under `v3-protocol-design/`
- Parallel local agent reviews for product/content, UX/IA, and technical coherence

## Executive View

The platform has a real hook, a strong instinct for provocation, and a better sense of cultural timing than most hackathon projects. The problem is not that it lacks ambition. The problem is that it currently presents too many identities, too many futures, and too many truths at once.

Right now the public product reads as all of the following:
- a live marketplace where agents can make money now
- a protocol thesis about human-agent coordination
- an open-source hackathon project recruiting builders
- a partially hidden carryover from the earlier voting product

That creates the main taste failure: the site makes bold claims, but it does not maintain a single, stable frame long enough for a new user to trust what they are looking at.

My top-line recommendation is simple:

**Pick one public truth and make every surface obey it.**

My recommendation for that truth is:

**OnlyHumans is an open, World ID-verified project building a marketplace for human-and-agent work.**

That framing is honest about the current state, preserves the ambition, and gives you room to say what is live, what is demo, and what is planned without sounding evasive.

## Priority Stack

### P0: Trust-Breaking Contradictions

These are the highest-priority revisions because they make the product feel less intentional than it is.

1. **Choose a single public identity.**
   Evidence:
   - Homepage says "A platform where you bring your AI agents to make money." in `web/app/page.tsx:106`
   - Homepage CTA later becomes "find something to build, open a PR" in `web/app/page.tsx:353-357`
   - Join flow frames itself as "building this together at the hackathon" in `web/app/join/JoinPageClient.tsx:61-65`
   - Work page says the marketplace is still "launching soon" in `web/app/work/WorkPageClient.tsx:177`

   Concern:
   A visitor cannot tell whether this is a product to use, a thesis to read, or a project to join.

   Revision:
   Pick one top-level story and demote the other two to supporting context. If the current truth is "open project building a marketplace," say that everywhere.

2. **Stop presenting planned features as current product reality.**
   Evidence:
   - Docs say "Revenue auto-splits" and "Route any percentage into platform stake" in `web/components/docs/DocsPageClient.tsx:37-38`
   - Docs say x402 "auto-splits to every contributor on every transaction" in `web/components/docs/DocsPageClient.tsx:73`
   - Spec treats progressive disclosure, stake reinvestment, members layer, and contributor ranking as parts of the MVP in `web/app/spec/page.tsx:245-248` and `web/app/spec/page.tsx:432-436`
   - Join flow actually ends with "Read the spec. Find something you want to build. Open a PR. Ship it." in `web/app/join/JoinPageClient.tsx:269`

   Concern:
   The current site mostly ships narrative and verification, not the full marketplace/economics stack it describes.

   Revision:
   Add an explicit distinction on every major surface:
   - `Live now`
   - `Demo / illustrative`
   - `Planned`

   This would increase trust immediately.

3. **Resolve the economics contradiction before you do more storytelling.**
   Evidence:
   - Docs and spec say "No mandatory platform tax" and voluntary platform investment in `web/components/docs/DocsPageClient.tsx:43-53` and `web/app/spec/page.tsx:287-307`
   - Demo opportunities still hard-code platform cuts in `web/app/work/WorkPageClient.tsx:24-28`, `web/app/work/WorkPageClient.tsx:38-42`, and `web/app/work/WorkPageClient.tsx:52-56`
   - Backend economics still hard-code `90/9/1` in `web/lib/economics.ts:3-8`
   - `/api/status` still exposes the old pricing tiers and contribution splits in `web/app/api/status/route.ts`

   Concern:
   A user who reads carefully will conclude the economics are not settled.

   Revision:
   Decide between:
   - no platform take, with optional contributor allocation
   - platform take, stated plainly
   - transitional hackathon/demo economics, clearly labeled as temporary

   Then make the README, site copy, work examples, and backend docs all match.

4. **Rewrite README around the actual product that exists.**
   Evidence:
   - README tells people to register forks on-site and use `POST /api/forks` in `README.md:43-57`
   - There is no `/api/forks` route under `web/app/api/`
   - README still pitches a scoreboard, fork registry, governance access, and members layer in `README.md:11-23` and `README.md:113-119`

   Concern:
   The README currently overpromises product flows that do not exist.

   Revision:
   Split README into:
   - `What the project is today`
   - `What is live`
   - `What is demo`
   - `What is planned`
   - `How to contribute`

5. **Purge the last public traces of the old voting ontology.**
   Evidence:
   - `WorldIDVerify` still says "Unlock the verified work queue" in `web/components/WorldIDVerify.tsx:113`
   - It still says "One person, one vote" in `web/components/WorldIDVerify.tsx:116`
   - The World ID action still defaults to `"vote-on-task"` in `web/components/WorldIDVerify.tsx:200` and `web/app/api/auth/rp-signature/route.ts:9`

   Concern:
   This is not just cosmetic. It reveals that the conceptual model underneath the brand rewrite is still the old product.

   Revision:
   Make the verification language describe the current product truth, not the legacy data model.

6. **The trust story is stronger than the current enforcement model.**
   Evidence:
   - voting accepts a raw `nullifier_hash` from the request body and only checks whether it exists in `workers` in `web/app/api/tasks/[id]/vote/route.ts:16-41`
   - rating/reputation flows do not yet enforce the kind of privileged ownership the product story implies in `web/app/api/tasks/[id]/rate/route.ts`

   Concern:
   The copy suggests durable, identity-backed trust and governance. The implementation still behaves like a prototype.

   Revision:
   If these routes remain part of the real product story, introduce an authenticated session model after World ID verification and require stronger authorization for privileged actions.

### P1: Funnel and Information Architecture

These are not pure bugs. They are the places where the platform loses people who are actually interested.

1. **Split the funnel into "Use it" and "Build it."**

Current pattern:
- most CTAs are `Join the Project`
- post-verification actions point to GitHub/spec/docs
- there is almost nothing that says "use the product now"

Evidence:
- `web/app/page.tsx:114`
- `web/components/docs/DocsPageClient.tsx:140`
- `web/app/join/JoinPageClient.tsx:425`

Concern:
Customer intent and collaborator intent are currently mixed into one funnel.

Revision:
Create two explicit paths:
- `Use OnlyHumans`
- `Build OnlyHumans`

If the product is not live enough for a full "use" funnel, say that honestly and turn that path into a waitlist, pilot, or interest capture flow.

2. **Make `/work` and `/contributors` first-class proof surfaces or stop pretending they matter.**

Evidence:
- Main nav only exposes Join / Spec / Docs in `web/app/layout.tsx:46-59`
- `/work` and `/contributors` exist but are effectively secondary/orphaned routes

Concern:
The strongest proof surfaces are buried while the most abstract surfaces are promoted.

Revision:
Either:
- add `/work` and `/contributors` to the main nav

or

- weave them aggressively into the home/docs/join flow with stronger in-page links and proof modules

3. **Fix the route semantics.**

Current state:
- `/spec` is the actual thesis
- `/docs` is another explainer page
- `/work` links to `/docs` with the label "Read the spec" in `web/app/work/WorkPageClient.tsx:417-418`

Concern:
The labels do not map cleanly to user expectations.

Revision:
Give each route one job:
- `/` = landing page and primary positioning
- `/docs` = how it works today
- `/spec` = longform thesis / protocol memo
- `/work` = opportunities / example work / waitlist
- `/contributors` = proof of verified contributors

4. **The join flow is too high-friction for how little it returns.**

Evidence:
- Verification is first in `web/app/join/JoinPageClient.tsx:115-139`
- Role selection is collected in `web/app/join/JoinPageClient.tsx:194-243`
- Roles do not materially affect the next step

Concern:
This feels ceremonial rather than useful.

Revision:
Either:
- allow exploration before verification

or

- make verification unlock something concrete and role-specific immediately after success

5. **Use role selection to personalize next steps.**

Current role options:
- agents
- taste
- build
- explore

Concern:
Good segmentation is being collected and then ignored.

Revision:
Route each selection to different next actions:
- `agents` -> waitlist, operator intake, pilot tasks, marketplace prototype
- `taste` -> contributor onboarding, judgment examples, review queue concept
- `build` -> GitHub, open issues, contribution guide
- `explore` -> docs, spec, contributors, mailing list

6. **Several demo-looking flows currently dead-end.**

Evidence:
- `POST /api/tasks` still returns a `task_url` and `results_url` in `web/app/api/tasks/route.ts:271-272`
- `/task/[id]` now redirects to `/docs` in `web/app/task/[id]/page.tsx`
- the agent/XMTP side still references task/work links from the older flow shape
- `/work` is illustrative only and does not read live task data

Concern:
This makes the product feel half-rewired rather than intentionally staged.

Revision:
Either hide these flows completely or restore a tiny but truthful end-to-end task/opportunity path that actually resolves.

### P2: Content, Voice, and Narrative Taste

The copy has energy and conviction. It also has too many registers fighting each other.

1. **The tone swings between sharp and defensive.**

Evidence:
- "That’s not socialism." in `README.md:35-37`
- "Permanent bans if you game it — biometric, forever." in `web/app/join/JoinPageClient.tsx:145`
- "We split the prize with contributors." in `web/app/page.tsx:357`

Concern:
These lines may feel vivid internally, but externally they can lower perceived seriousness in a trust-sensitive category.

Revision:
Keep the edge. Remove the compensatory posture.

Rule of thumb:
- one sharp line is voice
- repeated pre-emptive arguments feel insecure

2. **The brand name is still being explained away on every page.**

Evidence:
- `README.md:3`
- `web/app/page.tsx:93`
- `web/components/docs/DocsPageClient.tsx:137`

Concern:
If the product has to repeatedly explain its own name, the name is still causing more confusion than lift.

Revision:
Either:
- keep `OnlyHumans` but pair it with a stable descriptor every time

or

- introduce a clearer product/protocol descriptor that carries the functional meaning

3. **There is too much borrowed authority and not enough grounded proof.**

Evidence:
- Many precise ecosystem numbers appear across home, spec, and README
- Spec cites "pressure-tested against ChatGPT, Grok..." in `web/app/spec/page.tsx:118`
- Spec repeats "via Grok" in the economics section at `web/app/spec/page.tsx:296` and `web/app/spec/page.tsx:300`

Concern:
This makes the product feel more deck-like than product-like.

Revision:
Use fewer external proof points, but make them carry more weight.

Suggested hierarchy:
- one or two ecosystem proof points
- one concrete product use case
- one current-state proof of execution

4. **Homepage is strong conceptually but still abstract in the wrong places.**

What works:
- strong hook
- four human roles
- clear "why now" energy

What does not work:
- the first practical explanation is still vague
- a new user does not quickly learn what they can actually do next

Revision:
Replace some abstractions with one sharp sentence such as:

`OnlyHumans is a World ID-verified network for people who use agents to source work, split upside, and coordinate human-only contributions.`

5. **Hackathon honesty is good, but it should not lead the trust frame.**

Evidence:
- founder note in `web/app/page.tsx:382-408`
- repeated hackathon framing across pages

Concern:
Honesty helps. But when paired with large claims, too much "this is rough" language can make the whole thing feel provisional.

Revision:
Keep hackathon context as a framing note, not a dominant selling point.

### P3: Design System and Visual Cohesion

This is the area where the site feels promising but not yet authored enough.

1. **The design system exists, but the pages still behave like custom one-offs.**

Evidence:
- shared UI classes are defined in `web/app/globals.css`
- pages still rely heavily on large inline-style blocks

Concern:
The visual language is consistent in ingredients, but inconsistent in execution.

Revision:
Standardize a small number of repeated primitives:
- hero layout
- section header
- proof card
- CTA row
- callout block
- footer module

2. **Mobile navigation is currently removed, not solved.**

Evidence:
- `.site-nav { display: none; }` under `@media (max-width: 900px)` in `web/app/globals.css:1092-1094`

Concern:
This is a product confidence leak. Hiding navigation on small screens without a replacement suggests incompleteness.

Revision:
Add a real mobile nav or simplified drawer. Do not just remove the core wayfinding layer.

3. **There are visible small-screen layout risks.**

Evidence:
- join step indicator is a fixed horizontal sequence in `web/app/join/JoinPageClient.tsx:78-110`
- work cards use `minmax(340px, 1fr)` in `web/app/work/WorkPageClient.tsx:216`
- contributors page stays table-like in `web/app/contributors/page.tsx:104-169`

Concern:
Even before visual QA, these are the patterns most likely to feel cramped on phones.

Revision:
Design explicit mobile states for those pages instead of relying on generic shrinking.

4. **Typography discipline is drifting.**

Evidence:
- loaded font variables are `--font-sans`, `--font-serif`, `--font-mono` in `web/app/layout.tsx`
- homepage founder note uses `var(--font-dm-serif)` and `var(--font-dm-sans)` in `web/app/page.tsx:384` and `web/app/page.tsx:394`

Concern:
This is the kind of inconsistency users do not consciously identify but do feel as a lack of finish.

Revision:
Treat typography tokens as a hard API.

5. **The proof hierarchy needs to get stronger.**

Current order across the site:
- idea
- rationale
- ecosystem references
- call to join

Missing:
- concrete proof of current product state
- clear line between demo and live capability
- explicit user outcomes

Revision:
Each page should visibly answer:
- What is live?
- What is demo?
- What can I do right now?
- Why should I trust this?

## Route-by-Route Revisions

### `/`

Keep:
- strong title
- four-role framing
- "why now" instinct

Revise:
- make the first paragraph honest about current state
- decide whether the CTA is for users or builders
- reduce the number of conceptual claims before the first concrete action
- move prize-split language out of the main persuasion stack
- soften "Moltbook proved the thesis" into a more grounded cautionary proof

Suggested job for this page:
`Explain the product in one screen, show why it matters, route users into the correct funnel.`

### `/join`

Keep:
- three-step framing
- role-selection idea
- World ID centerpiece

Revise:
- show the value of joining before requiring verification
- make role selection actually affect the next step
- replace punitive-sounding verification copy with trustworthy, matter-of-fact copy
- add one clear current-state promise after verification instead of generic "read spec / open PR"

Suggested job for this page:
`Turn interested people into identified participants without wasting their attention.`

### `/docs`

Keep:
- "Humans steer. Agents execute."
- compact structure
- human roles and tech stack sections

Revise:
- retitle internally as "How it works today"
- move future-state or speculative mechanics into a clearly marked planned section
- stop presenting unstaged economics features as current behavior
- add one section called `What is live right now`

Suggested job for this page:
`Give a practical overview of the current product, not a speculative protocol layer.`

### `/spec`

Keep:
- longform thesis
- risk section
- comparison table
- willingness to state constraints

Revise:
- make assumptions and future bets explicit
- remove AI-model name-dropping as credibility scaffolding
- footnote or source hard factual claims if they remain
- separate `current implementation`, `working assumptions`, and `future design`

Suggested job for this page:
`Be the full-thesis document for people who want the deepest version of the argument.`

### `/work`

Keep:
- concept of example opportunities
- split breakdown visual
- "launching soon" honesty

Revise:
- stop implying current operational settlement if this is only illustrative
- either remove platform cuts or explain why demo splits include them
- add a specific next step per card or per persona
- fix the mislabeled CTA that links to `/docs` as "Read the spec"

Suggested job for this page:
`Show what work on the platform could look like and capture intent from the people who want it most.`

### `/contributors`

Keep:
- privacy-preserving nullifier display
- clear World ID framing

Revise:
- do not use `Loading...` as the hero
- distinguish fetch failure from true empty state
- make the zero-state more socially meaningful
- expose the page more prominently if contributor proof matters

Suggested job for this page:
`Show that verified humans exist here without making the page feel empty or brittle before scale.`

### `README.md`

Keep:
- energy
- ambition
- clear interest in collaboration

Revise:
- remove nonexistent flows like `/api/forks`
- distinguish product copy from contributor setup docs
- move speculative roadmap items out of the "current state" voice
- treat the README as the source of truth for what a new contributor can actually do today

Suggested structure:
- What this is
- What is live
- What is demo
- What is planned
- Local setup
- How to contribute

## Technical Product-Coherence Concerns

This section is not a request to implement. It is a list of places where the current platform story and the underlying codebase disagree in a way that can leak outward.

1. **The backend is still fundamentally a task-voting platform.**

Evidence:
- schema in `web/lib/db.ts`
- task creation in `web/app/api/tasks/route.ts`
- voting in `web/app/api/tasks/[id]/vote/route.ts`
- rating/reputation in `web/app/api/tasks/[id]/rate/route.ts` and `web/app/api/leaderboard/route.ts`

Concern:
The v3 brand/story has been rewritten faster than the underlying system shape.

Suggestion:
Decide whether this code is:
- legacy to be retired
- hidden prototype infrastructure
- the actual operational core of v3

Then label and organize it accordingly.

2. **Legacy APIs are still exposed and conceptually alive.**

Notable examples:
- `/api/status`
- `/api/stats`
- `/api/leaderboard`
- `/api/tasks`
- `/api/tasks/[id]/vote`
- `/api/tasks/[id]/rate`

Concern:
Even if not linked publicly, these routes preserve the old ontology and can confuse future contributors or leak into new copy.

Suggestion:
Document them as legacy, archive them, or route them into a clearly named prototype area.

3. **The verification layer still speaks the old product language.**

Evidence:
- "verified work queue"
- "one person, one vote"
- `vote-on-task`

Concern:
This is one of the strongest signals that the public story and backend reality are not fully reconciled.

Suggestion:
Make the verification component describe what verification unlocks in the current product, not what it unlocked in v2.

4. **Some legacy flows are still wired as if the old task product exists end-to-end.**

Examples:
- `POST /api/tasks` still returns URLs for a task flow that now redirects away
- agent-side notifications still point into the old flow shape
- `/work` does not actually read or render those task objects

Concern:
This is worse than dead code because it looks operational until you follow it.

Suggestion:
Either remove those outputs now or restore a small, coherent task/opportunity path that actually lands somewhere useful.

5. **README and live routes do not describe the same system.**

Examples:
- README talks about fork registration and API flows that do not exist
- site flow ends in GitHub/spec/docs
- Quick Start still points to `/api/init` and `/api/seed`, which populate demo tasks for a product model the site no longer publicly foregrounds

Concern:
This creates contributor confusion before any code even runs.

Suggestion:
Treat README as a product contract, not just a hype surface.

6. **The contributor story does not yet have one canonical data contract.**

Evidence:
- README says revenue is self-reported and updated by GitHub Actions
- `/api/contributors` returns verified `workers`
- the contributors UI and scoreboard workflow are not obviously built around the same assumptions

Concern:
"Contributor" currently means slightly different things across README, workflow automation, API, and UI.

Suggestion:
Define one contributor model and make README, workflow, API, and UI all describe the same entity.

7. **The contributors implementation is serviceable but not yet high-trust.**

Evidence:
- fetch errors are swallowed in `web/app/contributors/page.tsx:39`
- count reflects returned row length, not a total from the database, in `web/app/api/contributors/route.ts`

Concern:
This is acceptable for a hackathon demo, but weak if contributor proof becomes central to the product claim.

Suggestion:
If contributor proof matters strategically, promote it from demo-grade to product-grade.

8. **`AUDIT.md` is useful but now structurally stale.**

Evidence:
- it treats `web/lib/economics.ts` and other legacy pieces as effectively dead or harmless
- those same pieces are still powering live APIs and shaping backend behavior

Concern:
The audit can now mislead future cleanup work because it assumes the old engine has already been disconnected.

Suggestion:
Update the audit so it distinguishes between dead presentation code, still-live legacy backend code, and intentionally preserved prototype infrastructure.

9. **Demo assets still contain old framing.**

Evidence:
- `web/public/demo/design-a.svg` still references judgment/voting copy

Concern:
These loose ends matter because the whole current brand move is about escaping the old frame.

Suggestion:
Do a final pass on any publicly reachable assets, not just route code.

## Suggested Sequence

If I were prioritizing revisions without implementing anything yet, I would do them in this order:

1. **Positioning decision**
   Choose the single public truth and target user.

2. **Route contract**
   Define the exact job of `/`, `/docs`, `/spec`, `/work`, `/join`, and `/contributors`.

3. **Truthfulness pass**
   Rewrite copy so every claim is tagged implicitly or explicitly as live, illustrative, or planned.

4. **Economics decision**
   Resolve the contradiction between optional platform allocation and hard-coded platform cuts.

5. **Funnel split**
   Separate user-intent from builder-intent.

6. **Verification copy rewrite**
   Remove the last public traces of the old voting ontology.

7. **Dead-end flow cleanup**
   Remove or repair any flow that still behaves like the old task product.

8. **Mobile and visual cohesion**
   Add mobile nav, tighten repeated components, and normalize typography usage.

9. **Trust/auth cleanup plan**
   If legacy APIs remain, bring the enforcement model closer to the trust claims.

10. **Backend narrative cleanup plan**
   Decide what old APIs and schema pieces are legacy, prototype, or core.

## Fast Version

If you want the bluntest possible summary:

- The idea is good.
- The site is not sloppy because it is ugly; it is sloppy because it is saying too many different things.
- The most important revision is not visual polish. It is narrative hierarchy.
- The second most important revision is honesty about what is live versus what is imagined.
- The third is removing the leftover voting-product worldview from the parts users can still feel.

Once those three are fixed, the design work will start compounding instead of compensating.
