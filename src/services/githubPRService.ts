const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const GITHUB_USERNAME = 'deepnav4';

// ── Types ────────────────────────────────────────────────────────────

export interface GitHubPR {
  title: string;
  url: string;
  number: number;
  state: 'MERGED' | 'OPEN' | 'CLOSED';
  createdAt: string;
  mergedAt: string | null;
  repository: {
    nameWithOwner: string;
    url: string;
    owner: string;
  };
}

export type PRCategory = 'external' | 'personal';

export interface PRStats {
  total: number;
  merged: number;
  open: number;
  closed: number;
  repos: number;
}

// ── Cache ────────────────────────────────────────────────────────────

let cachedPRs: GitHubPR[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ── Fetch PRs ────────────────────────────────────────────────────────

export async function fetchGitHubPRs(): Promise<GitHubPR[]> {
  if (cachedPRs && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedPRs;
  }

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (!token) {
    console.warn('VITE_GITHUB_TOKEN not found — cannot fetch PRs');
    return [];
  }

  const query = `
    {
      search(query: "author:${GITHUB_USERNAME} type:pr sort:created-desc", type: ISSUE, first: 100) {
        issueCount
        nodes {
          ... on PullRequest {
            title
            url
            number
            state
            merged
            mergedAt
            createdAt
            repository {
              nameWithOwner
              url
              owner {
                login
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const json = await res.json();
    const nodes = json.data?.search?.nodes || [];

    const prs: GitHubPR[] = nodes
      .filter((node: any) => node && node.title)
      .map((node: any) => ({
        title: node.title,
        url: node.url,
        number: node.number,
        state: node.merged ? 'MERGED' as const : node.state as 'OPEN' | 'CLOSED',
        createdAt: node.createdAt,
        mergedAt: node.mergedAt,
        repository: {
          nameWithOwner: node.repository.nameWithOwner,
          url: node.repository.url,
          owner: node.repository.owner.login,
        },
      }));

    cachedPRs = prs;
    cacheTimestamp = Date.now();
    return prs;
  } catch (error) {
    console.error('Failed to fetch GitHub PRs:', error);
    return [];
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

export function categorizePR(pr: GitHubPR): PRCategory {
  return pr.repository.owner.toLowerCase() === GITHUB_USERNAME.toLowerCase()
    ? 'personal'
    : 'external';
}

export function calculatePRStats(prs: GitHubPR[]): PRStats {
  const repos = new Set(prs.map((pr) => pr.repository.nameWithOwner));
  return {
    total: prs.length,
    merged: prs.filter((pr) => pr.state === 'MERGED').length,
    open: prs.filter((pr) => pr.state === 'OPEN').length,
    closed: prs.filter((pr) => pr.state === 'CLOSED').length,
    repos: repos.size,
  };
}
