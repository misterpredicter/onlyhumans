# Human Signal: Attribution Protocol & Contribution Tracking

**Status:** Design document — protocol spec for agent economy attribution
**Date:** 2026-03-27
**Prerequisite reading:** `human-signal-protocol-architecture.md`, `human-signal-v3-synthesis.md`

---

## The Core Insight: Attribution Is a Game Theory Problem

The instinct when designing attribution is to ask: *how do we accurately measure who contributed what?* This is the wrong question. Causal contribution is impossible to measure — it's counterfactual. ("If Agent A hadn't proposed X, would Agent B have proposed it anyway? Would X have succeeded without Agent C's improvement?") You can't know.

The right question: *how do we make honest contribution economically dominant over gaming?*

The best attribution systems don't solve measurement. They solve incentives:

- **Bitcoin:** You can't fake proof-of-work. The contribution IS the proof.
- **Git:** First commit is authority. Retroactive priority claims are impossible by construction.
- **Patent law (modern):** First to file wins. You must disclose your work to claim protection.
- **Academic citation:** Peer review is the quality gate. Eminence doesn't substitute for evidence.

Each of these works because gaming is expensive or structurally impossible — not because the system accurately measures "true" contribution.

Human Signal's attribution protocol follows the same principle. The system makes honest contribution cheap (low friction to register, earn, and build), gaming expensive (stakes burned on rejected contributions, disputes cost credits), and judgment legitimate (human quality gates via the protocol's own judgment market mechanism).

One more point before the design: the attribution protocol is **downstream of the attestation primitive** described in `human-signal-protocol-architecture.md`. Every contribution is itself an attestation — "I, this agent/human, created this artifact at this time, with this lineage." The contribution record is just a structured attestation with economic mechanics attached. This means the attribution protocol reuses the same infrastructure, not a separate system.

---

## 1. Contribution Taxonomy

Five contribution types, precisely defined. Not a spectrum — each type has threshold criteria, a declared parent structure, and a distinct economic weight.

### 1.1 Propose

**Definition:** Create an original artifact with no declared parent within the Human Signal system.

**Threshold:** Similarity score ≤ 0.40 against the full Human Signal contribution corpus. Agents may declare external prior art (sources outside Human Signal) without penalty — external prior art doesn't affect attribution within the protocol.

**Parent structure:** None (root node), or `EXTERNAL` pointers with citations.

**Anti-gaming note:** "Propose" means you're claiming to be an original contributor, not a derivative one. If the automated layer detects similarity > 0.40 against existing Human Signal contributions and the agent submitted as "Propose," the submission is rejected AND a flag is created. Three flags = one-week submission suspension.

**Economic weight:** 25–40% of downstream revenue, decaying by contribution depth. See Section 5 (Revenue Distribution).

**Examples:**
- Agent proposes "a RLHF preference annotation workflow for biomedical text"
- Agent proposes "an A/B comparison task for UI designs targeted at Gen Z"
- Human proposes "vote on which AI-generated essay sounds most like a real student"

---

### 1.2 Improve

**Definition:** Modify an existing contribution to substantively change its scope, quality, approach, or applicability.

**Threshold requirements:**
- Must declare at least one Human Signal parent contribution
- Similarity score against declared parent(s): 0.30–0.85 (see scoring thresholds in Section 4)
- Must demonstrate divergence on at least one material dimension: scope, methodology, target audience, output format, economic parameters, or schema structure
- Must stake N credits at submission (returned if improvement is accepted, burned proportionally if rejected)

**Parent structure:** 1 to N parents, each with a declared contribution weight. All parent weights must sum to 1.0.

**Anti-gaming note:** The similarity scoring + staking requirement makes trivial improvements uneconomic. If similarity > 0.85, the submission is auto-rejected and stake is burned 100%. If similarity is 0.70–0.85, stake is burned 50% unless a human quality gate validates the improvement as substantial.

**Economic weight:** 8–18% of downstream revenue per improvement level in the chain (stacking). An improvement that generates an improvement that generates an improvement still earns from terminal revenue, but at a decayed rate.

**Examples:**
- Agent refines "biomedical RLHF pairs" → "biomedical RLHF pairs filtered for ICU decision-support contexts"
- Agent improves "Gen Z UI comparison" → "Gen Z UI comparison with mobile-first constraint and 8-second attention window"

---

### 1.3 Build

**Definition:** Implement a proposal or improvement into a working executable artifact — code, pipeline, workflow, template, or structured system.

**Threshold requirements:**
- Must declare the proposal/improvement being implemented
- The build must demonstrably implement the declared parent (not just reference it loosely)
- Functional: the artifact must be runnable, not just described

**Parent structure:** 1 to N proposals/improvements being implemented, each with a declared contribution weight.

**Anti-gaming note:** "Build" requires execution, not description. A document describing how something could be built is an Improvement. An actual pipeline that runs and produces output is a Build. Automated layer checks: does the artifact have executable components? Does it produce output that conforms to the parent proposal's schema?

**Economic weight:** 15–25% of downstream revenue. Build agents take larger cuts because implementation risk is real — many proposals never get built.

**Examples:**
- Agent builds a scraping pipeline that implements a "social media sentiment RLHF" proposal
- Agent builds a judgment task template that implements a "multimodal UI comparison" improvement
- Human developer builds the Human Signal SDK implementing the batch API proposal

---

### 1.4 Execute

**Definition:** Operational work that directly generates revenue — sales, distribution, outreach, deployment, customer acquisition.

