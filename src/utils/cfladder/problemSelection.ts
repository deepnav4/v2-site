/**
 * CF Ladder Algorithm - Problem Selection
 *
 * Adaptive problem selection based on user performance metrics.
 *
 * Problem Scoring Formula:
 * Score = 0.3 × Popularity + 0.4 × (1 - Normalized Penalty) + 0.3 × Tag Bonus
 *
 * Selection Algorithm:
 * 1. Filter: Exclude problems outside [R_lower, R_upper] and already-solved
 * 2. Score: Apply composite scoring formula
 * 3. Diversify: Group problems into difficulty bins to avoid topic over-representation
 */

import type { CFProblem, CFProblemStat } from '../../services/codeforcesService';
import type { DifficultyCalibration } from './types';
import { calculateTimer } from './timer';

export interface ScoredProblem {
  problem: CFProblem;
  score: number;
  suggestedTime: number;
  popularity: number;
  difficultyPenalty: number;
  tagBonus: number;
}

export interface LadderProblem {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  suggestedTime: number;
  url: string;
  solvedCount: number;
}

// Weights for scoring formula
const POPULARITY_WEIGHT = 0.3;
const DIFFICULTY_WEIGHT = 0.4;
const TAG_BONUS_WEIGHT = 0.3;

// Weak tags that get bonus (user can customize)
const DEFAULT_WEAK_TAGS = ['dp', 'graphs', 'trees', 'math', 'number theory'];

/**
 * Normalize popularity (solved count) to 0-1 range
 */
function normalizePopularity(solvedCount: number, maxSolved: number): number {
  if (maxSolved === 0) return 0.5;
  return Math.min(1, solvedCount / maxSolved);
}

/**
 * Calculate difficulty penalty (distance from baseline)
 * Lower penalty = closer to baseline = better
 */
function calculateDifficultyPenalty(
  problemRating: number,
  baselineRating: number,
  range: number
): number {
  const distance = Math.abs(problemRating - baselineRating);
  return Math.min(1, distance / range);
}

/**
 * Calculate tag bonus based on weak areas
 */
function calculateTagBonus(tags: string[], weakTags: string[]): number {
  if (tags.length === 0) return 0;

  const matchingTags = tags.filter(tag =>
    weakTags.some(weak => tag.toLowerCase().includes(weak.toLowerCase()))
  );

  return matchingTags.length / tags.length;
}

/**
 * Score a single problem
 */
function scoreProblem(
  problem: CFProblem,
  solvedCount: number,
  maxSolved: number,
  baselineRating: number,
  range: number,
  weakTags: string[]
): ScoredProblem {
  const popularity = normalizePopularity(solvedCount, maxSolved);
  const difficultyPenalty = calculateDifficultyPenalty(
    problem.rating || baselineRating,
    baselineRating,
    range
  );
  const tagBonus = calculateTagBonus(problem.tags, weakTags);

  // Score = 0.3 × Popularity + 0.4 × (1 - Penalty) + 0.3 × Tag Bonus
  const score =
    POPULARITY_WEIGHT * popularity +
    DIFFICULTY_WEIGHT * (1 - difficultyPenalty) +
    TAG_BONUS_WEIGHT * tagBonus;

  // Calculate suggested time
  const timerConfig = calculateTimer(
    problem.rating || baselineRating,
    baselineRating,
    problem.tags
  );

  return {
    problem,
    score,
    suggestedTime: timerConfig.suggestedTime,
    popularity,
    difficultyPenalty,
    tagBonus,
  };
}

/**
 * Diversify problems by grouping into difficulty bins
 * Ensures variety in difficulty levels
 */
