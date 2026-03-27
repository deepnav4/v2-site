/**
 * CF Ladder Algorithm - Success Rate Calculation
 *
 * Success Rate measures the proportion of contests with positive rating change.
 *
 * Formula:
 * Success Rate = (Number of contests with Δ_i > 0) / N
 */

import type { ContestEntry, SuccessRateResult } from './types';

const MAX_RECENT_CONTESTS = 10;

/**
 * Calculate success rate from contest entries
 */
export function calculateSuccessRate(contests: ContestEntry[]): SuccessRateResult {
  // Take only the most recent N contests (max 10)
  const recentContests = contests.slice(-MAX_RECENT_CONTESTS);

  if (recentContests.length === 0) {
    return {
      successRate: 0,
      positiveContests: 0,
      totalContests: 0,
    };
  }

  // Count contests with positive rating change (Δ > 0)
  const positiveContests = recentContests.filter(
    c => c.newRating > c.oldRating
  ).length;

  const totalContests = recentContests.length;
  const successRate = positiveContests / totalContests;

  return {
    successRate: Math.round(successRate * 1000) / 1000, // 3 decimal places
    positiveContests,
    totalContests,
  };
}

/**
 * Calculate success rate from rating changes array
 */
export function calculateSuccessRateFromChanges(ratingChanges: number[]): SuccessRateResult {
  if (ratingChanges.length === 0) {
    return {
      successRate: 0,
      positiveContests: 0,
      totalContests: 0,
    };
  }

  const positiveContests = ratingChanges.filter(delta => delta > 0).length;
  const totalContests = ratingChanges.length;
  const successRate = positiveContests / totalContests;

  return {
    successRate: Math.round(successRate * 1000) / 1000,
    positiveContests,
    totalContests,
  };
}

/**
 * Get success rate interpretation for display
 */
export function getSuccessRateLabel(successRate: number): string {
  if (successRate >= 0.8) return 'Excellent';
  if (successRate >= 0.6) return 'Good';
  if (successRate >= 0.5) return 'Average';
  if (successRate >= 0.3) return 'Below Average';
  return 'Needs Improvement';
}

/**
 * Get success rate as percentage string
 */
export function formatSuccessRate(successRate: number): string {
  return `${Math.round(successRate * 100)}%`;
}

/**
 * Determine trend direction based on recent contests
 * Returns 'improving' if last 3 contests show positive trend
 */
export function determineTrend(
  contests: ContestEntry[]
): 'improving' | 'declining' | 'stable' {
  if (contests.length < 2) return 'stable';

  const recent = contests.slice(-3);
  const ratingChanges = recent.map(c => c.newRating - c.oldRating);

  const avgChange = ratingChanges.reduce((a, b) => a + b, 0) / ratingChanges.length;

  if (avgChange > 10) return 'improving';
  if (avgChange < -10) return 'declining';
  return 'stable';
}
