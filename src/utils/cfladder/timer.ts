/**
 * CF Ladder Algorithm - Adaptive Timer System
 *
 * Calculates recommended time for solving a problem based on difficulty and tags.
 *
 * Formulas:
 * T_base = round(20 + 25 × log(1 + (difficulty - 800) / 600) × E_f)
 * T_m = Σ(w_i) / n (average of tag weights)
 * V_f = 1 + 0.05 × |high_volatility_tags|
 * T_suggested = round(T_base × T_m × V_f / 5) × 5
 *
 * Where:
 * - E_f = expertise factor (decreases as user rating increases)
 * - w_i = weight of tag i
 * - n = number of tags
 */

import type { TimerConfig, ProblemTag } from './types';
import { TAG_WEIGHTS, HIGH_VOLATILITY_TAGS } from './types';

/**
 * Calculate expertise factor based on user rating
 * Higher rating = lower factor (experts need less time)
 */
export function calculateExpertiseFactor(userRating: number): number {
  // E_f ranges from 1.5 (beginners) to 0.7 (grandmasters)
  // Linear interpolation: 1.5 at 800, 0.7 at 3000
  const minRating = 800;
  const maxRating = 3000;
  const maxFactor = 1.5;
  const minFactor = 0.7;

  if (userRating <= minRating) return maxFactor;
  if (userRating >= maxRating) return minFactor;

  const ratio = (userRating - minRating) / (maxRating - minRating);
  return maxFactor - ratio * (maxFactor - minFactor);
}

/**
 * Calculate base time for a problem
 * T_base = round(20 + 25 × log(1 + (difficulty - 800) / 600) × E_f)
 */
export function calculateBaseTime(
  problemDifficulty: number,
  expertiseFactor: number
): number {
  const BASE_MINUTES = 20;
  const SCALING_FACTOR = 25;
  const DIFFICULTY_OFFSET = 800;
  const DIFFICULTY_DIVISOR = 600;

  const logComponent = Math.log(
    1 + (problemDifficulty - DIFFICULTY_OFFSET) / DIFFICULTY_DIVISOR
  );

  return Math.round(BASE_MINUTES + SCALING_FACTOR * logComponent * expertiseFactor);
}

/**
 * Calculate tag multiplier (average of tag weights)
 * T_m = Σ(w_i) / n
 */
export function calculateTagMultiplier(tags: string[]): number {
  if (tags.length === 0) return 1.0;

  const weights = tags.map(tag => {
    const normalizedTag = tag.toLowerCase().trim();
    return TAG_WEIGHTS[normalizedTag] ?? TAG_WEIGHTS['default'];
  });

  const sum = weights.reduce((acc, w) => acc + w, 0);
  return sum / weights.length;
}

/**
 * Calculate volatility factor based on high-volatility tags
 * V_f = 1 + 0.05 × |high_volatility_tags|
 */
export function calculateVolatilityFactor(tags: string[]): number {
  const highVolatilityCount = tags.filter(tag =>
    HIGH_VOLATILITY_TAGS.includes(tag.toLowerCase().trim())
  ).length;

  return 1 + 0.05 * highVolatilityCount;
}

/**
 * Round time to nearest 5 minutes
 */
export function roundToNearest5(minutes: number): number {
  return Math.round(minutes / 5) * 5;
}

/**
 * Main timer calculation function
 * Returns complete timer configuration
 */
export function calculateTimer(
  problemDifficulty: number,
  userRating: number,
  tags: string[] = []
): TimerConfig {
  // Step 1: Calculate expertise factor
  const expertiseFactor = calculateExpertiseFactor(userRating);

  // Step 2: Calculate base time
  const baseTime = calculateBaseTime(problemDifficulty, expertiseFactor);

  // Step 3: Calculate tag multiplier
  const tagMultiplier = calculateTagMultiplier(tags);

  // Step 4: Calculate volatility factor
  const volatilityFactor = calculateVolatilityFactor(tags);

  // Step 5: Calculate final suggested time
  // T_suggested = round(T_base × T_m × V_f / 5) × 5
  const rawTime = baseTime * tagMultiplier * volatilityFactor;
  const suggestedTime = roundToNearest5(rawTime);

  return {
    baseTime,
    tagMultiplier: Math.round(tagMultiplier * 1000) / 1000,
    volatilityFactor: Math.round(volatilityFactor * 1000) / 1000,
    suggestedTime: Math.max(10, suggestedTime), // Minimum 10 minutes
    expertiseFactor: Math.round(expertiseFactor * 1000) / 1000,
  };
}

/**
 * Format time for display (e.g., "45 min" or "1h 15m")
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get time difficulty label
 */
export function getTimeDifficultyLabel(minutes: number): string {
  if (minutes <= 20) return 'Quick';
  if (minutes <= 40) return 'Standard';
  if (minutes <= 60) return 'Extended';
  if (minutes <= 90) return 'Challenge';
  return 'Deep Work';
}

/**
 * Get tag weight for a specific tag
 */
export function getTagWeight(tag: string): number {
  return TAG_WEIGHTS[tag.toLowerCase().trim()] ?? TAG_WEIGHTS['default'];
}

/**
 * Check if a tag is high volatility
 */
export function isHighVolatilityTag(tag: string): boolean {
  return HIGH_VOLATILITY_TAGS.includes(tag.toLowerCase().trim());
}
