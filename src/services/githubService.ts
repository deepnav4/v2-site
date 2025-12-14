interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: Week[];
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    };
  };
}

export async function getContributionData(username: string): Promise<ContributionCalendar | null> {
  const endpoint = "https://api.github.com/graphql";
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (!token) {
    console.warn("VITE_GITHUB_TOKEN not found in environment variables");
    return null;
  }

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const json: GitHubResponse = await res.json();
    return json.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Failed to fetch GitHub contribution data:", error);
    return null;
  }
}
