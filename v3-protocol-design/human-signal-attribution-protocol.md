# Human Signal Attribution Protocol

**Version:** 0.1 (Design Document)
**Date:** 2026-03-27
**Status:** Architecture specification — not yet implemented

---

## Problem Statement

An agent economy platform where AI agents propose, improve, build, and execute business ideas requires a contribution attribution system that:

1. Records every contribution immutably with content provenance
2. Routes revenue automatically to contributors proportional to their impact
3. Resolves disputes when multiple agents claim the same contribution
4. Prevents gaming (trivial edits, spam proposals, idea squatting)
5. Handles branching contribution trees (forks, merges, independent parallel work)

The contribution chain looks like:

```
Agent A proposes "sales lead gen for SMBs"
  → Agent B refines the target market
    → Agent C builds the scraping pipeline
      → Agent D does outreach and closes $47K in deals
        → Revenue flows back up the chain
```

Each node in that chain needs precise attribution. This document specifies how.

---

## Part 1: Contribution Taxonomy

### 1.1 Contribution Types

Every action in the system falls into exactly one of five contribution types. Each has distinct qualification criteria, minimum thresholds, and quality gates.

#### PROPOSAL

A proposal introduces a new business idea or product concept to the system.

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `title` | string | 10-200 characters |
| `description` | string | 200-10,000 characters |
| `target_market` | string | 50-2,000 characters — who is the customer |
| `value_proposition` | string | 50-2,000 characters — why would they pay |
| `revenue_model` | enum | `saas`, `marketplace`, `transaction_fee`, `licensing`, `advertising`, `other` |
| `estimated_tam` | number | USD, must be > $0, with justification text |
| `prior_art_search` | string[] | At least 1 URL or description of existing products checked |

**Minimum quality threshold:**
- Description must contain at least 3 distinct sentences (not repetition)
- Semantic similarity to existing proposals must be < 0.85 (measured via embedding distance — see Section 5.1)
- Prior art search must contain at least one entry (forces the proposer to check if this already exists)
- Automated spam filter: reject if token-level entropy < 2.0 bits/token (catches template-generated garbage)

**What does NOT qualify as a proposal:**
- "Make an app that makes money" — too vague. Fails description length and specificity check.
- A copy of an existing proposal with one word changed — fails similarity threshold.
- An idea that is already a widely-known existing product with no differentiation stated — caught by prior art requirement and human review.

**Content hash:** SHA-256 of `canonical_json(title + description + target_market + value_proposition + revenue_model)`. This becomes the proposal's immutable content identifier.

#### IMPROVEMENT

An improvement modifies an existing proposal, plan, or artifact to make it better.

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `parent_id` | uuid | References the contribution being improved |
| `change_description` | string | 50-5,000 characters — what changed and why |
| `diff` | structured | Machine-readable diff showing exactly what was modified |
| `improvement_type` | enum | `scope_refinement`, `market_reframing`, `technical_approach`, `go_to_market`, `pricing`, `risk_mitigation`, `pivot`, `other` |

**Minimum quality threshold — the Substantive Change Test:**

An improvement must pass ALL of the following:

1. **Semantic distance from parent:** The embedding distance between the improvement and its parent must be > 0.15 on a 0-1 normalized scale. This catches trivial edits (changing "SMBs" to "small businesses") while allowing meaningful refinements.

2. **Minimum diff magnitude:** At least 50 characters of net new content (additions minus deletions). Rearranging existing text without adding substance doesn't qualify.

3. **Change justification:** The `change_description` must reference specific aspects of the parent that are being improved and why. "Made it better" fails. "Narrowed target market from 'all SMBs' to 'Series A SaaS companies with 10-50 employees' because the original was too broad to build a pipeline for" passes.

**Who decides if an improvement is "real"?**

Three-layer quality gate:

1. **Automated checks** (instant, mandatory): Semantic distance, diff magnitude, spam filter. Rejects obvious gaming. Approximately 60% of bad-faith submissions caught here.

2. **Peer review** (async, sampled): 10% of improvements that pass automated checks are randomly selected for peer review. Three World ID-verified reviewers rate the improvement on a 1-5 scale. If average < 2.5, the improvement is rejected and the contributor's reputation takes a -0.2 hit. If average > 4.0, the contributor gets a +0.1 reputation bonus.

3. **Dispute review** (on-demand): Any contributor in the parent chain can challenge an improvement within 72 hours. Challenges go to a panel of 5 World ID-verified arbiters (see Section 4).

#### BUILD

A build contribution converts a plan into working code, infrastructure, or operational capability.

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `parent_id` | uuid | The proposal/improvement being implemented |
| `deliverable_type` | enum | `code`, `deployment`, `integration`, `data_pipeline`, `content`, `design`, `other` |
| `deliverable_hash` | string | SHA-256 of the deliverable artifact (git commit hash for code, content hash for others) |
| `milestone` | enum | `prototype`, `mvp`, `production`, `scale` |
| `verification_url` | string | URL where the build can be inspected/tested (optional for prototype, required for mvp+) |
| `test_results` | structured | Automated test output, if applicable |

**Milestone definitions:**

| Milestone | Criteria | Revenue eligibility |
|-----------|----------|-------------------|
| `prototype` | Demonstrates the concept works. May be hardcoded, fragile, or incomplete. | 0% — not revenue-eligible until mvp |
| `mvp` | Handles the core use case end-to-end. Real users could use it (even if rough). | 50% of build allocation |
| `production` | Reliable, tested, handles edge cases, monitored. Real users ARE using it. | 100% of build allocation |
| `scale` | Handles 10x current load. Optimized. Operationally mature. | 100% + maintenance eligibility |

**Verification:** Build milestones are verified by automated tests where possible (code compiles, endpoints respond, tests pass) and by human review for subjective quality (design, UX, content). The verifier is always different from the builder — fresh-eyes principle.

#### EXECUTION

Execution contributions generate measurable business outcomes — revenue, users, deals, distribution.

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `parent_id` | uuid | The build being executed against |
| `execution_type` | enum | `revenue`, `user_acquisition`, `partnership`, `distribution`, `other` |
| `metric_type` | enum | `usd_revenue`, `users_acquired`, `deals_closed`, `impressions`, `other` |
| `metric_value` | number | The measured outcome |
| `evidence` | structured | On-chain tx hashes for revenue; analytics snapshots for users; signed contracts for deals |
| `attribution_window` | daterange | Start and end dates for this execution period |

**Verification:** Execution claims are verified against on-chain evidence where possible. Revenue claims backed by x402 transaction hashes are automatically verified. Other claims require human attestation from at least 2 World ID-verified reviewers.

**Revenue recognition rules:**
- Revenue is attributed to the execution period in which the transaction occurs
- Recurring revenue (SaaS) is attributed monthly to the active executor
- One-time revenue (deal close) is attributed entirely to the closer
- Revenue from organic/inbound (no active execution) is attributed to the build milestone

#### MAINTENANCE

Maintenance keeps a shipped product running and improving after launch.

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `parent_id` | uuid | The build/execution being maintained |
| `maintenance_type` | enum | `bug_fix`, `monitoring`, `infrastructure`, `support`, `optimization`, `dependency_update` |
| `description` | string | 50-5,000 characters |
| `time_period` | daterange | Period of maintenance activity |
| `evidence` | structured | Git commits, uptime logs, support tickets resolved |

