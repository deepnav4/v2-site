/**
 * CF Ladder Algorithm - Type Definitions
 * Based on: https://screenager.dev/blog/2025/cf-ladder
 */

export interface ContestEntry {
  oldRating: number;
  newRating: number;
  timestamp?: number;
  contestName?: string;
  ranking?: number;
  problemsSolved?: number;
  totalProblems?: number;
}

export interface RatingChange {
  delta: number;
  contestIndex: number;
}

export interface VolatilityResult {
  volatility: number;      // σ - Standard deviation of rating changes
  mean: number;            // μ - Mean rating change
  ratingChanges: number[]; // Δ_i values
  isHighVolatility: boolean;
}

export interface SuccessRateResult {
  successRate: number;        // Proportion of positive rating changes
  positiveContests: number;   // Count of contests with Δ > 0
  totalContests: number;      // N
}

export interface DifficultyCalibration {
  adjustmentFactor: number;   // A
  ratingBonus: number;        // R_bonus
  baselineRating: number;     // R_baseline
  lowerBound: number;         // R_lower
  upperBound: number;         // R_upper
  isTrendingUp: boolean;
  factorLower: number;        // f_l
  factorUpper: number;        // f_u
}

export interface TimerConfig {
  baseTime: number;           // T_base in minutes
  tagMultiplier: number;      // T_m
  volatilityFactor: number;   // V_f
  suggestedTime: number;      // T_suggested (rounded to nearest 5)
  expertiseFactor: number;    // E_f
}

export interface ProblemTag {
  name: string;
  weight: number;
}

export interface LadderMetrics {
  volatility: VolatilityResult;
  successRate: SuccessRateResult;
  difficulty: DifficultyCalibration;
  timer: TimerConfig;
  trend: 'improving' | 'declining' | 'stable';
  consistency: 'high' | 'medium' | 'low';
}

// Tag weights for timer calculation
export const TAG_WEIGHTS: Record<string, number> = {
  // Easier tags
  'greedy': 0.9,
  'brute force': 0.9,
  'implementation': 0.9,
  'math': 0.95,
  'sortings': 0.9,
  'strings': 0.95,
  'constructive algorithms': 1.0,
  'binary search': 1.0,
  // Medium tags
  'two pointers': 1.0,
  'data structures': 1.05,
  'dfs and similar': 1.05,
  'bfs': 1.05,
  'dp': 1.15,
  'dynamic programming': 1.15,
  'graphs': 1.1,
  'trees': 1.1,
  'number theory': 1.1,
  // Harder tags
  'segment trees': 1.2,
  'combinatorics': 1.15,
  'bitmasks': 1.15,
  'divide and conquer': 1.15,
  'game theory': 1.2,
  // Advanced tags
  'fft': 1.35,
  'flows': 1.35,
  'convex hull': 1.3,
  'geometry': 1.25,
  '2-sat': 1.3,
  'hashing': 1.1,
  // Default
  'default': 1.0,
};

// High volatility tags that increase timer factor
export const HIGH_VOLATILITY_TAGS = [
  'dp', 'dynamic programming', 'fft', 'flows', 'geometry',
  'game theory', 'combinatorics', '2-sat', 'segment trees'
];
