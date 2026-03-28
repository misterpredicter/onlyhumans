/**
 * Human Signal founding constitution.
 *
 * Total revenue always splits:
 *   90% contributors
 *    9% platform fund
 *    1% founder
 *
 * Inside the 90%, the idea contributor chooses their own take rate.
 * Workers can see that number before deciding where to spend attention.
 */

export const ECONOMICS = {
  CONTRIBUTORS: 0.9,
  PLATFORM: 0.09,
  FOUNDER: 0.01,
  EARLY_COLLABORATOR: 0,
  IDEA_CONTRIBUTOR_RANGE: { min: 0.01, max: 0.2 },
  DEFAULT_IDEA_CONTRIBUTOR_SHARE: 0.05,
  VERSION: 1,
  RATIFIED: "2026-03-27",
} as const;

// Backward-compatible aliases for existing callers.
export const CONTRIBUTOR_SHARE = ECONOMICS.CONTRIBUTORS;
export const PLATFORM_FUND = ECONOMICS.PLATFORM;
export const FOUNDER_SHARE = ECONOMICS.FOUNDER;
export const EARLY_COLLABORATOR_SHARE = ECONOMICS.EARLY_COLLABORATOR;
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

export function calculateSplit(
  taskRevenue: number,
  ideaContributorShare: number = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE
) {
  const normalizedShare = normalizeIdeaContributorShare(ideaContributorShare);
  const worker = calculateWorkerPayout(taskRevenue, normalizedShare);
  const ideaContributor = calculateIdeaContributorPayout(taskRevenue, normalizedShare);
  const platform = calculatePlatformFee(taskRevenue);
  const founder = calculateFounderFee(taskRevenue);

  return {
    worker,
    idea_contributor: ideaContributor,
    platform,
    founder,
    early_collaborator: 0,
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
