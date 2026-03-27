/**
 * CF Ladder Algorithm - Difficulty Calibration
 *
 * Calculates adaptive difficulty range based on performance metrics.
 *
 * Formulas:
 * A = -0.5σ + 100(Success Rate - 0.5) + R_bonus
 * R_baseline = max(800, Current Rating + A)
 * R_lower = round(R_baseline × f_l)
 * R_upper = round(R_baseline × f_u)
 *
 * Where:
 * - R_bonus = -25 if current rating < 1500, otherwise 0
 * - f_l, f_u depend on trend:
 *   - Trending up: f_l = 0.85, f_u = 1.2
 *   - Not trending up: f_l = 0.9, f_u = 1.1
 */

import type { DifficultyCalibration } from './types';

const MINIMUM_RATING = 800;
const BEGINNER_THRESHOLD = 1500;
const BEGINNER_PENALTY = -25;

// Trend-based factors
const TRENDING_UP_FACTORS = { lower: 0.85, upper: 1.2 };
const DEFAULT_FACTORS = { lower: 0.9, upper: 1.1 };

/**
 * Calculate the rating bonus (penalty for beginners)
 * R_bonus = -25 if current rating < 1500, otherwise 0
 */
export function calculateRatingBonus(currentRating: number): number {
  return currentRating < BEGINNER_THRESHOLD ? BEGINNER_PENALTY : 0;
}

/**
 * Calculate the adjustment factor
 * A = -0.5σ + 100(Success Rate - 0.5) + R_bonus
 */
export function calculateAdjustmentFactor(
  volatility: number,
  successRate: number,
  ratingBonus: number
): number {
  const volatilityPenalty = -0.5 * volatility;
  const successBonus = 100 * (successRate - 0.5);

  return volatilityPenalty + successBonus + ratingBonus;
}

/**
 * Calculate baseline rating
 * R_baseline = max(800, Current Rating + A)
 */
export function calculateBaselineRating(
  currentRating: number,
  adjustmentFactor: number
): number {
  return Math.max(MINIMUM_RATING, currentRating + adjustmentFactor);
}

/**
 * Calculate difficulty range bounds
 * R_lower = round(R_baseline × f_l)
 * R_upper = round(R_baseline × f_u)
 */
export function calculateDifficultyRange(
  baselineRating: number,
  isTrendingUp: boolean
): { lower: number; upper: number; factorLower: number; factorUpper: number } {
  const factors = isTrendingUp ? TRENDING_UP_FACTORS : DEFAULT_FACTORS;

  return {
    lower: Math.round(baselineRating * factors.lower),
    upper: Math.round(baselineRating * factors.upper),
    factorLower: factors.lower,
    factorUpper: factors.upper,
  };
}

/**
 * Main difficulty calibration function
 * Combines all calculations to produce the complete calibration
 */
export function calibrateDifficulty(
  currentRating: number,
  volatility: number,
  successRate: number,
  isTrendingUp: boolean
): DifficultyCalibration {
  // Step 1: Calculate R_bonus
  const ratingBonus = calculateRatingBonus(currentRating);

  // Step 2: Calculate adjustment factor A
  const adjustmentFactor = calculateAdjustmentFactor(
    volatility,
    successRate,
    ratingBonus
  );

  // Step 3: Calculate R_baseline
  const baselineRating = calculateBaselineRating(currentRating, adjustmentFactor);

  // Step 4: Calculate difficulty range
  const range = calculateDifficultyRange(baselineRating, isTrendingUp);

  return {
    adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
    ratingBonus,
    baselineRating: Math.round(baselineRating),
    lowerBound: range.lower,
    upperBound: range.upper,
    isTrendingUp,
    factorLower: range.factorLower,
    factorUpper: range.factorUpper,
  };
}

/**
 * Get difficulty level label based on rating
 */
export function getDifficultyLabel(rating: number): string {
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2300) return 'Master';
  if (rating < 2400) return 'International Master';
  if (rating < 2600) return 'Grandmaster';
  if (rating < 3000) return 'International Grandmaster';
  return 'Legendary Grandmaster';
}

/**
 * Get color for difficulty rating (CF colors)
 */
export function getDifficultyColor(rating: number): string {
  if (rating < 1200) return '#808080'; // Gray
  if (rating < 1400) return '#008000'; // Green
  if (rating < 1600) return '#03A89E'; // Cyan
  if (rating < 1900) return '#0000FF'; // Blue
  if (rating < 2100) return '#AA00AA'; // Violet
  if (rating < 2300) return '#FF8C00'; // Orange
  if (rating < 2400) return '#FF8C00'; // Orange
  if (rating < 2600) return '#FF0000'; // Red
  if (rating < 3000) return '#FF0000'; // Red
  return '#AA0000'; // Legendary
}

/**
 * Format difficulty range as string
 */
export function formatDifficultyRange(lower: number, upper: number): string {
  return `${lower} - ${upper}`;
}
