/**
 * CF Ladder Algorithm - Virtual Contest Generator
 *
 * Generates a personalized virtual contest similar to LeetCode weekly contests.
 *
 * Contest Structure:
 * - Problem 1: Easy (500 pts) - Rating - 300
 * - Problem 2: Easy-Medium (1000 pts) - Rating - 150
 * - Problem 3: Medium (1500 pts) - Rating
 * - Problem 4: Medium-Hard (2000 pts) - Rating + 150
 * - Problem 5: Hard (2500 pts) - Rating + 300
 *
 * Scoring Formula (time-based penalty):
 * Score = BasePoints × max(0.4, 1 - (timeTaken / timeLimit) × 0.6)
 *
 * Total Time: 90 minutes (1.5 hours)
 */

import type { CFProblem, CFProblemStat } from '../../services/codeforcesService';
import { TAG_WEIGHTS } from './types';

export interface ContestProblem {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  url: string;
  points: number;           // Base points for this problem
  targetTime: number;       // Suggested time in minutes
  difficulty: 'Easy' | 'Easy-Medium' | 'Medium' | 'Medium-Hard' | 'Hard';
  solvedCount: number;
}

export interface ContestResult {
  problemId: string;
  solved: boolean;
  timeTaken: number;        // Time in seconds
  score: number;            // Points earned
  attempts: number;         // Wrong submissions
}

export interface VirtualContest {
  id: string;
  problems: ContestProblem[];
  totalTime: number;        // Contest duration in minutes
  totalPoints: number;      // Maximum possible points
  userRating: number;       // User's rating used for generation
  generatedAt: number;      // Timestamp
  focusTags?: string[];     // Tags to prioritize (from weakness analysis)
}

export interface ContestScore {
  results: ContestResult[];
  totalScore: number;
  maxScore: number;
  problemsSolved: number;
  totalTime: number;        // Total time spent in seconds
  rank: string;             // Estimated rank description
  performance: number;      // Estimated performance rating
}

// Contest configuration
const CONTEST_CONFIG = {
  totalTime: 90,            // 90 minutes
  problemCount: 5,
  problems: [
    { difficulty: 'Easy' as const, points: 500, ratingOffset: -300, targetTime: 10 },
    { difficulty: 'Easy-Medium' as const, points: 1000, ratingOffset: -150, targetTime: 15 },
    { difficulty: 'Medium' as const, points: 1500, ratingOffset: 0, targetTime: 20 },
    { difficulty: 'Medium-Hard' as const, points: 2000, ratingOffset: 150, targetTime: 25 },
    { difficulty: 'Hard' as const, points: 2500, ratingOffset: 300, targetTime: 30 },
  ],
};

// Penalty per wrong attempt (percentage)
const WRONG_ATTEMPT_PENALTY = 0.05;

/**
 * Generate a unique contest ID
 */
