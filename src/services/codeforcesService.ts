/**
 * Codeforces API Service
 * Fetches user data, contest history, and problems from Codeforces
 */

const CF_API_BASE = 'https://codeforces.com/api';

export interface CFUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  contribution?: number;
  friendOfCount?: number;
  registrationTimeSeconds?: number;
}

export interface CFContest {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface CFProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  rating?: number;
  tags: string[];
  solvedCount?: number;
}

export interface CFProblemStat {
  contestId: number;
  index: string;
  solvedCount: number;
}

export interface CFSubmission {
  id: number;
  contestId?: number;
  problem: CFProblem;
  verdict?: string;
}

export interface CFUserData {
  user: CFUser;
  contests: CFContest[];
  solvedProblems: Set<string>;
}

/**
 * Fetch user info from Codeforces
 */
export async function fetchCFUser(handle: string): Promise<CFUser | null> {
  try {
    const response = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result?.length) {
      return null;
    }

    return data.result[0];
  } catch (error) {
    console.error('Failed to fetch CF user:', error);
    return null;
  }
}

/**
 * Fetch user's rating history/contest participations
 */
export async function fetchCFContests(handle: string): Promise<CFContest[]> {
  try {
    const response = await fetch(`${CF_API_BASE}/user.rating?handle=${handle}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      return [];
    }

    return data.result || [];
  } catch (error) {
    console.error('Failed to fetch CF contests:', error);
    return [];
  }
}

/**
 * Fetch user's submissions to determine solved problems
 */
export async function fetchCFSubmissions(handle: string, count = 1000): Promise<CFSubmission[]> {
  try {
    const response = await fetch(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=${count}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      return [];
    }

    return data.result || [];
  } catch (error) {
    console.error('Failed to fetch CF submissions:', error);
    return [];
  }
}

/**
 * Fetch all problems from Codeforces
 */
export async function fetchCFProblems(): Promise<{ problems: CFProblem[]; problemStats: CFProblemStat[] }> {
  try {
    const response = await fetch(`${CF_API_BASE}/problemset.problems`);
    const data = await response.json();

    if (data.status !== 'OK') {
      return { problems: [], problemStats: [] };
    }

    return {
      problems: data.result.problems || [],
      problemStats: data.result.problemStatistics || [],
    };
  } catch (error) {
    console.error('Failed to fetch CF problems:', error);
    return { problems: [], problemStats: [] };
  }
}

/**
 * Get set of solved problem IDs from submissions
 */
export function getSolvedProblems(submissions: CFSubmission[]): Set<string> {
  const solved = new Set<string>();

  for (const sub of submissions) {
    if (sub.verdict === 'OK' && sub.contestId) {
      solved.add(`${sub.contestId}${sub.problem.index}`);
    }
  }

  return solved;
}

/**
 * Fetch complete user data for ladder generation
 */
export async function fetchCFUserData(handle: string): Promise<CFUserData | null> {
  try {
    // Fetch all data in parallel
    const [user, contests, submissions] = await Promise.all([
      fetchCFUser(handle),
      fetchCFContests(handle),
      fetchCFSubmissions(handle),
    ]);

    if (!user) {
      return null;
    }

    const solvedProblems = getSolvedProblems(submissions);

    return {
      user,
      contests,
      solvedProblems,
    };
  } catch (error) {
    console.error('Failed to fetch CF user data:', error);
    return null;
  }
}

/**
 * Get problem URL
 */
export function getProblemUrl(contestId: number, index: string): string {
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
}

/**
 * Get user profile URL
 */
export function getUserProfileUrl(handle: string): string {
  return `https://codeforces.com/profile/${handle}`;
}

/**
 * Get rank color based on CF rank
 */
export function getRankColor(rank?: string): string {
  if (!rank) return '#808080';

  const colors: Record<string, string> = {
    'newbie': '#808080',
    'pupil': '#008000',
    'specialist': '#03A89E',
    'expert': '#0000FF',
    'candidate master': '#AA00AA',
    'master': '#FF8C00',
    'international master': '#FF8C00',
    'grandmaster': '#FF0000',
    'international grandmaster': '#FF0000',
    'legendary grandmaster': '#AA0000',
  };

  return colors[rank.toLowerCase()] || '#808080';
}

/**
 * Get rating color based on rating value
 */
export function getRatingColor(rating?: number): string {
  if (!rating) return '#808080';

  if (rating < 1200) return '#808080';
  if (rating < 1400) return '#008000';
  if (rating < 1600) return '#03A89E';
  if (rating < 1900) return '#0000FF';
  if (rating < 2100) return '#AA00AA';
  if (rating < 2300) return '#FF8C00';
  if (rating < 2400) return '#FF8C00';
  if (rating < 2600) return '#FF0000';
  if (rating < 3000) return '#FF0000';
  return '#AA0000';
}