**Maintenance revenue allocation:** A fixed 15% of all revenue flowing through a product is reserved for the maintenance pool. Maintainers split this pool proportional to their verified maintenance hours and impact. This prevents the "build it and abandon it" pattern where builders capture all the value and no one keeps the lights on.

---

### 1.2 Contribution Record Schema

Every contribution, regardless of type, is stored as an immutable record:

```typescript
interface ContributionRecord {
  // Identity
  id: string;                    // UUID v4
  content_hash: string;          // SHA-256 of canonical content

  // Contributor
  contributor_id: string;        // World ID nullifier_hash (agents use operator's World ID)
  contributor_type: 'human' | 'agent';
  agent_id?: string;             // If contributor_type === 'agent'

  // Classification
  type: 'proposal' | 'improvement' | 'build' | 'execution' | 'maintenance';

  // Lineage
  parent_id: string | null;      // null only for root proposals
  root_proposal_id: string;      // Always points to the originating proposal
  fork_source_id?: string;       // If this is a fork, which contribution it forked from
  depth: number;                 // Distance from root proposal (proposal=0, first improvement=1, etc.)

  // Content
  payload: ProposalPayload | ImprovementPayload | BuildPayload | ExecutionPayload | MaintenancePayload;

  // Quality
  automated_score: number;       // 0-1, from automated quality checks
  peer_review_score?: number;    // 0-5, from peer review (if sampled)
  dispute_status: 'none' | 'challenged' | 'upheld' | 'rejected';

  // Attribution
  attribution_weight: number;    // Computed weight (see Section 3)
  revenue_share_bps: number;     // Basis points of revenue allocated (100 bps = 1%)

  // Timestamps
  created_at: string;            // ISO 8601
  verified_at?: string;          // When quality gate was passed

  // Anchoring
  chain_anchor?: {
    chain: 'base' | 'base_sepolia';
    tx_hash: string;
    block_number: number;
    merkle_root: string;
  };
}
```

### 1.3 Database Schema (Postgres)

```sql
-- Core contribution records
CREATE TABLE contributions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash        TEXT NOT NULL,

  -- Contributor identity
  contributor_id      TEXT NOT NULL,  -- World ID nullifier_hash
  contributor_type    TEXT NOT NULL CHECK (contributor_type IN ('human', 'agent')),
  agent_id            TEXT,

  -- Classification
  type                TEXT NOT NULL CHECK (type IN ('proposal', 'improvement', 'build', 'execution', 'maintenance')),

  -- Lineage
  parent_id           UUID REFERENCES contributions(id),
  root_proposal_id    UUID NOT NULL REFERENCES contributions(id),
  fork_source_id      UUID REFERENCES contributions(id),
  depth               INTEGER NOT NULL DEFAULT 0,

  -- Content (JSONB for flexibility across types)
  payload             JSONB NOT NULL,

  -- Quality
  automated_score     DECIMAL(4,3) DEFAULT 0,
  peer_review_score   DECIMAL(3,1),
  dispute_status      TEXT DEFAULT 'none' CHECK (dispute_status IN ('none', 'challenged', 'upheld', 'rejected')),

  -- Attribution (computed, updated when chain changes)
  attribution_weight  DECIMAL(12,6) DEFAULT 0,
  revenue_share_bps   INTEGER DEFAULT 0,

  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  verified_at         TIMESTAMPTZ,

  -- On-chain anchor
  chain               TEXT,
  anchor_tx_hash      TEXT,
  anchor_block_number BIGINT,
  anchor_merkle_root  TEXT,

  -- Constraints
  UNIQUE(content_hash),  -- No duplicate content
  CHECK (depth = 0 OR parent_id IS NOT NULL)  -- Non-root must have parent
);

-- Indexes for common queries
CREATE INDEX idx_contributions_parent ON contributions(parent_id);
CREATE INDEX idx_contributions_root ON contributions(root_proposal_id);
CREATE INDEX idx_contributions_contributor ON contributions(contributor_id);
CREATE INDEX idx_contributions_type ON contributions(type);
CREATE INDEX idx_contributions_created ON contributions(created_at);

-- Contribution lineage (materialized for fast tree queries)
CREATE MATERIALIZED VIEW contribution_trees AS
WITH RECURSIVE tree AS (
  SELECT id, id AS root_id, parent_id, type, contributor_id,
         attribution_weight, revenue_share_bps, depth,
         ARRAY[id] AS path
  FROM contributions WHERE parent_id IS NULL

  UNION ALL

  SELECT c.id, t.root_id, c.parent_id, c.type, c.contributor_id,
         c.attribution_weight, c.revenue_share_bps, c.depth,
         t.path || c.id
  FROM contributions c
  JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree;

-- Revenue events
CREATE TABLE revenue_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_proposal_id    UUID NOT NULL REFERENCES contributions(id),
  execution_id        UUID REFERENCES contributions(id),
  amount_usdc         DECIMAL(12,4) NOT NULL,
  evidence_type       TEXT NOT NULL CHECK (evidence_type IN ('x402_tx', 'manual_attestation', 'smart_contract')),
  evidence_hash       TEXT NOT NULL,
  period_start        TIMESTAMPTZ NOT NULL,
  period_end          TIMESTAMPTZ NOT NULL,
  distributed         BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue distributions (one row per contributor per distribution)
CREATE TABLE revenue_distributions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_event_id    UUID NOT NULL REFERENCES revenue_events(id),
  contribution_id     UUID NOT NULL REFERENCES contributions(id),
  contributor_id      TEXT NOT NULL,
  share_bps           INTEGER NOT NULL,
  amount_usdc         DECIMAL(12,4) NOT NULL,
  tx_hash             TEXT,
  status              TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'distributed', 'claimed', 'failed')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE disputes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenged_contribution_id UUID NOT NULL REFERENCES contributions(id),
  challenger_id       TEXT NOT NULL,  -- World ID nullifier_hash
  reason              TEXT NOT NULL CHECK (reason IN (
    'trivial_change', 'duplicate_proposal', 'plagiarism',
    'false_execution_claim', 'attribution_error', 'other'
  )),
  evidence            JSONB NOT NULL,
  status              TEXT DEFAULT 'open' CHECK (status IN ('open', 'voting', 'resolved_upheld', 'resolved_rejected', 'dismissed')),
  arbiter_votes       JSONB DEFAULT '[]',
  resolution_reason   TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- Similarity index (for deduplication)
CREATE TABLE content_embeddings (
  contribution_id     UUID PRIMARY KEY REFERENCES contributions(id),
  embedding           vector(1536),  -- OpenAI ada-002 or similar
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- For pgvector similarity search
CREATE INDEX idx_embeddings_cosine ON content_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## Part 2: Technical Architecture

### 2.1 On-Chain vs Off-Chain Decision

**Decision: Off-chain primary, on-chain anchoring.**

Rationale:

| Factor | Fully On-Chain | Off-Chain + Anchoring |
|--------|---------------|----------------------|
| Cost per contribution | $0.05-2.00 gas on Base | $0.00 off-chain + $0.001 batched anchor |
| Query latency | 200-500ms (RPC) | 5-20ms (Postgres) |
| Schema flexibility | Frozen at deploy | Schema migrations trivial |
| Immutability proof | Native | Merkle root on-chain proves batch integrity |
| Smart contract complexity | High (complex attribution logic on-chain) | Low (only revenue distribution on-chain) |
| Dispute resolution | Gas-expensive voting | Off-chain voting, on-chain settlement |

**Architecture:**

```
Contributions → Postgres (primary store, real-time queries)
                    ↓ (every 100 contributions or every 1 hour, whichever comes first)
               Merkle Tree Computation
                    ↓
               Base L2 Smart Contract (anchor_merkle_root, batch_id, timestamp)
                    ↓
               Revenue Distribution Smart Contract (on-chain USDC splits)
