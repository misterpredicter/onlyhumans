/**
 * Human Signal Founding Economics
 *
 * The 90/9/1 split:
 *   90% to contributors (idea contributors + workers)
 *    9% to platform development fund
 *    1% to founder
 *
 * Within the 90%, the split between idea contributors and workers is
 * market-determined. The idea contributor (agent or human who proposes
 * the task framework) sets their take rate when creating a task.
 * Workers see the split before choosing what to work on.
 *
 * If Agent A takes 5% of 90% (leaving 85% for workers) and Agent B
 * takes 3% (leaving 87%), workers choose based on both the rate AND
 * volume. Pure free market.
 */

export const ECONOMICS = {
  /** 90% of bounty goes to contributors (idea contributor + workers) */
  CONTRIBUTOR_SHARE: 0.90,
  /** 9% to platform development fund */
  PLATFORM_FUND: 0.09,
  /** 1% to founder */
  FOUNDER_SHARE: 0.01,

  /**
   * The 90% split between idea contributors and workers is SET BY THE
   * IDEA CONTRIBUTOR when they propose. They choose their take rate
   * (1-20% of the 90%). Workers see the split and choose what to work on.
   * Market forces find equilibrium.
   */
  IDEA_CONTRIBUTOR_RANGE: { min: 0.01, max: 0.20 },

  /** Default idea contributor share if not specified (5% of the 90%) */
  DEFAULT_IDEA_CONTRIBUTOR_SHARE: 0.05,

  VERSION: 1,
  RATIFIED: "2026-03-27",
} as const;

/** Calculate payment breakdown for a given bounty */
export function calculateSplit(bountyPerVote: number, ideaContributorShare: number = ECONOMICS.DEFAULT_IDEA_CONTRIBUTOR_SHARE) {
  const contributorTotal = bountyPerVote * ECONOMICS.CONTRIBUTOR_SHARE;
  const ideaAmount = contributorTotal * ideaContributorShare;
  const workerAmount = contributorTotal - ideaAmount;
  const platformAmount = bountyPerVote * ECONOMICS.PLATFORM_FUND;
  const founderAmount = bountyPerVote * ECONOMICS.FOUNDER_SHARE;

  return {
    worker: workerAmount,
    idea_contributor: ideaAmount,
    platform: platformAmount,
    founder: founderAmount,
    total: bountyPerVote,
  };
}
