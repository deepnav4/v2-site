import axios from 'axios';

export interface ContestParticipation {
  attended: boolean;
  rating: number;
  ranking: number;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  contest: {
    title: string;
    startTime: number;
  };
}

export interface LeetCodeContestData {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number;
  totalParticipants: number;
  contestTopPercentage: number;
  contestBadges: any;
  contestParticipation: ContestParticipation[];
}

interface CachedData {
  data: LeetCodeContestData;
  timestamp: number;
}

// Cache duration: 30 minutes (in milliseconds)
const CACHE_DURATION = 30 * 60 * 1000;
const CACHE_KEY_PREFIX = 'leetcode_contest_';

// Request throttling
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

function getCacheKey(username: string): string {
  return `${CACHE_KEY_PREFIX}${username}`;
}

function getCachedData(username: string): LeetCodeContestData | null {
  try {
    const cacheKey = getCacheKey(username);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp }: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - timestamp < CACHE_DURATION) {
      console.log('Using cached LeetCode data');
      return data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

function setCachedData(username: string, data: LeetCodeContestData): void {
  try {
    const cacheKey = getCacheKey(username);
    const cachedData: CachedData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

async function waitForThrottle(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`Throttling request, waiting ${waitTime}ms`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

export async function getLeetCodeContestData(username: string): Promise<LeetCodeContestData | null> {
  // Try to get cached data first
  const cachedData = getCachedData(username);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Apply throttling
    await waitForThrottle();
    
    const contestResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
      }
    });

    if (contestResponse.data) {
      // Cache the successful response
      setCachedData(username, contestResponse.data);
      return contestResponse.data;
    }

    throw new Error('API returned no data');
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn('Rate limit hit (429). Using any available cached data...');
      // Try to return stale cache if available
      const staleCache = localStorage.getItem(getCacheKey(username));
      if (staleCache) {
        const { data } = JSON.parse(staleCache);
        console.log('Returning stale cached data due to rate limit');
        return data;
      }
    }
    
    console.error('Error fetching LeetCode contest data:', error.message || error);
    return null;
  }
}

// Function to clear cache manually if needed
export function clearLeetCodeCache(username?: string): void {
  try {
    if (username) {
      localStorage.removeItem(getCacheKey(username));
    } else {
      // Clear all LeetCode caches
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
