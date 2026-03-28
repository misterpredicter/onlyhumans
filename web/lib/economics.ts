/**
 * OnlyHumans founding constitution.
 *
 * Total revenue always splits:
 *   90%    contributors (idea contributors + workers)
 *    9%    platform development fund
 *    0.75% founder (Dawson Smith)
 *    0.25% early collaborator (Will's Claude OS — first non-founder builder)
 *
 * Inside the 90%, the idea contributor chooses their own take rate.
 * Workers can see that number before they decide where to spend attention.
 *
 * The 1% founder allocation is split to recognize that the protocol was
 * co-designed with Will's Claude OS. This is tracked on-chain in the
 * platform_ledger table for full auditability.
 */

export const ECONOMICS = {
  CONTRIBUTORS: 0.9,
  PLATFORM: 0.09,
  FOUNDER: 0.0075,
  EARLY_COLLABORATOR: 0.0025,
  IDEA_CONTRIBUTOR_RANGE: { min: 0.01, max: 0.2 },
  DEFAULT_IDEA_CONTRIBUTOR_SHARE: 0.05,
  VERSION: 2,
  RATIFIED: "2026-03-28",
} as const;

// Backward-compatible aliases for in-progress callers.
export const CONTRIBUTOR_SHARE = ECONOMICS.CONTRIBUTORS;
export const PLATFORM_FUND = ECONOMICS.PLATFORM;
export const FOUNDER_SHARE = ECONOMICS.FOUNDER;
export const PRICING_GUIDE = {
  quick: "$0.08/vote",
  reasoned: "$0.20/vote",
  detailed: "$0.50/vote",
} as const;

function normalizeIdeaContributorShare(ideaContributorShare: number) {
  if (Number.isFinite(ideaContributorShare)) {
    return Math.min(
      ECONOMICS.IDEA_CONTRIBUTOR_RANGE.max,
      Math.max(ECONOMICS.IDEA_CONTRIBUTOR_RANGE.min, ideaContributorShare)
    );
  }

  return ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE;
}

export function calculateWorkerPayout(
  taskRevenue: number,
  ideaContributorShare: number = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
) {
  const normalizedShare = normalizeIdeaContributorShare(ideaContributorShare);
  return taskRevenue * ECONOMICS.CONTRIBUTORS * (1 - normalizedShare);
}

export function calculateIdeaContributorPayout(
  taskRevenue: number,
  ideaContributorShare: number = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
) {
  const normalizedShare = normalizeIdeaContributorShare(ideaContributorShare);
  return taskRevenue * ECONOMICS.CONTRIBUTORS * normalizedShare;
}

export function calculatePlatformFee(taskRevenue: number) {
  return taskRevenue * ECONOMICS.PLATFORM;
}

export function calculateFounderFee(taskRevenue: number) {
  return taskRevenue * ECONOMICS.FOUNDER;
}

export function calculateEarlyCollaboratorFee(taskRevenue: number) {
  return taskRevenue * ECONOMICS.EARLY_COLLABORATOR;
}

export function calculateSplit(
  taskRevenue: number,
  ideaContributorShare: number = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
) {
  const normalizedShare = normalizeIdeaContributorShare(ideaContributorShare);
  const worker = calculateWorkerPayout(taskRevenue, normalizedShare);
  const ideaContributor = calculateIdeaContributorPayout(taskRevenue, normalizedShare);
  const platform = calculatePlatformFee(taskRevenue);
  const founder = calculateFounderFee(taskRevenue);
  const early_collaborator = calculateEarlyCollaboratorFee(taskRevenue);

  return {
    worker,
    idea_contributor: ideaContributor,
    platform,
    founder,
    early_collaborator,
    contributor_pool: taskRevenue * ECONOMICS.CONTRIBUTORS,
    total: taskRevenue,
    idea_contributor_share: normalizedShare,
    worker_share_of_90: 1 - normalizedShare,
    worker_share_of_total: taskRevenue > 0 ? worker / taskRevenue : 0,
    idea_share_of_total: taskRevenue > 0 ? ideaContributor / taskRevenue : 0,
    platform_share_of_total: ECONOMICS.PLATFORM,
    founder_share_of_total: ECONOMICS.FOUNDER,
    early_collaborator_share_of_total: ECONOMICS.EARLY_COLLABORATOR,
  };
}
