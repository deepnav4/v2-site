/**
 * CF Ladder Algorithm - Volatility Calculation
 *
 * Volatility quantifies rating change fluctuation using standard deviation.
 * Higher σ indicates less consistent performance.
 *
 * Formulas:
 * Δ_i = newRating_i - oldRating_i, where i = 1, ..., N
 * μ = (1/N) * Σ(Δ_i)
 * σ = √[(1/N) * Σ(Δ_i - μ)²]
 */

import type { ContestEntry, VolatilityResult } from './types';

const MAX_RECENT_CONTESTS = 10;
const HIGH_VOLATILITY_THRESHOLD = 50;

/**
 * Calculate rating changes (Δ_i) for each contest
 */
export function calculateRatingChanges(contests: ContestEntry[]): number[] {
  return contests.map(c => c.newRating - c.oldRating);
}

/**
 * Calculate the mean (μ) of rating changes
 */
export function calculateMean(ratingChanges: number[]): number {
  if (ratingChanges.length === 0) return 0;
  const sum = ratingChanges.reduce((acc, delta) => acc + delta, 0);
  return sum / ratingChanges.length;
}

/**
 * Calculate standard deviation (σ) of rating changes
 * σ = √[(1/N) * Σ(Δ_i - μ)²]
 */
export function calculateStandardDeviation(ratingChanges: number[], mean: number): number {
  if (ratingChanges.length === 0) return 0;

  const squaredDifferences = ratingChanges.map(delta => Math.pow(delta - mean, 2));
  const variance = squaredDifferences.reduce((acc, sq) => acc + sq, 0) / ratingChanges.length;

  return Math.sqrt(variance);
}

/**
 * Main volatility calculation function
 * Takes recent contests (max 10) and calculates volatility metrics
 */
export function calculateVolatility(contests: ContestEntry[]): VolatilityResult {
  // Take only the most recent N contests (max 10)
  const recentContests = contests.slice(-MAX_RECENT_CONTESTS);

  if (recentContests.length === 0) {
    return {
      volatility: 0,
      mean: 0,
      ratingChanges: [],
      isHighVolatility: false,
    };
  }

  // Calculate Δ_i for each contest
  const ratingChanges = calculateRatingChanges(recentContests);

  // Calculate μ (mean)
  const mean = calculateMean(ratingChanges);

  // Calculate σ (standard deviation/volatility)
  const volatility = calculateStandardDeviation(ratingChanges, mean);

  return {
    volatility: Math.round(volatility * 100) / 100,
    mean: Math.round(mean * 100) / 100,
    ratingChanges,
    isHighVolatility: volatility > HIGH_VOLATILITY_THRESHOLD,
  };
}

/**
 * Get volatility interpretation for display
 */
export function getVolatilityLabel(volatility: number): string {
  if (volatility < 20) return 'Very Consistent';
  if (volatility < 40) return 'Consistent';
  if (volatility < 60) return 'Moderate';
  if (volatility < 80) return 'Variable';
  return 'Highly Variable';
}

/**
 * Get consistency level based on volatility
 */
export function getConsistencyLevel(volatility: number): 'high' | 'medium' | 'low' {
  if (volatility < 30) return 'high';
  if (volatility < 60) return 'medium';
  return 'low';
}
