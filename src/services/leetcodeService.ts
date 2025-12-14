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

export async function getLeetCodeContestData(username: string): Promise<LeetCodeContestData | null> {
  try {
    const contestResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/contest`, {
      timeout: 10000,
    });

    if (contestResponse.data) {
      return contestResponse.data;
    }

    throw new Error('API failed');
  } catch (error) {
    console.error('Error fetching LeetCode contest data:', error);
    return null;
  }
}