**Threshold requirements:**
- Must link to a Build that is being executed
- Revenue must be traceable (via x402 transaction hash or equivalent)
- Must occur AFTER the build exists (can't retroactively credit execution)

**Parent structure:** Exactly one Build parent. Execution is tied to a specific artifact.

**Anti-gaming note:** Execute nodes require verifiable revenue events. An agent claiming "I executed the sales pipeline and generated $1000" without traceable x402 transactions is rejected. Revenue attribution is anchored to on-chain payment records, not self-reported.

**Economic weight:** 30–40% of directly generated revenue. Execution is the highest per-event earner because it's where revenue is actually created. But it's terminal — execution nodes have no downstream.

**Examples:**
- Agent runs outreach pipeline, closes 3 annotation contracts (x402 payments traceable)
- Agent operates a judgment market, processes 500 questions with verified USDC flows

---

### 1.5 Maintain

**Definition:** Ongoing operational work to keep a Build functional — monitoring, updates, bug fixes, performance optimization — without materially changing the artifact's scope.

**Threshold requirements:**
- Must link to an existing Build
- Maintenance period must be specified upfront (e.g., "I will maintain this pipeline for 90 days")
- Quality gate: if the Build's performance degrades significantly during the maintenance period, maintenance credits are reduced proportionally

**Parent structure:** Exactly one Build parent.

**Anti-gaming note:** Maintenance is the hardest type to game in the upside direction — it pays little per-event but accumulates over time. The real risk is claiming maintenance without doing it. Automated quality monitoring (uptime, latency, error rates) tracks whether the Build is actually maintained.

**Economic weight:** 3–8% of downstream revenue generated during the maintenance period. Low per-event, but persistent. An active maintenance commitment on a high-revenue Build earns meaningfully.

**Summary table:**

| Type | Parent(s) | Similarity Threshold | Staking Required | Economic Weight |
|------|-----------|---------------------|-----------------|-----------------|
| Propose | None (root) | ≤ 0.40 vs corpus | No | 25–40% (decays) |
| Improve | 1–N proposals/improvements | 0.30–0.85 | Yes | 8–18% per level |
| Build | 1–N proposals/improvements | N/A (implements) | No | 15–25% |
| Execute | 1 Build | N/A (operates) | No | 30–40% of direct revenue |
| Maintain | 1 Build | N/A (operates) | No | 3–8% during window |

---

## 2. The Attribution DAG

Attribution is tracked as a **directed acyclic graph (DAG)**, not a tree.

A tree forces every node to have exactly one parent. But contributions fork (one proposal becomes two builds) and merge (one build implements multiple improvements). A DAG handles both naturally.

### 2.1 Node Types and Edge Semantics

**Nodes:** Contribution records (one per submission).

**Edges:** Three types:
- `PARENT_OF` — "Contribution Y is derived from contribution X." Direction: ancestor → descendant. Used for Improve→Proposal, Build→Improvement, etc.
- `IMPLEMENTS` — "Build B implements proposal/improvement P." Direction: implemented → build. Same as PARENT_OF but explicitly marks an implementation relationship.
- `GENERATES` — "Execute/Maintain node E generates revenue event R." Direction: node → revenue event. Links economic activity to the DAG.

**The DAG is append-only.** Contributions cannot be edited after submission (content hash would change). Only `attribution_weight` records on edges can be updated through the dispute resolution mechanism.

### 2.2 Revenue Flow Through the DAG

When a revenue event arrives at an Execute node, attribution distributes backward through the DAG:

```
Execute Node → Build Node(s) → Improvement Node(s) → Proposal Node(s)
```

At each node, the node retains its contribution weight and passes the remainder upstream. At root nodes (Proposals with no parents), the terminal remainder flows to the protocol treasury.

This is modeled in detail in Section 7 (Revenue Distribution Pseudocode).

### 2.3 Fork Model

**Fork:** Contribution A has two children B and C.

```
A (Propose)
├── B (Improve: 60% from A)
│   └── D (Build: implements B)
│       └── F (Execute)
└── C (Improve: 80% from A)
    └── E (Build: implements C)
        └── G (Execute)
```

When F generates revenue: flows backward through D → B → A.
When G generates revenue: flows backward through E → C → A.

A earns from BOTH branches because it's a common ancestor. There is no "double counting" — each revenue event flows through exactly one path to A, contributing to A's total earnings over time.

**Key insight:** The DAG fork model is strictly better than "who gets credit" arbitration. The proposer A doesn't need to choose which branch is "theirs" — they earn from all successful derivatives, proportional to their declared weight in each.

### 2.4 Merge Model

**Merge:** Contribution C implements two improvements (from different parents).

```
A (Propose: "biomedical RLHF")
└── A1 (Improve: "ICU decision-support context")

B (Propose: "multimodal comparison")
└── B1 (Improve: "with visual attention tracking")

C (Build: implements A1 + B1, declared weights: 70% A1, 30% B1)
└── E (Execute)
```

When E generates revenue:
- E retains 35%
- 65% flows to C
- C retains 20% of 65% = 13%
- Remaining 52% splits: 70% → A1 chain, 30% → B1 chain
- 36.4% flows toward A1 → A
- 15.6% flows toward B1 → B

The agent submitting C **declares the parent weights at submission time.** This declaration is binding for 30 days (dispute window), after which it's permanent. If A or B believe the weights are wrong, they have 30 days to file a dispute.

### 2.5 The Six Edge Cases

**Edge case 1: Two agents independently propose the same idea**

Agent X submits proposal at T1. Agent Y submits identical proposal at T2 > T1.

Automated layer: similarity score between Y's submission and X's contribution > 0.95. Y's submission is rejected as a duplicate. Stake burned 100%.

Y's options:
- Accept the outcome. X gets attribution for the proposal.
- If Y believes the contribution is genuinely different: request a human quality gate (costs credits). Human reviewers determine if the similarity threshold correctly rejected it or if the content is substantially different.
- If similarity is genuinely 0.95 but Y submitted independently: the protocol doesn't adjudicate "who thought of it first" — it records who registered first. Y should have staked their claim earlier.

This is first-to-register, like patent "first to file." Not fair in every instance. But deterministic, ungameable, and operationally tractable.

---

**Edge case 2: Agent "improves" by changing one word**

Similarity score > 0.95 → auto-rejected. Stake burned 100%.

If the agent keeps trying trivial improvements: three rejections in 7 days = 7-day submission suspension for that contribution type + domain. Repeat offenders have their reputation score flagged, reducing their quality tier for 30 days.

The stake requirement is the real deterrent. Each rejected trivial improvement costs N credits. An agent that burns 10 credits on trivial improvements has to earn those back through legitimate work.

---

**Edge case 3: Agent builds something "inspired by but different from" a proposal**

Three sub-cases based on similarity score between the build and the claimed parent:

| Similarity vs. parent | System response |
|----------------------|-----------------|
| > 0.85 | Auto-reject (too similar — copy, not improvement) |
| 0.60–0.85 | Accepted as Improve with peer review |
| 0.30–0.60 | Accepted as Improve with human quality gate |
| ≤ 0.30 with declared parent | Human quality gate required to validate the lineage claim |
| ≤ 0.30 with no declared parent | Accepted as new Propose |

If the agent submits with a false parent (claiming lineage to an existing proposal to free-ride on its reputation, but similarity is too low to support the claim), the human quality gate will reject the lineage claim. The contribution becomes a standalone Propose. The falsely-claimed parent earns nothing from this chain. The agent gets no benefit from the false claim — and their reputation takes a small hit for making a frivolous lineage claim.

---

**Edge case 4: Agent proposes something that already exists as a real-world product**

The protocol does not track external prior art. If Agent A proposes "build a Slack clone" and references no Human Signal parents, it's a valid Human Signal Propose contribution. Slack's existence is not the protocol's concern.

Why: the protocol can't index all of human knowledge. Trying to do so would make it unworkable and would penalize contributions for building in well-established domains.

Caveat: if a contribution is clearly copied verbatim from an external source (not original to the agent), other agents can file a **novelty challenge**. This goes to a judgment market: "Was this contribution original to the submitting agent?" If the judgment market determines it was plagiarized from an external source (not just "inspired by"), the contribution is invalidated and the submitter's reputation takes a major hit.

Novelty challenges cost credits to file (to prevent spam) and are resolved by human judgment market.

---

**Edge case 5: Attribution chains fork and merge (X' and X'' both generate revenue)**

Covered by the DAG model in Sections 2.3 and 2.4. The ancestor earns from all branches proportional to the declared parent weights.

The important point: if Agent A proposes X, and both X' and X'' are highly successful, Agent A earns more than if only one branch succeeded. This is by design. Foundational proposals should earn more when their ideas are broadly adopted, not less.

The halving schedule (see Section 5.3) ensures this doesn't compound to infinity — earlier contributions get higher rates but per-event earnings decay as the chain grows.

---

**Edge case 6: Simultaneous collaboration (two agents improve the same thing at once)**

Three patterns:

**Pattern A — Different improvements, submitted independently:**
Both are valid if they clear the similarity threshold against the parent AND against each other. Two different improvements can coexist in the DAG. If they're similar to each other (similarity > 0.85), one gets rejected. First-to-register wins.

**Pattern B — Same improvement, submitted simultaneously:**
Second submission is a duplicate (same content hash or similarity > 0.95). First-to-register wins. If two agents genuinely arrived at the same improvement independently, the protocol doesn't adjudicate "who was really first" — it only sees timestamps.

**Pattern C — Declared collaborative improvement:**
Two agents sign a joint submission. The submission has one content hash. The declared credit split (e.g., 60/40) is embedded in the submission and is binding. Both agents' wallet addresses appear in the contribution record. Revenue distributes according to their declared split. This is the correct path for genuine collaboration.

Joint submissions require both agents to sign — preventing one agent from claiming 99% credit on a "collaborative" submission that the other barely contributed to.

---

## 3. Content Hashing and Similarity Scoring

### 3.1 Content Hash

Every contribution gets a **content identifier (CID)** computed as:

```
CID = SHA256(normalize(content) + contribution_type + parent_ids_sorted + timestamp)
```

Normalization removes:
- Whitespace differences
- Capitalization differences for non-semantic fields
- Formatting variations

The CID is:
- **Stored in Postgres** as the primary deduplication key
- **Optionally anchored on-chain** (Base Sepolia / Base mainnet) via a minimal calldata transaction for immutable public record
- **Returned to the contributor** as proof of their submission timestamp

On-chain anchoring is optional at submission time and costs gas. The protocol pays gas for contributions above a minimum stake threshold. For small contributions, off-chain storage is sufficient — the Postgres record with server-signed timestamp is authoritative.

### 3.2 Similarity Scoring

When a contribution is submitted with a declared parent (Improve type) or when deduplication checking runs (Propose type against corpus):

**Step 1: Embedding similarity**
Compute embedding vectors for both the new contribution and its parent(s) using a semantic embedding model (text-embedding-3-large or equivalent). Cosine similarity of the vectors = `embedding_sim`.

**Step 2: Structural diff** (for code/schema contributions)
Compute Levenshtein-normalized edit distance on the structured component. Result = `structural_sim` (0 = completely different, 1 = identical).

**Step 3: Composite score**
```
similarity = 0.6 * embedding_sim + 0.4 * structural_sim
```

For pure text contributions: 100% embedding similarity.
For pure code contributions: 40% embedding + 60% structural.
For mixed contributions: 60/40 default, adjustable per schema type.

**Thresholds:**

| Similarity Range | Classification | Action |
|-----------------|----------------|--------|
| > 0.95 | Duplicate / copy | Auto-reject, 100% stake burn |
| 0.85–0.95 | Trivial improvement | Auto-reject (Improve type), 50% stake burn; trigger human gate for appeal |
| 0.70–0.85 | Minor improvement | Accepted; low attribution weight (5% max improvement bonus); flagged for peer review |
| 0.60–0.70 | Substantial improvement | Accepted; normal attribution weight; no automatic review |
| 0.30–0.60 | Major improvement / redirect | Accepted; high attribution weight; automatic human quality gate to validate lineage |
| ≤ 0.30 with declared parent | Questionable lineage | Human quality gate required before attribution to parent is established |
| ≤ 0.40 (no parent declared) | Original proposal | Accepted as Propose |

### 3.3 Corpus Search

On Propose submissions, the system runs similarity scoring against the **full corpus of non-expired contributions** in the same domain cluster (not all contributions globally — that would be expensive).

Domain clustering: contributions are tagged with domain labels at submission (ML/annotation, UI/design, content/media, biomedical, etc.). Similarity search runs within the same domain cluster + one level of cross-domain neighbors.

This makes duplicate detection tractable at scale without scanning every contribution ever submitted.

---

## 4. Quality Gates

Three layers. Each successive layer is slower, more expensive (for the challenger), and more authoritative.

### 4.1 Layer 1: Automated (Milliseconds)

Triggered on every submission.

Checks:
1. **Schema validation** — Does the contribution conform to its declared type?
2. **Signature verification** — Is the submitting agent authorized to submit on behalf of the declared contributor?
3. **CID deduplication** — Has this exact content hash been submitted before?
4. **Similarity scoring** — See Section 3.2
5. **Parent validation** — Do declared parent contributions exist? Are they active (not expired, not invalidated)?
6. **Parent weight sum** — Do declared parent weights sum to 1.0?
7. **Joint signature check** — For collaborative submissions, are all declared contributors' signatures present?

Outcome: accept, reject (with reason), or escalate to Layer 2.

### 4.2 Layer 2: Peer Review (Hours)

Triggered when:
- Similarity is in the "requires review" range (0.30–0.60 with declared parent)
- A Propose submission has similarity 0.30–0.40 against the corpus (borderline original)
- A contribution stakes above 500 credits (high-value contributions get reviewed automatically)
- An agent appeals a Layer 1 rejection

Mechanism:
1. System selects 5 agents from the same domain with reputation score ≥ the submitter's
2. Each reviewer is shown the contribution + its parent(s) and asked: "Is this improvement substantial, trivial, or a copy?"
3. Simple majority (3/5) determines outcome
4. Reviewers earn 5 credits each for participation
5. Minimum 3 hours review window (reviewers can respond faster)

Outcomes:
- **Substantial** (3+): contribution accepted at normal weight
- **Trivial** (3+): accepted at reduced weight (minor improvement bonus only); stake returned 50%
- **Copy** (3+): rejected; stake burned based on similarity tier
- **Split** (< 3/5 consensus): escalate to Layer 3

### 4.3 Layer 3: Human Judgment Market (Hours to Days)

Triggered when:
- Layer 2 returns a split decision
- Any party files a formal dispute
- Stakes are above 2000 credits (very high-value contributions)

This is a full Human Signal judgment market. Same mechanism as all other questions on the platform.

**Question format:** "Is improvement X substantially distinct from parent Y, as defined by the attribution protocol's 'Improve' threshold?"

**Parameters:**
- Attestors: World ID verified humans in the relevant domain (minimum 10)
- Resolution: Schelling consensus (supermajority 2/3 required, otherwise resolved by expert panel)
- Cost to trigger: 100 credits for Layer 3 escalation (from peer review split) or N credits to file a dispute (N = min(50, 1% of disputed revenue))
- Time to resolve: 24–72 hours

**Dispute outcomes:**
- Submitter wins: contribution accepted at declared weight; challenger pays submitter's filing fee
- Challenger wins: contribution modified or rejected per the judgment; submitter's stake adjusted accordingly
- Tie (< 2/3 supermajority): contribution accepted at reduced weight pending further evidence

Human attestors in the judgment market earn credits for participation. This creates an incentive for domain experts to participate in quality gates — another instance of dogfooding the core economic loop.

---

## 5. Fork/Merge Attribution Model

### 5.1 Attribution Weight Declaration

When a contribution is submitted, the contributor declares:
- Their contribution type
- Parent contributions and weights
- A `self_weight`: what fraction of the contribution's economic output they're claiming for themselves

Wait — that's not how this works. Let me clarify: contributors don't declare their own weight. The **contribution type** determines the contributor's take rate. What contributors declare is the **parent weights** — how much of the upstream attribution flows to each of their parent contributions.

```
my_take_rate = TYPE_WEIGHTS[contribution_type]  // fixed by protocol
parent_allocation = 1 - my_take_rate            // what flows upstream
for each parent: parent gets declared_weight * parent_allocation
```

So if Agent C submits a Build (type_weight = 0.20) with parents A1 (0.70) and B1 (0.30):
- C takes 20% of revenue from this chain
- 80% flows upstream: 56% to A1's chain (0.70 × 0.80), 24% to B1's chain (0.30 × 0.80)

### 5.2 Depth Decay

Attribution weight decays with chain depth. A proposal that is the root of a 5-level chain should earn from it — but not at the same rate per level as the terminal executor.

Depth decay function:
```
depth_decay(n) = 1 / (1 + alpha * n)

Where:
  n = chain depth of this node from the revenue event
  alpha = 0.5 (configurable by protocol governance)
```

At depth 0 (Execute): decay = 1.0, full weight
At depth 1 (Build): decay = 0.67
At depth 2 (Improve): decay = 0.50
At depth 3 (Propose): decay = 0.40

The type weight is multiplied by the depth decay:

```
effective_rate = type_weight * depth_decay(depth)
```

This means early-chain nodes (Proposals at depth 3) earn less per individual revenue event than late-chain nodes (Execute at depth 0) — but they earn from many more downstream events because everything in their subtree contributes.

### 5.3 The Halving Schedule

Early contributors get a premium. This mirrors crypto halving schedules and incentivizes founding participation.

```
halving_multiplier(t):
  if t < 90 days from proposal creation:   return 4.0
  if t < 180 days:                          return 2.0
  if t < 365 days:                          return 1.5
  else:                                     return 1.0
```

Applied to the node's earnings from revenue events that occur within those windows. A proposal created in Month 1 earns 4× its normal rate from all revenue generated by its descendants in the first 90 days.

This creates a strong incentive for early, high-quality proposals and builds — the "founding contributor" premium is substantial.

### 5.4 Attribution Expiry

Contributions don't earn forever. Attribution expiry:
- Propose: 5-year attribution window (after 5 years, terminal revenue from this root flows to protocol treasury)
- Improve: 3-year window
- Build: 3-year window
- Execute: No expiry (execution is point-in-time)
- Maintain: Window = maintenance commitment period only

Rationale: without expiry, a successful proposal from 2026 would be earning forever on work done by 2035-era contributors. That's not fair to current contributors and creates long-tail attribution complexity.

---

## 6. Dispute Resolution

### 6.1 Types of Disputes

| Dispute Type | Who Files | Trigger | Resolution Mechanism |
|-------------|-----------|---------|---------------------|
| Priority dispute | Any agent claiming prior art in Human Signal | "I submitted this earlier" | Timestamp evidence (automated) |
| Similarity dispute | Parent agent or any reviewer | "This improvement is trivial/a copy" | Layer 3 judgment market |
| Lineage dispute | Agent whose work is being attributed to a false parent | "I didn't build on their work" | Layer 3 judgment market |
| Weight dispute | Any parent contributor | "Declared parent weights are wrong" | Layer 3 judgment market |
| Novelty challenge | Any agent | "This proposal was plagiarized from external source" | Layer 3 judgment market |
| Revenue attribution dispute | Any node in the chain | "Revenue was misattributed" | Data evidence + Layer 3 |

### 6.2 Dispute Filing

All disputes filed through the protocol's dispute endpoint:

```
POST /api/attribution/disputes
{
  "contribution_id": "...",
  "dispute_type": "SIMILARITY | LINEAGE | WEIGHT | NOVELTY | REVENUE",
  "filer": "agent_wallet_or_nullifier",
  "evidence": {
    "claim": "text description",
    "supporting_contribution_ids": [...],
    "external_citations": [...] // for novelty challenges
  }
}
```

Filing costs:
- Automated disputes (priority, clear duplicate): free
- Peer-escalated disputes (Layer 2 appeals): 20 credits
- Weight disputes: `min(50, 1% of disputed revenue estimate)` credits
- Novelty challenges: 100 credits

**Fee outcomes:**
- Filer wins: fees returned + loser pays filer's fees
- Filer loses: fees burned + filer reputation penalty
- Draw: fees burned, no reputation penalty

### 6.3 Why Judgment Markets for Attribution Disputes

This is the critical design choice. Attribution disputes about "is this improvement substantial?" are **exactly** the kind of subjective judgment question that Human Signal is built to resolve. Using a different mechanism would be architecturally inconsistent and miss the opportunity to dogfood the core product.

A judgment market for attribution disputes:
- Uses World ID verified humans (same anti-sybil guarantee)
- Creates economic incentives for accurate judgment (attestors stake on their position)
- Produces a transparent, auditable record of the decision
- Scales without requiring a centralized arbitration panel
- Demonstrates the product working in a real, high-stakes context

The only addition needed: **domain-specific filtering.** A dispute about biomedical annotation quality should be judged by humans with biomedical domain expertise, not by random verified humans. The dispute mechanism adds a domain expertise requirement to the attestor selection.

### 6.4 Dispute Window

All contributions have a 30-day dispute window from submission. After 30 days:
- Weight declarations are final
- Lineage claims are final
- Only novelty challenges and revenue attribution disputes remain open indefinitely

This prevents endless retroactive challenges on old, high-earning contributions.

---

## 7. Data Schemas

### 7.1 Core Contributions Table

```sql
CREATE TABLE contributions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash          TEXT NOT NULL UNIQUE,         -- SHA256 CID of normalized content
  onchain_anchor_tx     TEXT,                         -- Optional tx hash if anchored on-chain

  contributor_id        TEXT NOT NULL,                -- nullifier_hash (human) or wallet (agent)
  contributor_type      TEXT NOT NULL CHECK (contributor_type IN ('human', 'agent')),

  -- Co-contributors for collaborative submissions
  collaborators         JSONB,                        -- [{contributor_id, type, share_pct}]

  contribution_type     TEXT NOT NULL CHECK (
    contribution_type IN ('propose', 'improve', 'build', 'execute', 'maintain')
  ),

  domain                TEXT NOT NULL,                -- 'ml_annotation', 'ui_design', 'content', etc.

  title                 TEXT NOT NULL,
  description           TEXT NOT NULL,
  artifact_uri          TEXT,                         -- URI to actual artifact (code, doc, etc.)

  -- Economic
  stake_amount          DECIMAL(12,4) DEFAULT 0,      -- Credits staked at submission

  -- Similarity scores (set by automated layer)
  max_corpus_similarity DECIMAL(4,3),                 -- Highest similarity to any existing contribution
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'accepted', 'rejected', 'disputed', 'expired', 'invalidated')
  ),
  rejection_reason      TEXT,

  -- Timing
  submitted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at           TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,                  -- Attribution expiry (type-dependent)
  dispute_window_ends   TIMESTAMPTZ,                  -- submitted_at + 30 days

  -- Revenue tracking
  total_attribution_earned  DECIMAL(12,4) DEFAULT 0,  -- Running total credits earned via attribution

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contributions_contributor ON contributions(contributor_id);
CREATE INDEX idx_contributions_domain ON contributions(domain);
CREATE INDEX idx_contributions_type ON contributions(contribution_type);
CREATE INDEX idx_contributions_hash ON contributions(content_hash);
CREATE INDEX idx_contributions_status ON contributions(status);
```

### 7.2 Attribution DAG Edges

```sql
CREATE TABLE attribution_edges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  parent_id       UUID NOT NULL REFERENCES contributions(id),
  child_id        UUID NOT NULL REFERENCES contributions(id),

  edge_type       TEXT NOT NULL CHECK (
    edge_type IN ('parent_of', 'implements', 'generates')
  ),

  -- For parent_of and implements edges: what fraction of upstream allocation
  -- flows through this edge (all edges for same child must sum to 1.0)
  parent_weight   DECIMAL(5,4) NOT NULL,              -- 0.0000 to 1.0000

  -- Declared at submission; can be updated via dispute (within dispute window)
  declared_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_disputed   TIMESTAMPTZ,
  dispute_settled_weight DECIMAL(5,4),               -- Set if dispute changes the weight

  UNIQUE(parent_id, child_id, edge_type)
);

-- Validation: all parent_of + implements edges for same child must sum to 1.0
-- Enforced at application layer (complex constraint for DB)

CREATE INDEX idx_edges_parent ON attribution_edges(parent_id);
CREATE INDEX idx_edges_child ON attribution_edges(child_id);
```

### 7.3 Revenue Attribution Events

```sql
CREATE TABLE attribution_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The revenue source
  revenue_source_type TEXT NOT NULL,                   -- 'x402_payment', 'batch_api', 'market_resolution'
  revenue_tx_ref      TEXT,                            -- x402 tx hash or payment reference
  gross_amount_usdc   DECIMAL(12,6) NOT NULL,
  platform_fee_usdc   DECIMAL(12,6) NOT NULL,
  distributable_usdc  DECIMAL(12,6) NOT NULL,          -- gross - platform_fee

  -- Entry point into the DAG
  execute_node_id     UUID REFERENCES contributions(id),

  -- Attribution computation result (stored as JSONB for auditability)
  -- Format: [{contribution_id, contributor_id, amount_usdc, depth, effective_rate}]
  attribution_breakdown JSONB NOT NULL,

  distributed_at      TIMESTAMPTZ,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'distributed', 'disputed', 'refunded')
  ),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attribution_events_execute ON attribution_events(execute_node_id);
CREATE INDEX idx_attribution_events_status ON attribution_events(status);
CREATE INDEX idx_attribution_events_created ON attribution_events(created_at);
```

### 7.4 Contribution Stakes

```sql
CREATE TABLE contribution_stakes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id   UUID NOT NULL REFERENCES contributions(id),
  contributor_id    TEXT NOT NULL,

  stake_amount      DECIMAL(12,4) NOT NULL,
  staked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Outcome
  status            TEXT NOT NULL DEFAULT 'held' CHECK (
    status IN ('held', 'returned', 'burned_full', 'burned_partial')
  ),
  burned_amount     DECIMAL(12,4) DEFAULT 0,
  returned_amount   DECIMAL(12,4) DEFAULT 0,
  settled_at        TIMESTAMPTZ,
  settlement_reason TEXT                               -- 'accepted', 'rejected_duplicate', etc.
);
```

### 7.5 Disputes

```sql
CREATE TABLE attribution_disputes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  contribution_id     UUID NOT NULL REFERENCES contributions(id),
  dispute_type        TEXT NOT NULL CHECK (
    dispute_type IN (
      'priority', 'similarity', 'lineage', 'weight', 'novelty', 'revenue'
    )
  ),

  filer_id            TEXT NOT NULL,                    -- contributor who filed
  respondent_id       TEXT,                             -- contributor being challenged

  filing_fee_credits  DECIMAL(12,4) NOT NULL,

  evidence            JSONB NOT NULL,                   -- claim, supporting ids, citations

  -- Judgment market reference if escalated
  judgment_question_id UUID,                            -- references questions(id) if Layer 3

  status              TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'layer2_review', 'layer3_market', 'resolved_filer_wins',
               'resolved_respondent_wins', 'resolved_draw', 'withdrawn')
  ),

  resolution_notes    TEXT,

  filed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ,

  -- If weight was changed via dispute
  original_weight     DECIMAL(5,4),
  revised_weight      DECIMAL(5,4)
);

CREATE INDEX idx_disputes_contribution ON attribution_disputes(contribution_id);
CREATE INDEX idx_disputes_filer ON attribution_disputes(filer_id);
CREATE INDEX idx_disputes_status ON attribution_disputes(status);
```

### 7.6 Similarity Scores Cache

```sql
CREATE TABLE similarity_scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_a  UUID NOT NULL REFERENCES contributions(id),
  contribution_b  UUID NOT NULL REFERENCES contributions(id),

  embedding_sim   DECIMAL(4,3) NOT NULL,
  structural_sim  DECIMAL(4,3),
  composite_sim   DECIMAL(4,3) NOT NULL,

  computed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(contribution_a, contribution_b)
);

CREATE INDEX idx_sim_a ON similarity_scores(contribution_a);
CREATE INDEX idx_sim_b ON similarity_scores(contribution_b);
```

---

## 8. Revenue Distribution Pseudocode

### 8.1 Core Attribution Algorithm (Application Layer)

```typescript
const TYPE_BASE_WEIGHTS: Record<ContributionType, number> = {
  execute:  0.35,
  build:    0.20,
  improve:  0.12,
  propose:  0.25,
  maintain: 0.06,
};

const DEPTH_DECAY_ALPHA = 0.5;
const PLATFORM_FEE_RATE = 0.10;

function depthDecay(depth: number): number {
  return 1 / (1 + DEPTH_DECAY_ALPHA * depth);
}

function halvingMultiplier(contributionAge: number): number {
  const days = contributionAge / (1000 * 60 * 60 * 24);
  if (days < 90)  return 4.0;
  if (days < 180) return 2.0;
  if (days < 365) return 1.5;
  return 1.0;
}

interface AttributionResult {
  contributionId: string;
  contributorId: string;
  amountUsdc: number;
  depth: number;
  effectiveRate: number;
}

async function distributeRevenue(
  revenueTxRef: string,
  grossAmountUsdc: number,
  executeNodeId: string,
  db: Database
): Promise<AttributionResult[]> {

  const platformFee = grossAmountUsdc * PLATFORM_FEE_RATE;
  const distributable = grossAmountUsdc - platformFee;

  const results: AttributionResult[] = [];

  // Credit platform fee to treasury
  await creditEntity(PROTOCOL_TREASURY_ID, platformFee, 'platform_fee', db);

  // Walk the DAG
  await walkDag(executeNodeId, distributable, 0, results, db);

  // Record the attribution event
  await db.attributionEvents.create({
    revenueTxRef,
    grossAmountUsdc,
    platformFeeUsdc: platformFee,
    distributableUsdc: distributable,
    executeNodeId,
    attributionBreakdown: results,
    status: 'distributed',
    distributedAt: new Date(),
  });

  return results;
}

async function walkDag(
  nodeId: string,
  amountToDistribute: number,
  depth: number,
  results: AttributionResult[],
  db: Database
): Promise<void> {

  const contribution = await db.contributions.findById(nodeId);
  if (!contribution || contribution.status !== 'accepted') return;

  const now = Date.now();
  const contributionAge = now - contribution.submittedAt.getTime();

  const baseWeight = TYPE_BASE_WEIGHTS[contribution.contribution_type];
  const effectiveRate = baseWeight
    * depthDecay(depth)
    * halvingMultiplier(contributionAge);

  // Clamp effective rate to [0, 1]
  const clampedRate = Math.min(effectiveRate, 1.0);

  const nodeEarning = amountToDistribute * clampedRate;
  const remainder = amountToDistribute * (1 - clampedRate);

  // Handle collaborative contributions: split earning per declared shares
  if (contribution.collaborators && contribution.collaborators.length > 0) {
    // Primary contributor gets their share
    const primaryShare = contribution.collaborators.find(
      c => c.contributorId === contribution.contributorId
    )?.sharePercent ?? 1.0;

    await creditEntity(contribution.contributorId, nodeEarning * primaryShare, 'attribution', db);

    for (const collaborator of contribution.collaborators) {
      if (collaborator.contributorId !== contribution.contributorId) {
        await creditEntity(collaborator.contributorId, nodeEarning * collaborator.sharePercent, 'attribution', db);
      }
    }
  } else {
    await creditEntity(contribution.contributorId, nodeEarning, 'attribution', db);
  }

  results.push({
    contributionId: nodeId,
    contributorId: contribution.contributorId,
    amountUsdc: nodeEarning,
    depth,
    effectiveRate: clampedRate,
  });

  // Get parent edges (parent_of and implements types)
  const parentEdges = await db.attributionEdges.findParentsOf(nodeId);

  if (parentEdges.length === 0) {
    // Terminal node (root Propose or orphaned contribution)
    // Remainder goes to protocol treasury
    await creditEntity(PROTOCOL_TREASURY_ID, remainder, 'terminal_remainder', db);
    return;
  }

  // Distribute remainder to parents according to declared weights
  for (const edge of parentEdges) {
    // Use dispute-settled weight if available, otherwise declared weight
    const effectiveWeight = edge.disputeSettledWeight ?? edge.parentWeight;
    const parentShare = remainder * effectiveWeight;

    await walkDag(edge.parentId, parentShare, depth + 1, results, db);
  }
}
```

### 8.2 Fork Revenue Example

```typescript
// Setup: Proposal P has two children B1 and B2
// B1 has Execute E1; B2 has Execute E2

// When E1 generates $100 USDC:
distributeRevenue(tx1, 100, E1.id):
  platform_fee = $10
  distributable = $90

  E1 earns: $90 * 0.35 * 1.0 = $31.50
  remainder: $90 * 0.65 = $58.50

  → B1 (depth=1, decay=0.67) earns: $58.50 * 0.20 * 0.67 = $7.84
  B1 remainder: $58.50 * (1 - 0.134) = $50.66

  → P (depth=2, decay=0.50) earns: $50.66 * 0.25 * 0.50 = $6.33
  P remainder: $50.66 * (1 - 0.125) = $44.33 → treasury

// When E2 generates $200 USDC:
distributeRevenue(tx2, 200, E2.id):
  // P earns again from this separate revenue event
  // P's cumulative earnings: $6.33 (from E1) + $12.67 (from E2) = $19.00
```

### 8.3 Optional Smart Contract Path

For agents that want **trustless, non-custodial settlement** — where they don't trust the Human Signal backend to correctly distribute revenue — an optional smart contract path exists.

The contract doesn't compute attribution on-chain (too expensive for deep DAGs). Instead:

1. Human Signal backend computes attribution off-chain
2. Produces a **merkle tree** of all attribution allocations for a revenue batch
3. Publishes the merkle root on-chain (minimal gas cost)
4. Agents can **claim their allocation** by submitting a merkle proof on-chain
5. The contract verifies the proof and releases USDC to the agent's wallet

```solidity
// Simplified — not production-ready
contract AttributionClaims {
    IERC20 public usdc;
    address public operator;

    // batchId => merkle root of attribution allocations
    mapping(uint256 => bytes32) public batchRoots;

    // batchId => contributorAddress => claimed
    mapping(uint256 => mapping(address => bool)) public claimed;

    function publishBatch(uint256 batchId, bytes32 merkleRoot)
        external onlyOperator {
        batchRoots[batchId] = merkleRoot;
    }

    function claimAllocation(
        uint256 batchId,
        address contributor,
        uint256 amountUsdc,
        bytes32[] calldata proof
    ) external {
        require(!claimed[batchId][contributor], "Already claimed");
        require(batchRoots[batchId] != bytes32(0), "Batch not published");

        // Verify merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(batchId, contributor, amountUsdc));
        require(MerkleProof.verify(proof, batchRoots[batchId], leaf), "Invalid proof");

        claimed[batchId][contributor] = true;
        usdc.transfer(contributor, amountUsdc);

        emit AllocationClaimed(batchId, contributor, amountUsdc);
    }

    event AllocationClaimed(uint256 indexed batchId, address indexed contributor, uint256 amount);
}
```

**When to use the smart contract path:**
- Contributors earning > $1,000/month in attribution (smart enough to verify on-chain)
- High-value contributions where trust in the operator's computation matters
- When the contributor is an agent running autonomously without human oversight

**When to use the off-chain path:**
- All MVP and early-growth contributors
- Low-value attribution (gas cost > attribution value)
- When the contributor trusts the operator (most users)

The smart contract is optional infrastructure, not required for the protocol to function. This is consistent with the protocol architecture doc's recommendation: credits are a database ledger, not on-chain, with optional on-chain settlement for those who want it.

---

## 9. Precedent Analysis

### 9.1 Git

**What it solves:** Who changed what, when, in what order.

**Key lessons:**
- **Content-addressed commits:** Every commit is identified by the hash of its content, not by a mutable ID. This is what makes git's history tamper-evident. Human Signal uses the same approach (SHA256 CID).
- **First commit is authority:** There's no mechanism to retroactively claim prior authorship. The timestamp on the commit object IS the claim. Human Signal adopts this entirely.
- **Diffs are explicit:** You can't claim credit for a change without showing the change. Human Signal's similarity scoring is the equivalent — the diff must be substantive.
- **Branching is first-class:** Forks are not exceptions; they're the normal mode of development. Human Signal's DAG model treats forks the same way.

**Where it fails for Human Signal:**
- No economic attribution: git tracks what changed, not who gets paid for it.
- No quality gate on contributions: any commit is valid regardless of whether it's useful.
- No similarity detection: you CAN commit something that's essentially a copy of another repo, git won't care.

**Design lessons adopted:**
- Content-addressed contribution IDs
- First-to-register authority
- Fork-as-first-class-citizen in the DAG

---

### 9.2 Patent Law

**What it solves:** Priority, disclosure, and the obviousness threshold.

**Key lessons:**
- **First to file (modern US and international):** Who thought of it first doesn't matter. Who filed first does. This is operationally tractable; "who really invented it" is not. Human Signal adopts this for Propose submissions.
- **Disclosure required:** You must show your work to claim protection. A patent application includes enough detail that a skilled practitioner could reproduce the invention. Human Signal requires artifact URIs and descriptions sufficient for quality gate review.
- **Obviousness doctrine:** Something "obvious to a person of ordinary skill in the art" doesn't get patent protection. This is the "trivial improvement" problem. Human Signal's similarity threshold + quality gates operationalize a version of this.
- **Prior art invalidates claims:** An existing invention can invalidate a patent. Human Signal's corpus similarity check + novelty challenge mechanism is the equivalent.

**Where it fails for Human Signal:**
- Extremely expensive to enforce (legal system, not protocol).
- Centralized adjudication (patent office, courts).
- Binary (you either have the patent or you don't) — doesn't handle partial attribution.
- 20-year protection window is too long; Human Signal's expiry model is shorter and tiered.

**Design lessons adopted:**
- First-to-file for Propose
- Disclosure requirement (artifact URI + description)
- Obviousness threshold (similarity scoring as the operational proxy)
- Novelty challenge mechanism (equivalent to prior art challenge)

---

### 9.3 DAO Contribution (Coordinape / SourceCred)

**What they solve:** How to value contributions in open communities without centralized management.

**SourceCred:**
- **PageRank-style flow:** Contributions that are "cited" (built upon) by other high-value contributions earn more. Not just "who did the most" but "whose work enabled other valuable work."
- **Flow-through attribution:** This is the key insight. A foundational contribution earns from everything downstream, proportionally. Human Signal's DAG attribution model is directly inspired by this.
- **Automatic computation:** No human needs to vote on individual contributions. The graph structure IS the attribution.

**Coordinape:**
- **Peer allocation:** Contributors vote credits toward each other. More democratic but highly gameable (coordination attacks, reciprocal voting rings).
- **Lesson for Human Signal:** Peer allocation without economic stakes is too gameable. Human Signal's peer review (Layer 2) is structured differently — reviewers earn modest fixed credits for honest participation, not variable credits based on outcomes.

**Where both fail:**
- Neither handles revenue attribution (they're for grants/tokens, not revenue sharing).
- SourceCred's graph can be gamed by creating many interdependent contributions that cite each other.
- Coordinape is easily captured by social cliques.

**Design lessons adopted:**
- Flow-through attribution (SourceCred's core insight)
- Ancestor earnings from downstream success
- Rejected: pure peer allocation without structure/stakes

---

### 9.4 Academic Citation

**What it solves:** Intellectual lineage, provenance, and reputational attribution.

**Key lessons:**
- **Citation chain IS the lineage record:** If you build on someone's work, you cite them. The citation is a public declaration of lineage. Human Signal's parent_id declaration is the equivalent.
- **Peer review as quality gate:** The quality of contributions is assessed by domain experts before they enter the canon. This is Layer 2/3 in Human Signal.
- **h-index as impact proxy:** Not just "how many papers" but "how many papers that are themselves highly cited." This is the recursive quality metric. SourceCred and Human Signal's depth decay both encode this intuition.
- **Retractions are possible:** A published paper can be retracted if it's found to be fraudulent. Human Signal's invalidation mechanism (for fraudulent proposals) is analogous.

**Where it fails for Human Signal:**
- No economic value flows through citations. Prestige doesn't pay rent. This is the entire problem Human Signal solves.
- Peer review is slow (months). Human Signal needs hours to days.
- Academic citation is community-enforced norms, not protocol-level enforcement. Human Signal enforces attribution programmatically.
- Self-citation is gameable (academics inflate h-index by citing their own work). Human Signal's automated layer catches circular attribution.

**Design lessons adopted:**
- Declaration of lineage as a first-class requirement
- Peer review for quality validation
- Recursive impact (ancestors earn from descendants)
- Invalidation mechanism for fraudulent contributions

---

### 9.5 Synthesis: What Human Signal Borrows From Each

| System | Mechanism Borrowed | How It's Used |
|--------|-------------------|---------------|
| **Git** | Content-addressed IDs, first-to-register, branching as first-class | CID for contributions, first-to-submit authority, fork/merge DAG |
| **Patent law** | First-to-file, disclosure requirement, obviousness threshold, prior art challenge | First-to-register for Propose, artifact URI required, similarity threshold, novelty challenge |
| **SourceCred** | Flow-through attribution from ancestors | Proposal ancestors earn from all downstream revenue in their subtree |
| **Academic citation** | Declaration of lineage, peer review quality gate, recursive impact | parent_id requirement, Layer 2/3 quality gates, depth decay attribution |

**What none of them do that Human Signal needs:**
- Economic stakes on contribution claims (anti-gaming via skin in the game)
- Dynamic pricing of attribution based on contribution recency (halving schedule)
- Dispute resolution via the same mechanism the platform uses for its core product (dogfooding)
- Automatic revenue distribution through a programmatic DAG (not just recording who contributed — actually paying them)

---

## 10. On-Chain vs. Off-Chain Architecture

### Recommendation

| Layer | Storage | Rationale |
|-------|---------|-----------|
| Contribution records | **Off-chain (Postgres)** | High write volume, complex queries, no gas cost |
| Content hash CIDs | **Off-chain (Postgres), optional on-chain anchor** | On-chain anchor is optional integrity proof; not required |
| Attribution edge weights | **Off-chain (Postgres)** | Subject to dispute updates; mutable until dispute window closes |
| Revenue events (x402 payments) | **On-chain (Base)** | Payments already on-chain via x402; this is the ground truth for revenue |
| Attribution distributions | **Off-chain (Postgres)** | Computed from on-chain revenue; stored as audit trail |
| Attribution claims (smart contract) | **On-chain (optional)** | For high-value contributors wanting trustless settlement |
| Dispute outcomes | **Off-chain (Postgres), on-chain final settlement** | Off-chain for speed; on-chain stamp for permanent record of contested disputes |

### Why Not Fully On-Chain

Three reasons:

1. **Cost:** Storing attribution records on-chain would cost $0.001–$0.01 per contribution in gas. At 10,000 contributions/day, that's $3,650–$36,500/year in gas costs alone, paid by the platform. The same data stored in Postgres costs cents/month.

2. **Complexity:** DAG traversal during revenue distribution would require either very expensive on-chain computation or complex off-chain/on-chain hybrid patterns. The merkle-claim pattern (Section 8.3) achieves the same trustlessness at a fraction of the cost.

3. **Speed:** On-chain writes take seconds to minutes. Human Signal attribution events should settle in milliseconds. Payment flows at RLHF scale (thousands of attestations per hour) can't wait for block confirmation.

### Why Some Things Should Go On-Chain

1. **Revenue source (x402 payments):** Already on-chain. This is the ground truth. The attribution system anchors to on-chain payment records.

2. **Content hash anchoring:** Optional but valuable for high-stakes contributions. An on-chain timestamp of a contribution hash is immutable, public proof of "I submitted this at this time." Not required for the protocol but useful for disputes involving external claims.

3. **Final attribution claims:** The smart contract claim mechanism (Section 8.3) lets contributors verify their earnings without trusting the operator. Important as the protocol grows and contributors become more sophisticated.

The architecture is designed so each layer can be progressively moved on-chain as trust requirements increase — without requiring a rewrite. Off-chain first, on-chain when needed. Same principle as the credit system in the protocol architecture doc.

---

## 11. Summary: The Attribution Protocol in One Page

**What it tracks:** Who proposed what, who improved what, who built what, who executed what, and who maintains what — with content-addressed integrity and cryptographic timestamps.

**How it prevents gaming:**
- Trivial improvements auto-rejected via similarity scoring
- Economic stakes burned on rejected contributions
- First-to-register authority eliminates retroactive priority claims
- Judgment markets for disputes make false claims expensive

**How revenue flows:**
- DAG traversal from revenue event backward through the contribution chain
- Each node takes its type-weighted share, passes remainder upstream
- Depth decay and halving schedule reward early, foundational contributions
- Forks earn from all successful branches; merges split upstream proportionally

**How disputes resolve:**
- Small disputes: automated rejection with appeal
- Medium disputes: peer review (Layer 2)
- Large disputes: judgment market (Layer 3) — dogfooding the core product
- Loser pays filer's fees; repeat offenders face reputation penalties

**On-chain vs. off-chain:**
- Contribution records: Postgres (fast, cheap, queryable)
- Revenue source: on-chain via x402 (already there)
- Optional smart contract: merkle-claim pattern for trustless settlement

**What it borrows:**
- From git: first-to-register, content addressing, forks as first-class
- From patents: disclosure requirement, obviousness threshold, novelty challenge
- From SourceCred: flow-through attribution (ancestors earn from descendants)
- From academic: peer review quality gates, lineage declaration requirements

**What's new:**
- Economic stakes that make gaming uneconomic
- Judgment markets for dispute resolution (same mechanism as core product)
- Halving schedule for early-contributor premium
- Optional smart contract settlement for trustless verification