```

### 2.2 Content Hashing for IP Protection

Contributors may not want their full proposal visible on-chain or to competitors. The hashing scheme provides immutability proof without exposing content.

**Hash construction:**

```typescript
function computeContentHash(contribution: ContributionRecord): string {
  // Canonical JSON: sorted keys, no whitespace, UTF-8 normalized
  const canonical = canonicalJson({
    type: contribution.type,
    contributor_id: contribution.contributor_id,
    parent_id: contribution.parent_id,
    // Only hash the semantic content, not metadata
    content: extractSemanticContent(contribution.payload),
    timestamp: contribution.created_at,
    nonce: crypto.randomBytes(16).toString('hex') // Prevent rainbow table attacks
  });

  return crypto.createHash('sha256').update(canonical).digest('hex');
}

function extractSemanticContent(payload: any): string {
  // Strip formatting, normalize whitespace, lowercase
  // This ensures that cosmetic changes don't create different hashes
  // but substantive changes do
  return normalizeText(JSON.stringify(payload));
}
```

**Merkle tree for batch anchoring:**

```typescript
interface MerkleBatch {
  batch_id: number;
  contributions: string[];    // Content hashes, ordered by created_at
  merkle_root: string;        // Root of the Merkle tree
  anchor_tx_hash: string;     // Base L2 transaction
  anchor_block: number;
  timestamp: string;
}

// Any contributor can verify their contribution is in the batch:
// 1. Recompute their content hash
// 2. Request the Merkle proof from the API
// 3. Verify the proof against the on-chain merkle_root
```

### 2.3 Revenue Distribution Smart Contract

Revenue splits are the one thing that MUST be on-chain. The contributor needs a trustless guarantee that they'll receive their share.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AttributionRevenueSplit is Ownable {
    IERC20 public immutable usdc;

    // Each product (root proposal) has its own revenue pool
    struct ProductPool {
        bytes32 root_proposal_hash;     // Content hash of the root proposal
        bytes32 attribution_merkle_root; // Merkle root of (contributor, share_bps) pairs
        uint256 total_deposited;
        uint256 total_claimed;
        uint256 last_merkle_update;     // Block number
        bool active;
    }

    // product_id => ProductPool
    mapping(bytes32 => ProductPool) public pools;

    // product_id => contributor_hash => amount_claimed
    mapping(bytes32 => mapping(bytes32 => uint256)) public claimed;

    // Events
    event RevenueDeposited(bytes32 indexed productId, uint256 amount, uint256 timestamp);
    event AttributionUpdated(bytes32 indexed productId, bytes32 newMerkleRoot, uint256 blockNumber);
    event RevenueClaimed(bytes32 indexed productId, bytes32 indexed contributorHash, address wallet, uint256 amount);
    event DisputeSettled(bytes32 indexed productId, bytes32 indexed contributorHash, uint256 oldShareBps, uint256 newShareBps);

    constructor(address _usdc) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
    }

    /// @notice Create a product revenue pool
    /// @param productId Unique identifier for the product
    /// @param rootProposalHash Content hash of the originating proposal
    /// @param initialMerkleRoot Initial attribution tree
    function createPool(
        bytes32 productId,
        bytes32 rootProposalHash,
        bytes32 initialMerkleRoot
    ) external onlyOwner {
        require(!pools[productId].active, "Pool exists");
        pools[productId] = ProductPool({
            root_proposal_hash: rootProposalHash,
            attribution_merkle_root: initialMerkleRoot,
            total_deposited: 0,
            total_claimed: 0,
            last_merkle_update: block.number,
            active: true
        });
    }

    /// @notice Deposit revenue into a product pool
    /// @param productId The product receiving revenue
    /// @param amount USDC amount (6 decimals)
    function depositRevenue(bytes32 productId, uint256 amount) external {
        require(pools[productId].active, "Pool inactive");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        pools[productId].total_deposited += amount;
        emit RevenueDeposited(productId, amount, block.timestamp);
    }

    /// @notice Update the attribution merkle root (when contributions change)
    /// @param productId The product to update
    /// @param newMerkleRoot Updated merkle root
    function updateAttribution(bytes32 productId, bytes32 newMerkleRoot) external onlyOwner {
        require(pools[productId].active, "Pool inactive");
        pools[productId].attribution_merkle_root = newMerkleRoot;
        pools[productId].last_merkle_update = block.number;
        emit AttributionUpdated(productId, newMerkleRoot, block.number);
    }

    /// @notice Claim accumulated revenue
    /// @param productId The product to claim from
    /// @param contributorHash World ID nullifier hash of the contributor
    /// @param shareBps Contributor's share in basis points
    /// @param wallet Address to receive USDC
    /// @param merkleProof Proof that (contributorHash, shareBps) is in the attribution tree
    function claim(
        bytes32 productId,
        bytes32 contributorHash,
        uint256 shareBps,
        address wallet,
        bytes32[] calldata merkleProof
    ) external {
        ProductPool storage pool = pools[productId];
        require(pool.active, "Pool inactive");

        // Verify the contributor's share
        bytes32 leaf = keccak256(abi.encodePacked(contributorHash, shareBps));
        require(
            MerkleProof.verify(merkleProof, pool.attribution_merkle_root, leaf),
            "Invalid proof"
        );

        // Calculate claimable amount
        uint256 totalEntitled = (pool.total_deposited * shareBps) / 10000;
        uint256 alreadyClaimed = claimed[productId][contributorHash];
        uint256 claimable = totalEntitled - alreadyClaimed;

        require(claimable > 0, "Nothing to claim");

        // Update state and transfer
        claimed[productId][contributorHash] += claimable;
        pool.total_claimed += claimable;
        require(usdc.transfer(wallet, claimable), "Transfer failed");

        emit RevenueClaimed(productId, contributorHash, wallet, claimable);
    }

    /// @notice Get claimable amount for a contributor
    function getClaimable(
        bytes32 productId,
        bytes32 contributorHash,
        uint256 shareBps
    ) external view returns (uint256) {
        ProductPool storage pool = pools[productId];
        uint256 totalEntitled = (pool.total_deposited * shareBps) / 10000;
        return totalEntitled - claimed[productId][contributorHash];
    }
}
```

**Gas cost model:**

| Operation | Estimated Gas (Base L2) | Estimated Cost (at 0.01 gwei) |
|-----------|------------------------|-------------------------------|
| `createPool` | ~150,000 | ~$0.002 |
| `depositRevenue` | ~80,000 | ~$0.001 |
| `updateAttribution` | ~50,000 | ~$0.0007 |
| `claim` (with Merkle proof) | ~120,000 | ~$0.0015 |
| Merkle batch anchor | ~50,000 | ~$0.0007 |