function diversifyProblems(
  scoredProblems: ScoredProblem[],
  count: number,
  binSize: number = 100
): ScoredProblem[] {
  // Group by difficulty bins
  const bins = new Map<number, ScoredProblem[]>();

  for (const sp of scoredProblems) {
    const rating = sp.problem.rating || 800;
    const bin = Math.floor(rating / binSize) * binSize;

    if (!bins.has(bin)) {
      bins.set(bin, []);
    }
    bins.get(bin)!.push(sp);
  }

  // Sort each bin by score
  for (const binProblems of bins.values()) {
    binProblems.sort((a, b) => b.score - a.score);
  }

  // Round-robin selection from bins
  const result: ScoredProblem[] = [];
  const binKeys = Array.from(bins.keys()).sort((a, b) => a - b);
  let binIndex = 0;

  while (result.length < count && bins.size > 0) {
    const currentBin = binKeys[binIndex % binKeys.length];
    const binProblems = bins.get(currentBin);

    if (binProblems && binProblems.length > 0) {
      result.push(binProblems.shift()!);

      if (binProblems.length === 0) {
        bins.delete(currentBin);
        binKeys.splice(binKeys.indexOf(currentBin), 1);
      }
    }

    binIndex++;
  }

  return result;
}

/**
 * Main problem selection function
 * Returns a list of recommended problems for the ladder
 */
export function selectProblems(
  problems: CFProblem[],
  problemStats: CFProblemStat[],
  difficulty: DifficultyCalibration,
  solvedProblems: Set<string>,
  count: number = 30,
  weakTags: string[] = DEFAULT_WEAK_TAGS
): LadderProblem[] {
  // Create solved count map
  const solvedCountMap = new Map<string, number>();
  let maxSolved = 0;

  for (const stat of problemStats) {
    const key = `${stat.contestId}${stat.index}`;
    solvedCountMap.set(key, stat.solvedCount);
    maxSolved = Math.max(maxSolved, stat.solvedCount);
  }

  // Filter problems - be more lenient with ratings
  const filteredProblems = problems.filter(p => {
    // Must not be solved
    const problemId = `${p.contestId}${p.index}`;
    if (solvedProblems.has(problemId)) return false;

    // If no rating, assign baseline
    if (!p.rating) return true;

    // If rating, must be in range
    if (p.rating < difficulty.lowerBound - 100 || p.rating > difficulty.upperBound + 100) return false;

    return true;
  });

  console.log('Filtered problems:', filteredProblems.length);

  if (filteredProblems.length === 0) {
    // Fallback: return any unsolved problems with ratings
    const fallback = problems
      .filter(p => {
        const id = `${p.contestId}${p.index}`;
        return !solvedProblems.has(id) && p.rating;
      })
      .slice(0, count);

    console.log('Using fallback problems:', fallback.length);
    return fallback.map(p => ({
      id: `${p.contestId}${p.index}`,
      contestId: p.contestId,
      index: p.index,
      name: p.name,
      rating: p.rating || difficulty.baselineRating,
      tags: p.tags,
      suggestedTime: 45,
      url: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
      solvedCount: solvedCountMap.get(`${p.contestId}${p.index}`) || 0,
    }));
  }

  // Score problems
  const range = difficulty.upperBound - difficulty.lowerBound;
  const scoredProblems = filteredProblems.map(p => {
    const key = `${p.contestId}${p.index}`;
    const solvedCount = solvedCountMap.get(key) || 0;

    return scoreProblem(
      p,
      solvedCount,
      maxSolved,
      difficulty.baselineRating,
      range,
      weakTags
    );
  });

  // Sort by score
  scoredProblems.sort((a, b) => b.score - a.score);

  // Diversify selection
  const diversified = diversifyProblems(scoredProblems, count);

  // Convert to LadderProblem format
  return diversified.map(sp => {
    const key = `${sp.problem.contestId}${sp.problem.index}`;

    return {
      id: key,
      contestId: sp.problem.contestId,
      index: sp.problem.index,
      name: sp.problem.name,
      rating: sp.problem.rating || difficulty.baselineRating,
      tags: sp.problem.tags,
      suggestedTime: sp.suggestedTime,
      url: `https://codeforces.com/problemset/problem/${sp.problem.contestId}/${sp.problem.index}`,
      solvedCount: solvedCountMap.get(key) || 0,
    };
  });
}

/**
 * Get problem ID string
 */
export function getProblemId(contestId: number, index: string): string {
  return `${contestId}${index}`;
}

/**
 * Format time as MM:SS
 */
export function formatTimerDisplay(minutes: number): string {
  const mins = Math.floor(minutes);
  return `${mins}:00`;
}