function generateContestId(): string {
  return `vc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate score for a problem based on time taken
 * Score = BasePoints × max(0.4, 1 - (timeTaken / timeLimit) × 0.6) × (1 - attempts × penalty)
 */
export function calculateProblemScore(
  basePoints: number,
  timeTaken: number,        // in seconds
  targetTime: number,       // in minutes
  attempts: number
): number {
  const targetSeconds = targetTime * 60;
  const timeRatio = Math.min(1, timeTaken / targetSeconds);
  const timeFactor = Math.max(0.4, 1 - timeRatio * 0.6);
  const attemptPenalty = Math.max(0, 1 - attempts * WRONG_ATTEMPT_PENALTY);

  return Math.round(basePoints * timeFactor * attemptPenalty);
}

/**
 * Select a problem for a specific difficulty slot
 */
function selectProblemForSlot(
  problems: CFProblem[],
  problemStats: CFProblemStat[],
  solvedProblems: Set<string>,
  targetRating: number,
  usedProblems: Set<string>,
  focusTags?: string[]
): CFProblem | null {
  // Create solved count map
  const solvedCountMap = new Map<string, number>();
  for (const stat of problemStats) {
    const key = `${stat.contestId}${stat.index}`;
    solvedCountMap.set(key, stat.solvedCount);
  }

  // Filter candidates
  const candidates = problems.filter(p => {
    const problemId = `${p.contestId}${p.index}`;

    // Must not be solved or already used
    if (solvedProblems.has(problemId)) return false;
    if (usedProblems.has(problemId)) return false;

    // Must have rating
    if (!p.rating) return false;

    // Must be within ±100 of target
    if (Math.abs(p.rating - targetRating) > 150) return false;

    return true;
  });

  if (candidates.length === 0) {
    // Fallback: expand range to ±250
    const fallback = problems.filter(p => {
      const problemId = `${p.contestId}${p.index}`;
      if (solvedProblems.has(problemId)) return false;
      if (usedProblems.has(problemId)) return false;
      if (!p.rating) return false;
      if (Math.abs(p.rating - targetRating) > 300) return false;
      return true;
    });

    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // Score candidates
  const scored = candidates.map(p => {
    const problemId = `${p.contestId}${p.index}`;
    const solvedCount = solvedCountMap.get(problemId) || 0;

    let score = 0;

    // 1. Popularity (more solved = better quality problem)
    score += Math.min(1, solvedCount / 10000) * 30;

    // 2. Rating closeness
    if(!p.rating) return { problem: p, score: 0 };
    score += (1 - Math.abs(p.rating - targetRating) / 150) * 40;

    // 3. Focus tag bonus
    if (focusTags && focusTags.length > 0) {
      const matchingTags = p.tags.filter(t =>
        focusTags.some(ft => t.toLowerCase().includes(ft.toLowerCase()))
      );
      score += (matchingTags.length / Math.max(1, p.tags.length)) * 30;
    }

    // 4. Random factor for variety
    score += Math.random() * 10;

    return { problem: p, score };
  });

  // Sort by score and pick top
  scored.sort((a, b) => b.score - a.score);

  // Pick from top 5 randomly for variety
  const topN = scored.slice(0, Math.min(5, scored.length));
  return topN[Math.floor(Math.random() * topN.length)].problem;
}

/**
 * Generate a virtual contest
 */
export function generateVirtualContest(
  problems: CFProblem[],
  problemStats: CFProblemStat[],
  solvedProblems: Set<string>,
  userRating: number,
  focusTags?: string[]
): VirtualContest | null {
  const contestProblems: ContestProblem[] = [];
  const usedProblems = new Set<string>();

  // Create solved count map
  const solvedCountMap = new Map<string, number>();
  for (const stat of problemStats) {
    const key = `${stat.contestId}${stat.index}`;
    solvedCountMap.set(key, stat.solvedCount);
  }

  // Generate each problem slot
  for (const config of CONTEST_CONFIG.problems) {
    const targetRating = Math.max(800, userRating + config.ratingOffset);

    const problem = selectProblemForSlot(
      problems,
      problemStats,
      solvedProblems,
      targetRating,
      usedProblems,
      focusTags
    );

    if (!problem) {
      console.warn(`Could not find problem for ${config.difficulty} slot`);
      continue;
    }

    const problemId = `${problem.contestId}${problem.index}`;
    usedProblems.add(problemId);

    contestProblems.push({
      id: problemId,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      rating: problem.rating!,
      tags: problem.tags,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
      points: config.points,
      targetTime: config.targetTime,
      difficulty: config.difficulty,
      solvedCount: solvedCountMap.get(problemId) || 0,
    });
  }

  if (contestProblems.length < 3) {
    // Not enough problems to make a valid contest
    return null;
  }

  const totalPoints = contestProblems.reduce((sum, p) => sum + p.points, 0);

  return {
    id: generateContestId(),
    problems: contestProblems,
    totalTime: CONTEST_CONFIG.totalTime,
    totalPoints,
    userRating,
    generatedAt: Date.now(),
    focusTags,
  };
}

/**
 * Calculate final contest score
 */
export function calculateContestScore(
  contest: VirtualContest,
  results: ContestResult[]
): ContestScore {
  let totalScore = 0;
  let problemsSolved = 0;
  let totalTime = 0;

  for (const result of results) {
    totalScore += result.score;
    if (result.solved) problemsSolved++;
    totalTime += result.timeTaken;
  }

  const maxScore = contest.totalPoints;
  const scoreRatio = totalScore / maxScore;

  // Estimate rank description
  let rank: string;
  if (scoreRatio >= 0.9) rank = 'Top 1%';
  else if (scoreRatio >= 0.8) rank = 'Top 5%';
  else if (scoreRatio >= 0.7) rank = 'Top 10%';
  else if (scoreRatio >= 0.6) rank = 'Top 20%';
  else if (scoreRatio >= 0.5) rank = 'Top 30%';
  else if (scoreRatio >= 0.4) rank = 'Top 50%';
  else rank = 'Below Average';

  // Estimate performance rating
  // Based on problems solved and their difficulty
  let performanceSum = 0;
  let solvedCount = 0;

  for (const result of results) {
    if (result.solved) {
      const problem = contest.problems.find(p => p.id === result.problemId);
      if (problem) {
        performanceSum += problem.rating;
        solvedCount++;
      }
    }
  }

  const performance = solvedCount > 0
    ? Math.round(performanceSum / solvedCount + (problemsSolved - 2) * 50)
    : contest.userRating - 200;

  return {
    results,
    totalScore,
    maxScore,
    problemsSolved,
    totalTime,
    rank,
    performance,
  };
}

/**
 * Format time as MM:SS
 */
export function formatContestTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: ContestProblem['difficulty']): string {
  const colors: Record<ContestProblem['difficulty'], string> = {
    'Easy': '#22c55e',
    'Easy-Medium': '#84cc16',
    'Medium': '#eab308',
    'Medium-Hard': '#f97316',
    'Hard': '#ef4444',
  };
  return colors[difficulty];
}

/**
 * Estimate expected solve time based on problem characteristics
 */
export function estimateSolveTime(problem: ContestProblem, userRating: number): number {
  const ratingDiff = problem.rating - userRating;

  // Base time from problem difficulty
  let baseTime = problem.targetTime;

  // Adjust for rating difference
  if (ratingDiff > 0) {
    // Problem is harder than user's level
    baseTime *= 1 + (ratingDiff / 200) * 0.3;
  } else {
    // Problem is easier
    baseTime *= Math.max(0.5, 1 + (ratingDiff / 200) * 0.2);
  }

  // Adjust for tags
  const tagMultiplier = problem.tags.reduce((mult, tag) => {
    return mult * (TAG_WEIGHTS[tag.toLowerCase()] || 1);
  }, 1);

  return Math.round(baseTime * tagMultiplier);
}