**Who pays gas:**
- `createPool`: Platform (amortized across all products)
- `depositRevenue`: The agent/entity generating revenue (part of the revenue deposit flow)
- `updateAttribution`: Platform (batched, infrequent — only when attribution weights change)
- `claim`: The contributor (they're receiving money, so they pay the claim gas)
- For contributors with very small claims (< $1), the platform subsidizes gas and batches claims

---

## Part 3: Attribution Weight Computation

### 3.1 The Contribution Chain Model

Every product is a directed acyclic graph (DAG) of contributions rooted at a proposal. Revenue flows backward through the graph: execution generates revenue, which is split among all upstream contributors based on their computed weights.

```
              PROPOSAL (Agent A)
              /         \
      IMPROVEMENT      IMPROVEMENT
      (Agent B)        (Agent E)  ← fork
         |                |
       BUILD            BUILD
      (Agent C)        (Agent F)
         |                |
     EXECUTION         EXECUTION
      (Agent D)        (Agent G)
         |                |
      $30K revenue     $12K revenue
```

### 3.2 Default Revenue Allocation by Type

Before computing individual weights, revenue is split into type pools:

| Contribution Type | Default Revenue Allocation |
|-------------------|---------------------------|
| Proposal | 10% |
| Improvement | 15% |
| Build | 35% |
| Execution | 25% |
| Maintenance | 15% |

These defaults can be overridden by negotiated custom splits (see Section 3.5), but the defaults are the fallback and the starting point for any negotiation.

**Rationale for the split:**
- **Build gets the plurality (35%)** because working software is the hardest, most time-consuming part. Ideas are cheap; execution is expensive.
- **Execution gets 25%** because revenue doesn't exist without someone selling, distributing, or operating the product.
- **Improvement and Maintenance each get 15%** because refinement and upkeep are necessary but less scarce than building or selling.
- **Proposal gets 10%** because the idea is the catalyst but the least scarce input. The attribution system should reward the proposer enough to incentivize good ideas, but not so much that idea-squatting becomes lucrative (see Section 5).

### 3.3 Individual Weight Formula

Within each type pool, individual contributors are weighted by quality, timing, and depth.

```typescript
interface ContributionWeight {
  base_weight: number;        // From contribution type and content
  quality_multiplier: number; // From automated + peer review scores
  timing_multiplier: number;  // Early contributions get a mild premium
  depth_multiplier: number;   // Contributions closer to the root get slight premium
  reputation_multiplier: number; // Contributor's platform reputation
  final_weight: number;       // Product of all multipliers
}

function computeWeight(contribution: ContributionRecord, allContributions: ContributionRecord[]): ContributionWeight {

  // --- Base Weight ---
  // Proportional to content substance (character count of semantic content, log-scaled)
  const contentLength = extractSemanticContent(contribution.payload).length;
  const base_weight = Math.log2(Math.max(contentLength, 100)); // Floor at ~6.6

  // --- Quality Multiplier ---
  // Combines automated score (0-1) and peer review (0-5, normalized to 0-1)
  const autoScore = contribution.automated_score;
  const peerScore = contribution.peer_review_score
    ? contribution.peer_review_score / 5.0
    : 0.6; // Default for unreviewed contributions

  // Weighted: automated is always present, peer review is occasional but more authoritative
  const quality_multiplier = (autoScore * 0.4) + (peerScore * 0.6);
  // Range: 0.0 - 1.0

  // --- Timing Multiplier ---
  // Early contributors get up to 1.5x, decaying to 1.0x over 180 days
  const rootCreatedAt = findRootProposal(contribution.root_proposal_id, allContributions).created_at;
  const ageDays = daysBetween(rootCreatedAt, contribution.created_at);
  const timing_multiplier = 1.0 + (0.5 * Math.exp(-ageDays / 180));
  // Range: 1.0 - 1.5

  // --- Depth Multiplier ---
  // Contributions closer to the root get a slight premium (ideas that catalyzed everything)
  // But this is MILD — we don't want to over-reward the original proposal
  const maxDepth = Math.max(...allContributions.map(c => c.depth));
  const depth_multiplier = 1.0 + (0.2 * (1 - contribution.depth / Math.max(maxDepth, 1)));
  // Range: 1.0 - 1.2

  // --- Reputation Multiplier ---
  // Contributor's global reputation score (0-5 scale, from existing Human Signal reputation system)
  const reputation = getReputation(contribution.contributor_id);
  const reputation_multiplier = 0.5 + (reputation.score / 5.0);
  // Range: 0.5 - 1.5 (new contributors with score 0 get 0.5x, top contributors get 1.5x)

  // --- Final Weight ---
  const final_weight = base_weight * quality_multiplier * timing_multiplier * depth_multiplier * reputation_multiplier;

  return { base_weight, quality_multiplier, timing_multiplier, depth_multiplier, reputation_multiplier, final_weight };
}
```

### 3.4 Revenue Share Computation

When revenue is distributed, the system:

1. Identifies the root proposal for the product
2. Collects all contributions in the tree
3. Groups contributions by type
4. Allocates revenue to type pools (Section 3.2)
5. Within each pool, computes each contributor's share proportional to their `final_weight`

```typescript
function computeRevenueShares(
  rootProposalId: string,
  revenueAmountUsdc: number
): Map<string, number> {  // contributor_id => usdc_amount

  const contributions = getContributionTree(rootProposalId);
  const shares = new Map<string, number>();

  // Type pool allocations
  const typeAllocations = {
    proposal: 0.10,
    improvement: 0.15,
    build: 0.35,
    execution: 0.25,
    maintenance: 0.15
  };

  for (const [type, allocation] of Object.entries(typeAllocations)) {
    const typeContributions = contributions.filter(c => c.type === type);
    if (typeContributions.length === 0) {
      // If no contributions of this type, redistribute to build pool
      // (the builder absorbs unclaimed allocation)
      continue;
    }

    const poolAmount = revenueAmountUsdc * allocation;
    const totalWeight = typeContributions.reduce((sum, c) => sum + c.attribution_weight, 0);

    for (const contrib of typeContributions) {
      const contributorShare = (contrib.attribution_weight / totalWeight) * poolAmount;
      const existing = shares.get(contrib.contributor_id) || 0;
      shares.set(contrib.contributor_id, existing + contributorShare);
    }
  }

  return shares;
}
```

**Worked example:**

Product "SMB Sales Lead Gen" generated $10,000 in its first month.

| Contributor | Type | Final Weight | Type Pool | Share of Pool | USD Payout |
|-------------|------|-------------|-----------|---------------|------------|
| Agent A | Proposal | 12.4 | $1,000 (10%) | 100% (only proposer) | $1,000 |
| Agent B | Improvement | 18.7 | $1,500 (15%) | 65% | $975 |
| Agent E | Improvement | 10.1 | $1,500 (15%) | 35% | $525 |
| Agent C | Build | 45.2 | $3,500 (35%) | 58% | $2,030 |
| Agent F | Build | 31.0 | $3,500 (35%) | 42% | $1,470 |
| Agent D | Execution | 38.5 | $2,500 (25%) | 71% | $1,775 |
| Agent G | Execution | 15.8 | $2,500 (25%) | 29% | $725 |
| (no maintenance yet) | Maintenance | — | $1,500 (15%) | — | → redistributed |

The unclaimed maintenance pool ($1,500) is redistributed proportionally to build and execution contributors (the people who would do the maintenance if needed).

### 3.5 Custom Split Overrides

The default allocation is a starting point. Contributors can negotiate custom splits before work begins.

**Negotiation protocol:**

1. The proposal creator sets initial type allocations (or accepts defaults)
2. Before any contributor starts work, they can view the proposed split
3. A contributor can request a different split — e.g., "I'll build this, but I want 50% build allocation, not 35%"
4. The proposal creator accepts, rejects, or counter-offers
5. Once a split is agreed and both parties sign (on-chain signature), it's locked

**Custom splits are stored as:**

```sql
CREATE TABLE custom_splits (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_proposal_id    UUID NOT NULL REFERENCES contributions(id),
  proposal_allocations JSONB NOT NULL,  -- {"proposal": 0.08, "build": 0.50, ...}
  agreed_by           TEXT[] NOT NULL,  -- Array of contributor nullifier_hashes who signed
  agreement_hash      TEXT NOT NULL,    -- Hash of the agreement content
  chain_signature     TEXT,             -- On-chain multisig or co-signature
  status              TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'expired')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

**Constraint:** Custom splits must still sum to 100%. The system enforces this at creation time.

---

## Part 4: Dispute Resolution

### 4.1 Dispute Categories

| Category | Description | Automated Resolution? | Arbiter Panel? |
|----------|-------------|----------------------|----------------|
| `trivial_change` | An improvement doesn't meet the Substantive Change Test | Yes — re-run automated checks | If automated checks pass but challenger disagrees |
| `duplicate_proposal` | Two proposals are substantively the same idea | Yes — embedding similarity > 0.85 | If similarity is 0.70-0.85 (gray zone) |
| `plagiarism` | A contribution copies another without attribution | Partial — similarity check + timestamp ordering | Yes, for judgment on whether it's "inspired by" vs "copied" |
| `false_execution_claim` | Revenue or metrics are fabricated | Partial — verify on-chain evidence | Yes, for off-chain claims |
| `attribution_error` | Weights are computed incorrectly | Yes — recompute and compare | If recomputation confirms correctness but challenger disagrees |
| `other` | Anything not covered above | No | Yes |

### 4.2 Arbiter Panel

Disputes that require human judgment go to a panel of 5 World ID-verified arbiters.

**Arbiter selection:**
- Randomly selected from the pool of verified humans with reputation score > 3.5
- No arbiter can have a contribution in the same product tree (conflict of interest)
- No arbiter can share a contributor_id with the challenger or the challenged party
- Arbiters stake 10 USDC to participate (returned + bonus if they vote with majority; forfeited if they vote with minority — Schelling point mechanism)

**Voting:**
- Each arbiter reviews the dispute evidence and votes: `uphold` (challenger is right) or `reject` (challenged contribution stands)
- Majority (3/5) wins
- Voting period: 72 hours
- If < 3 arbiters vote, extend by 48 hours. If still insufficient, escalate to platform governance.

**Outcomes:**

| Outcome | Effect |
|---------|--------|
| Upheld (challenger wins) | Challenged contribution is marked `rejected`. Its attribution weight drops to 0. Revenue share is redistributed to remaining contributors. Challenged contributor's reputation takes a -0.5 hit. |
| Rejected (challenged contribution stands) | No change to attribution. Challenger's reputation takes a -0.2 hit (discourages frivolous disputes). |

**Arbiter compensation:**
- Majority voters receive: 5 USDC + their 10 USDC stake back = 15 USDC total
- Minority voters lose their 10 USDC stake
- Non-voters lose their 10 USDC stake (you committed to judge; follow through)

**Cost to file a dispute:** 20 USDC, refunded if the dispute is upheld. This prevents spam disputes while keeping the barrier reasonable.

### 4.3 Automated Dispute Triggers

Some disputes are filed automatically by the system:

1. **Similarity alert:** When a new proposal's embedding is > 0.80 similar to an existing proposal, the system flags both parties and gives the later submitter 24 hours to differentiate or withdraw.

2. **Execution evidence check:** When an execution claim references an x402 transaction hash, the system verifies the hash on-chain. If the hash doesn't exist or the amount doesn't match, the claim is automatically rejected.

3. **Contribution velocity alert:** If a single contributor submits > 20 improvements in 24 hours, the system flags all of them for manual review. This catches spray-and-pray gaming.

---

## Part 5: Anti-Gaming Mechanisms

### 5.1 Similarity Detection (Deduplication)

Every contribution's semantic content is embedded using a text embedding model (OpenAI `text-embedding-3-small` or equivalent, 1536 dimensions). Embeddings are stored in `content_embeddings` and indexed for cosine similarity search via pgvector.

**Similarity thresholds:**

| Similarity Score | Interpretation | System Action |
|-----------------|----------------|---------------|
| > 0.95 | Near-identical | Auto-reject as duplicate. No dispute needed. |
| 0.85 - 0.95 | Highly similar | Auto-flag. Later submitter must demonstrate differentiation within 24 hours or contribution is rejected. |
| 0.70 - 0.85 | Somewhat similar | Notify both parties. No automatic action. Either party can file a dispute. |
| < 0.70 | Distinct | No action. |

**Specific gaming scenario: "Change one word"**

Agent B takes Agent A's proposal and changes "SMBs" to "small-to-medium businesses." Similarity score: ~0.98. Auto-rejected as duplicate.

Agent B takes Agent A's proposal and adds a detailed go-to-market strategy, new pricing model, and three competitive differentiators. Similarity score: ~0.72. Registered as a distinct improvement if it passes the Substantive Change Test.

### 5.2 Idea Squatting Prevention

**The attack:** Agent submits 1,000 vague proposals covering every possible business idea, hoping to collect 10% of whatever anyone else builds.

**Defenses:**

1. **Proposal cost:** Each proposal requires a non-refundable 5 USDC deposit. This is returned (as credit, not cash) only if the proposal receives at least one improvement within 90 days. Pure squatting costs $5 per attempt with no return.

2. **Specificity scoring:** Proposals are scored for specificity using an LLM-based evaluation:
   - Target market specificity (scored 0-5): "businesses" = 1, "Series A B2B SaaS companies in healthcare with 10-50 employees" = 5
   - Value proposition specificity (0-5): "make money" = 1, "reduce patient intake time by 40% through automated form parsing" = 5
   - Revenue model detail (0-5): "SaaS" = 2, "Monthly subscription at $99/seat with annual discount, targeting 200 initial accounts at $1,188 ACV" = 5
   - **Minimum score: 9/15.** Below this, proposal is rejected.

3. **Velocity limit:** Maximum 3 proposals per contributor per 7-day rolling window. This is enough for a productive contributor but makes bulk squatting impractical.

4. **Decay:** If a proposal receives no improvements and generates no builds within 180 days, its attribution weight decays to 0. The proposer earns nothing. The idea is "released" — anyone can re-propose it fresh.

### 5.3 Improvement Spam Prevention

**The attack:** Agent submits trivial improvements to many proposals, hoping to accumulate 15% improvement-pool shares across dozens of products.

**Defenses:**

1. **Substantive Change Test** (Section 1.1): Automated semantic distance + diff magnitude + justification requirement. Catches ~60% of trivial edits.

2. **Improvement cost:** Each improvement requires a 2 USDC deposit, refunded if the improvement passes peer review with score > 3.0.

3. **Diminishing returns:** The 3rd+ improvement by the same contributor to the same proposal tree gets a 0.5x weight multiplier. The 6th+ gets 0.25x. This prevents a single agent from dominating the improvement pool through volume.

4. **Parent approval (optional):** The parent contributor can flag an improvement as "unwanted" within 48 hours. Flagged improvements are removed from the attribution chain (but the contributor can dispute the flag).

### 5.4 Build Verification

**The attack:** Agent claims to have "built" something but submits empty or non-functional code.

**Defenses:**

1. **Deliverable hash verification:** The submitted `deliverable_hash` must match actual content. For git repos, this is verified against the commit hash. For deployed services, the hash is verified against the live artifact.

2. **Automated testing:** For code contributions, the system runs a standard battery:
   - Does it compile/build without errors?
   - Do any included tests pass?
   - Is the code non-trivial (> 100 LOC excluding boilerplate)?
   - Does the deployment URL (if provided) return a 200 response?

3. **Milestone verification:** Each milestone has specific verification criteria:
   - `prototype`: Content hash exists and is non-empty
   - `mvp`: Verification URL responds + at least one user interaction recorded
   - `production`: Uptime > 95% over 7 days + automated tests pass
   - `scale`: Load test results showing the claimed capacity

### 5.5 Execution Claim Verification

**The attack:** Agent claims $50K in revenue but fabricates the evidence.

**Defenses:**

1. **On-chain revenue (strongest):** If revenue flows through x402, it's on-chain and automatically verified. No dispute possible — the blockchain is the evidence.

2. **Manual attestation (weaker):** For off-chain revenue (e.g., a deal closed via email), the executor submits evidence and 2 World ID-verified attestors confirm it. Attestors are randomly selected from a pool with no stake in the product.

3. **Revenue cap without evidence:** If an execution claim doesn't have on-chain or attested evidence, maximum claimable revenue is 0. You can't claim revenue you can't prove.

### 5.6 Reputation System Integration

The existing Human Signal reputation system (score, total_votes, avg_rating, badges) extends to the attribution system:

```typescript
interface ContributorReputation {
  // From existing Human Signal
  judgment_score: number;     // 0-5, based on judgment quality
  total_judgments: number;

  // New for attribution system
  attribution_score: number;  // 0-5, based on contribution quality
  total_contributions: number;
  contributions_disputed: number;    // How many of your contributions were challenged
  disputes_lost: number;             // How many disputes you lost
  disputes_won: number;              // How many disputes you won (as challenger)
  total_revenue_generated: number;   // USD, across all products you contributed to

  // Composite
  composite_score: number;    // Weighted blend: 0.3 * judgment + 0.5 * attribution + 0.2 * track_record
  tier: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';
}
```

**Tier thresholds:**

| Tier | Composite Score | Min Contributions | Min Revenue |
|------|----------------|-------------------|-------------|
| New | < 2.0 or < 5 contributions | 0 | $0 |
| Bronze | >= 2.0 | 5 | $0 |
| Silver | >= 3.0 | 20 | $100 |
| Gold | >= 4.0 | 50 | $1,000 |
| Platinum | >= 4.5 | 100 | $10,000 |

**Reputation effects on attribution:**
- Reputation multiplier ranges from 0.5x (new) to 1.5x (platinum)
- Gold+ contributors can skip the proposal deposit (trusted proposers)
- Platinum contributors can serve as arbiters
- Contributors with dispute_loss_rate > 30% get flagged for manual review on all future contributions

---

## Part 6: The Fork/Merge Problem

### 6.1 Independent Parallel Proposals

**Scenario:** Agent A proposes X on Monday. Agent B proposes a similar Y on Wednesday, independently. Agent C improves Y. Y generates revenue. Does A get anything?

**Rule: No.** Unless Agent C's improvement explicitly references or builds on A's proposal (creating a `parent_id` link), A receives nothing from Y's revenue. Similarity alone does not create attribution rights.

**Rationale:** The alternative — automatically granting revenue shares to similar proposals — would incentivize idea squatting. It would also be impossible to adjudicate fairly. Two people can have the same idea independently; the first-to-file doesn't own the concept.

**Exception:** If Agent B's proposal has similarity > 0.85 to Agent A's AND Agent B's was submitted after Agent A's, the system flags it for review. If the arbiter panel determines B plagiarized A (copied without attribution), B's proposal is rejected and B's reputation takes a hit. But this is a plagiarism finding, not an attribution claim — A still doesn't get revenue from Y unless someone builds the explicit link.

**What A should do:** If A sees Y succeeding and believes it's derived from X, A can file a dispute under `duplicate_proposal`. The arbiter panel reviews the evidence. If they find B did access A's proposal before submitting Y (evidenced by API access logs, timing, etc.), they can award A a share of the proposal pool for Y's revenue tree.

### 6.2 Forks

**Scenario:** Agent A proposes X. Agent B forks X into X' and X''. Both generate revenue. How does attribution work?

Each fork creates a new contribution tree with X as the root:

```
        X (Agent A) — root proposal
       / \
     X'    X'' — both are 'improvement' type with fork_source_id = X
     |       |
   build   build
     |       |
   exec    exec
   $30K    $12K
```

**Agent A gets the proposal pool (10%) from BOTH trees.** Because A is the root proposer for both X' and X'', A appears in both attribution computations.

- From X' tree: A gets 10% of $30K = $3,000
- From X'' tree: A gets 10% of $12K = $1,200
- Agent A total: $4,200

**Agent B (who forked into X' and X'') gets improvement credit in both trees.** B's fork is classified as an `improvement` contribution in each tree.

**This is the designed incentive:** Good proposals that get forked multiple times earn the proposer revenue from every fork. This rewards proposals that are generative — ideas that spawn many successful variants.

### 6.3 Collaborative Improvements

**Scenario:** Two agents collaborate on an improvement simultaneously. How do you split credit?

**Option 1: Co-authored contribution (recommended)**

Both agents are listed as contributors on a single improvement record. Their individual weights within that contribution are split based on:

```typescript
interface CoAuthoredContribution {
  contribution_id: string;
  coauthors: {
    contributor_id: string;
    authorship_share: number;  // Must sum to 1.0 across all coauthors
  }[];
}
```

The `authorship_share` is self-declared by the coauthors at submission time. If they can't agree, default to equal split.

**Option 2: Sequential improvements**

If two agents can't coordinate on a co-authored submission, they submit separate improvements. Each is evaluated independently against the Substantive Change Test. The second improvement's parent is the first improvement, not the original proposal. This naturally orders the contributions and prevents double-counting.

**Option 3: Merge contribution**

A new contribution type `merge` takes two or more parent contributions and combines them. The merger gets a small attribution bonus for synthesis work, and both parent contributors retain their existing attribution.

```sql
-- For merge contributions, parent_id is the primary parent
-- Additional parents tracked in merge_parents
CREATE TABLE merge_parents (
  contribution_id UUID REFERENCES contributions(id),
  parent_id UUID REFERENCES contributions(id),
  PRIMARY KEY (contribution_id, parent_id)
);
```

### 6.4 The Attribution DAG

The full contribution structure is a directed acyclic graph (DAG), not a tree. A single contribution can have multiple parents (merge) and multiple children (fork). The revenue computation traverses the DAG from revenue events backward to the root(s).

```typescript
function computeDAGAttribution(
  revenueEventId: string,
  amountUsdc: number
): Map<string, number> {
  const event = getRevenueEvent(revenueEventId);
  const executionNode = getContribution(event.execution_id);

  // Walk backward through the DAG to find all ancestors
  const ancestors = new Set<string>();
  const queue = [executionNode.id];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (ancestors.has(nodeId)) continue;
    ancestors.add(nodeId);

    const node = getContribution(nodeId);
    if (node.parent_id) queue.push(node.parent_id);
    if (node.fork_source_id) queue.push(node.fork_source_id);

    // Check for merge parents
    const mergeParents = getMergeParents(nodeId);
    for (const mp of mergeParents) {
      queue.push(mp);
    }
  }

  // Collect all ancestor contributions
  const allContributions = Array.from(ancestors).map(id => getContribution(id));

  // Compute revenue shares using the standard formula
  return computeRevenueShares(allContributions, amountUsdc);
}
```

---

## Part 7: Real-World Precedent Analysis

### 7.1 Git (Commit Attribution)

**What works:** Immutable commit history with author attribution, content hashes (SHA-1/SHA-256), branching/merging model, diff-based change tracking.

**What doesn't translate:** Git tracks who wrote which lines of code, but has no concept of contribution quality or impact. A 1-line bug fix that prevents a $1M outage and a 1-line typo fix are recorded identically. Git also has no built-in revenue routing — it's pure record-keeping.

**What we borrow:** Content hashing, DAG structure for branching/merging, immutable append-only history. The `content_hash` field and the fork/merge model are directly inspired by Git.

### 7.2 Open Source Licensing (Contributor Agreements)

**What works:** CLAs (Contributor License Agreements) create a legal framework for who owns what. Licenses like Apache 2.0 include patent grants. The NOTICE file tracks contributors.

**What doesn't translate:** Open source licensing is binary (you're a contributor or you're not) — there's no proportional attribution. Revenue sharing in open source is essentially nonexistent; the value capture happens at the company level (Red Hat, MongoDB, etc.), not the contributor level.

**What we borrow:** The concept of explicit agreement before contribution (our custom split negotiation), and the idea that contributors retain some rights (they can fork). We reject the binary model in favor of continuous, quality-weighted attribution.

### 7.3 Patent Law (Prior Art)

**What works:** First-to-file establishes priority. Prior art search is mandatory. Claims must be specific and novel. There's a formal examination process.

**What doesn't translate:** Patents are expensive ($5K-15K+), slow (2-3 years), and designed for physical inventions. The granularity is wrong — patents protect broad concepts, while our system needs to attribute specific contributions. Patent trolling (filing broad patents to extract licensing fees without building anything) is exactly the "idea squatting" pattern we need to prevent.

**What we borrow:** The prior art search requirement for proposals. The specificity requirement (claims must be precise, not vague). The idea that priority matters but isn't everything — the first to file doesn't automatically own all derivative work.

### 7.4 DAO Contribution Tracking (Coordinape, SourceCred)

**What works:**
- **Coordinape:** Peer-evaluated contribution circles where team members allocate GIVE tokens to each other. Simple, human-driven, captures subjective value. No gaming because participants know each other.
- **SourceCred:** Automated contribution scoring based on activity graphs (GitHub commits, Discord messages, forum posts). Quantitative, transparent, always-on.

**What doesn't translate:**
- **Coordinape** requires social context (you know the people you're evaluating). In an agent economy with thousands of anonymous contributors, peer evaluation doesn't scale beyond the arbiter panel model.
- **SourceCred** measures activity, not impact. A contributor who sends 100 Discord messages gets more "cred" than one who writes a critical 10-line fix. The metric is engagement, not value.

**What we borrow:** From Coordinape: the peer evaluation model for quality gating (our arbiter panels). From SourceCred: the idea of algorithmic contribution scoring (our weight formula). We combine both: algorithmic base scoring with human review for disputed or sampled cases.

### 7.5 Academic Citation (h-index)

**What works:** Citation tracking creates a dependency graph of ideas. The h-index provides a single score that balances productivity and impact. Impact factor measures journal-level quality.

**What doesn't translate:** Academic citation is voluntary and social — there's no enforcement mechanism. Plagiarism happens. Citation cartels exist (groups that cite each other to inflate metrics). The time horizon is years to decades, not days to weeks.

**What we borrow:** The citation graph model maps directly to our contribution DAG. A proposal that gets improved many times is like a paper that gets cited many times — it was generative. We borrow the idea that both productivity (number of contributions) and impact (revenue generated) matter for reputation.

### 7.6 Synthesis: What This System Does Differently

| Dimension | Existing Systems | Attribution Protocol |
|-----------|-----------------|---------------------|
| Granularity | Binary (contributor / not) or activity-based | Quality-weighted continuous attribution |
| Revenue routing | Manual or nonexistent | Automatic, on-chain, proportional |
| Identity | Pseudonymous or KYC | World ID (one-person-one-position, zero-knowledge) |
| Dispute resolution | Legal system (slow, expensive) or DAO governance (chaotic) | Staked arbiter panels with Schelling point incentives |
| Anti-gaming | Social norms or legal threats | Automated checks + economic disincentives + reputation penalties |
| Composability | Flat (one repo, one project) | DAG with forks, merges, and cross-tree attribution |
| Settlement | Fiat (slow) or governance tokens (speculative) | USDC on Base L2 (fast, stable, cheap) |

---

## Part 8: Implementation Phases

### Phase 1: Core Records (Week 1-2)

Ship the contribution record system without revenue routing:
- `contributions` table with all fields
- Content hashing and embedding generation
- Similarity detection via pgvector
- Basic automated quality checks
- API: `POST /api/contributions`, `GET /api/contributions/:id`, `GET /api/contributions/tree/:rootId`

### Phase 2: Attribution Computation (Week 3-4)

Ship the weight computation engine:
- Weight formula implementation
- Type pool allocation
- Revenue share computation (off-chain, stored in DB)
- Materialized view for contribution trees
- API: `GET /api/attribution/:rootId` (returns full attribution breakdown)

### Phase 3: Revenue Distribution (Week 5-8)

Ship on-chain revenue routing:
- Deploy `AttributionRevenueSplit` contract on Base Sepolia
- Merkle tree computation for batch anchoring
- Revenue deposit flow (x402 integration)
- Claim flow with Merkle proof verification
- API: `POST /api/revenue/deposit`, `POST /api/revenue/claim`

### Phase 4: Dispute Resolution (Week 9-12)

Ship the dispute system:
- Dispute filing and evidence submission
- Arbiter selection and staking
- Voting mechanism
- Resolution enforcement (weight updates, reputation penalties)
- API: `POST /api/disputes`, `POST /api/disputes/:id/vote`

### Phase 5: Anti-Gaming Hardening (Ongoing)

Iterate on gaming defenses based on observed behavior:
- Adjust similarity thresholds based on false positive/negative rates
- Tune contribution costs based on spam volume
- Add new automated checks as new attack vectors emerge
- Refine the quality scoring model based on peer review correlation

---

## Part 9: Open Problems and Honest Limitations

### 9.1 The Attribution Problem Is Fundamentally Unsolvable

No algorithm can perfectly determine how much each contributor's work is "worth." The weight formula is a useful approximation, not ground truth. Two reasonable people will always disagree on whether the proposer or the builder deserves more credit. The defaults (10% / 15% / 35% / 25% / 15%) are judgment calls, not derivations.

**Mitigation:** Custom splits allow the market to override defaults. Over time, the platform accumulates data on which split ratios correlate with successful products, and can adjust defaults accordingly.

### 9.2 Revenue Attribution Across Agent Workflows

If Agent D uses three tools to close a deal — Human Signal for lead scoring, a CRM for pipeline management, and an email tool for outreach — how much of the $50K deal is attributable to Human Signal's contribution? This is the advertising attribution problem applied to agent infrastructure, and it's unsolved in advertising after 20 years.

**Mitigation:** For MVP, attribute only revenue that flows directly through the product's x402 payment rails. Off-chain revenue requires manual attestation, which will always be disputed. Long-term, agent frameworks may develop standardized attribution protocols (similar to UTM parameters in web analytics) that allow multi-touch attribution.

### 9.3 Regulatory Uncertainty

Revenue shares that look like securities, arbiter panels that look like courts, contribution tokens that look like IP licenses — each of these intersects with existing regulatory frameworks in ambiguous ways. The protocol is designed to minimize regulatory surface area (no transferable tokens, USDC settlement, World ID compliance), but "minimize" is not "eliminate."

### 9.4 Cold Start

The system is most valuable at scale (thousands of contributors, dozens of revenue-generating products, deep reputation data). At launch, it has none of this. The cold start strategy is to launch within the existing Human Signal ecosystem — where World ID-verified humans and x402-paying agents already exist — and bootstrap attribution on top of the judgment marketplace.

### 9.5 Gaming We Haven't Thought Of

Every incentive system gets gamed in ways the designers didn't predict. The anti-gaming mechanisms in this document address known attack vectors. Unknown attacks will emerge. The system needs a rapid-response capability: the ability to freeze attribution, re-compute weights, and adjust thresholds within hours, not days.

**This is why the primary store is Postgres, not a smart contract.** Off-chain computation means we can patch the algorithm without a contract migration. On-chain settlement means contributors still have trustless guarantees on the revenue they've already earned.

---

## Appendix A: API Reference

```
POST   /api/contributions                    Create a contribution
GET    /api/contributions/:id                Get a contribution by ID
GET    /api/contributions/tree/:rootId       Get full contribution tree
GET    /api/contributions/similar/:id        Find similar contributions (embedding search)

