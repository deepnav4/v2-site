/**
 * CF Ladder Algorithm - Main Export
 *
 * Comprehensive algorithm for adaptive problem difficulty calibration
 * Based on: https://screenager.dev/blog/2025/cf-ladder
 *
 * This module provides:
 * - Volatility calculation (σ) from contest history
 * - Success rate analysis
 * - Adaptive difficulty calibration
 * - Smart timer recommendations
 */

// Export all types
export type {
  ContestEntry,
  RatingChange,
  VolatilityResult,
  SuccessRateResult,
  DifficultyCalibration,
  TimerConfig,
  ProblemTag,
  LadderMetrics,
} from './types';

export { TAG_WEIGHTS, HIGH_VOLATILITY_TAGS } from './types';

// Export volatility functions
export {
  calculateVolatility,
  calculateRatingChanges,
  calculateMean,
  calculateStandardDeviation,
  getVolatilityLabel,
  getConsistencyLevel,
} from './volatility';

// Export success rate functions
export {
  calculateSuccessRate,
  calculateSuccessRateFromChanges,
  getSuccessRateLabel,
  formatSuccessRate,
  determineTrend,
} from './successRate';

// Export difficulty calibration functions
export {
  calibrateDifficulty,
  calculateRatingBonus,
  calculateAdjustmentFactor,
  calculateBaselineRating,
  calculateDifficultyRange,
  getDifficultyLabel,
  getDifficultyColor,
  formatDifficultyRange,
} from './difficulty';

// Export timer functions
export {
  calculateTimer,
  calculateExpertiseFactor,
  calculateBaseTime,
  calculateTagMultiplier,
  calculateVolatilityFactor,
  roundToNearest5,
  formatTime,
  getTimeDifficultyLabel,
  getTagWeight,
  isHighVolatilityTag,
} from './timer';

// Export problem selection functions
export type { ScoredProblem, LadderProblem } from './problemSelection';
export {
  selectProblems,
  getProblemId,
  formatTimerDisplay,
} from './problemSelection';

// Import for combined analysis
import type { ContestEntry, LadderMetrics } from './types';
import type { CFContest } from '../../services/codeforcesService';
import { calculateVolatility, getConsistencyLevel } from './volatility';
import { calculateSuccessRateFromChanges, determineTrend } from './successRate';
import { calibrateDifficulty } from './difficulty';
import { calculateTimer } from './timer';

/**
 * Calculate complete ladder metrics from contest history
 * This is the main entry point for the algorithm
 */
export function calculateLadderMetrics(
  contests: ContestEntry[],
  currentRating: number,
  problemTags: string[] = []
): LadderMetrics {
  // Step 1: Calculate volatility
  const volatility = calculateVolatility(contests);

  // Step 2: Calculate success rate from volatility's rating changes
  const successRate = calculateSuccessRateFromChanges(volatility.ratingChanges);

  // Step 3: Determine trend
  const trend = determineTrend(contests);
  const isTrendingUp = trend === 'improving';

  // Step 4: Calculate difficulty calibration
  const difficulty = calibrateDifficulty(
    currentRating,
    volatility.volatility,
    successRate.successRate,
    isTrendingUp
  );

  // Step 5: Calculate timer for baseline difficulty
  const timer = calculateTimer(
    difficulty.baselineRating,
    currentRating,
    problemTags
  );

  // Step 6: Determine consistency level
  const consistency = getConsistencyLevel(volatility.volatility);

  return {
    volatility,
    successRate,
    difficulty,
    timer,
    trend,
    consistency,
  };
}

/**
 * Convert LeetCode contest data to ContestEntry format
 * Useful when using with LeetCode API data
 */
export function convertLeetCodeContest(
  participation: {
    rating: number;
    ranking: number;
    problemsSolved: number;
    totalProblems: number;
    contest?: { title?: string; startTime?: number };
  },
  previousRating: number
): ContestEntry {
  return {
    oldRating: previousRating,
    newRating: participation.rating,
    timestamp: participation.contest?.startTime,
    contestName: participation.contest?.title,
    ranking: participation.ranking,
    problemsSolved: participation.problemsSolved,
    totalProblems: participation.totalProblems,
  };
}

/**
 * Convert array of LeetCode participations to ContestEntry array
 */
export function convertLeetCodeContests(
  participations: Array<{
    rating: number;
    ranking: number;
    problemsSolved: number;
    totalProblems: number;
    contest?: { title?: string; startTime?: number };
  }>
): ContestEntry[] {
  if (participations.length === 0) return [];

  const entries: ContestEntry[] = [];

  // First contest starts at a baseline (1500 for LeetCode)
  let previousRating = 1500;

  for (const p of participations) {
    entries.push(convertLeetCodeContest(p, previousRating));
    previousRating = p.rating;
  }

  return entries;
}

/**
 * Convert Codeforces contest history to ContestEntry array
 */
export function convertCFContests(contests: CFContest[]): ContestEntry[] {
  return contests.map(c => ({
    oldRating: c.oldRating,
    newRating: c.newRating,
    timestamp: c.ratingUpdateTimeSeconds,
    contestName: c.contestName,
    ranking: c.rank,
  }));
}