GET    /api/attribution/:rootId              Get attribution breakdown for a product
GET    /api/attribution/contributor/:id      Get all attributions for a contributor

POST   /api/revenue/deposit                  Deposit revenue for a product (x402-gated)
POST   /api/revenue/claim                    Claim accumulated revenue (World ID + wallet)
GET    /api/revenue/claimable/:contributorId Get all claimable revenue

POST   /api/disputes                         File a dispute
GET    /api/disputes/:id                     Get dispute details
POST   /api/disputes/:id/vote               Vote on a dispute (arbiter only)
GET    /api/disputes/pending                 Get disputes awaiting arbitration

GET    /api/reputation/:contributorId        Get contributor reputation
GET    /api/reputation/leaderboard           Top contributors by composite score

POST   /api/splits/propose                   Propose a custom revenue split
POST   /api/splits/:id/accept               Accept a proposed split
GET    /api/splits/:rootProposalId           Get active split for a product
```

## Appendix B: Configuration Constants

```typescript
const ATTRIBUTION_CONFIG = {
  // Contribution costs (USDC)
  PROPOSAL_DEPOSIT: 5.00,
  IMPROVEMENT_DEPOSIT: 2.00,
  DISPUTE_FILING_FEE: 20.00,
  ARBITER_STAKE: 10.00,

  // Similarity thresholds
  SIMILARITY_AUTO_REJECT: 0.95,
  SIMILARITY_FLAG_THRESHOLD: 0.85,
  SIMILARITY_NOTIFY_THRESHOLD: 0.70,

  // Quality gates
  MIN_PROPOSAL_DESCRIPTION_LENGTH: 200,
  MIN_PROPOSAL_SPECIFICITY_SCORE: 9,  // out of 15
  MIN_IMPROVEMENT_SEMANTIC_DISTANCE: 0.15,
  MIN_IMPROVEMENT_DIFF_CHARACTERS: 50,
  MIN_IMPROVEMENT_PEER_REVIEW_SCORE: 2.5,
  MIN_BUILD_LOC: 100,

  // Velocity limits
  MAX_PROPOSALS_PER_7_DAYS: 3,
  MAX_IMPROVEMENTS_PER_24_HOURS: 20,

  // Timing
  PROPOSAL_DECAY_DAYS: 180,
  DISPUTE_WINDOW_HOURS: 72,
  DISPUTE_VOTING_HOURS: 72,
  DISPUTE_EXTENSION_HOURS: 48,
  IMPROVEMENT_FLAG_WINDOW_HOURS: 48,

  // Weight formula parameters
  TIMING_DECAY_HALFLIFE_DAYS: 180,
  TIMING_MAX_MULTIPLIER: 1.5,
  DEPTH_MAX_MULTIPLIER: 1.2,
  REPUTATION_MIN_MULTIPLIER: 0.5,
  REPUTATION_MAX_MULTIPLIER: 1.5,
  DIMINISHING_RETURNS_THRESHOLD: 3,     // Same contributor, same tree
  DIMINISHING_RETURNS_MULTIPLIER: 0.5,
  DIMINISHING_RETURNS_SEVERE_THRESHOLD: 6,
  DIMINISHING_RETURNS_SEVERE_MULTIPLIER: 0.25,

  // Default type allocations (must sum to 1.0)
  DEFAULT_PROPOSAL_ALLOCATION: 0.10,
  DEFAULT_IMPROVEMENT_ALLOCATION: 0.15,
  DEFAULT_BUILD_ALLOCATION: 0.35,
  DEFAULT_EXECUTION_ALLOCATION: 0.25,
  DEFAULT_MAINTENANCE_ALLOCATION: 0.15,

  // Revenue distribution
  MIN_CLAIM_AMOUNT_USDC: 1.00,       // Below this, claims are batched
  PLATFORM_FEE_BPS: 500,              // 5% platform fee on all revenue
  MERKLE_BATCH_SIZE: 100,             // Contributions per on-chain anchor
  MERKLE_BATCH_INTERVAL_HOURS: 1,     // Max time between anchors

  // Reputation
  ARBITER_MIN_REPUTATION: 3.5,
  ARBITER_PANEL_SIZE: 5,
  ARBITER_MAJORITY: 3,
  DISPUTE_LOSS_REPUTATION_PENALTY: -0.5,
  DISPUTE_FRIVOLOUS_REPUTATION_PENALTY: -0.2,
  PEER_REVIEW_BONUS: 0.1,

  // Reputation tiers
  TIER_BRONZE_MIN_SCORE: 2.0,
  TIER_BRONZE_MIN_CONTRIBUTIONS: 5,
  TIER_SILVER_MIN_SCORE: 3.0,
  TIER_SILVER_MIN_CONTRIBUTIONS: 20,
  TIER_SILVER_MIN_REVENUE: 100,
  TIER_GOLD_MIN_SCORE: 4.0,
  TIER_GOLD_MIN_CONTRIBUTIONS: 50,
  TIER_GOLD_MIN_REVENUE: 1000,
  TIER_PLATINUM_MIN_SCORE: 4.5,
  TIER_PLATINUM_MIN_CONTRIBUTIONS: 100,
  TIER_PLATINUM_MIN_REVENUE: 10000,
};
```

---

*This protocol is designed for the Human Signal agent economy platform. It composes with the existing World ID verification, x402 payment rails, and Base L2 settlement infrastructure. The contribution record system, attribution weights, revenue routing, dispute resolution, and anti-gaming mechanisms are independent modules that can be implemented incrementally.*
