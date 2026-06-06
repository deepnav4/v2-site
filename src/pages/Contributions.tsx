import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../store/themeStore';
import { GitMerge, GitPullRequest, ExternalLink, ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  fetchGitHubPRs,
  calculatePRStats,
  categorizePR,
  type GitHubPR,
} from '../services/githubPRService';

type StateFilter = 'all' | 'merged' | 'open' | 'closed';

export default function Contributions() {
  const { theme } = useTheme();
  const [prs, setPRs] = useState<GitHubPR[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState<StateFilter>('all');

  const headerRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const filtersRef = useScrollReveal();
  const listRef = useScrollReveal();

  useEffect(() => {
    fetchGitHubPRs().then((data) => {
      setPRs(data);
      setLoading(false);
    });
  }, []);

  // ── Filtering ──────────────────────────────────────────────────────
  const filteredPRs = useMemo(() => {
    return prs.filter((pr) => {
      if (stateFilter === 'merged') return pr.state === 'MERGED';
      if (stateFilter === 'open') return pr.state === 'OPEN';
      if (stateFilter === 'closed') return pr.state === 'CLOSED';
      return true;
    });
  }, [prs, stateFilter]);

  const stats = useMemo(() => calculatePRStats(prs), [prs]);

  // ── Helpers ────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getStatusBadge = (state: GitHubPR['state']) => {
    const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium font-sans';
    switch (state) {
      case 'MERGED':
        return (
          <span className={`${base} ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>
            <GitMerge size={10} />
            Merged
          </span>
        );
      case 'OPEN':
        return (
          <span className={`${base} ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            <GitPullRequest size={10} />
            Open
          </span>
        );
      case 'CLOSED':
        return (
          <span className={`${base} ${theme === 'dark' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
            Closed
          </span>
        );
    }
  };

  const getCategoryBadge = (pr: GitHubPR) => {
    const cat = categorizePR(pr);
    const base = 'text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-wider px-1.5 py-0.5 rounded';
    if (cat === 'external') {
      return (
        <span className={`${base} ${theme === 'dark' ? 'bg-emerald-500/8 text-emerald-500/70' : 'bg-emerald-50 text-emerald-600/70'}`}>
          External
        </span>
      );
    }
    return (
      <span className={`${base} ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
        Personal
      </span>
    );
  };

  // ── Filter button classes ──────────────────────────────────────────
  const filterBtnClass = (active: boolean) =>
    `px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all duration-200 font-sans ${
      active
        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
        : theme === 'dark'
          ? 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-700'
          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
    }`;

  // ── Skeleton loader ────────────────────────────────────────────────
  const Skeleton = () => (
    <div className="space-y-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`py-4 sm:py-5 ${
            i === 0
              ? theme === 'dark' ? 'border-y border-gray-800/60' : 'border-y border-gray-200'
              : theme === 'dark' ? 'border-b border-gray-800/60' : 'border-b border-gray-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className={`h-3 w-28 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            <div className={`h-3 w-16 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            <div className={`h-4 w-14 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
          </div>
          <div className={`h-5 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} style={{ width: `${60 + Math.random() * 30}%` }} />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SEO
        title="Contributions - Navdeep Singh"
        description="Open source and institutional code contributions — pull requests across GitHub repositories."
        url="https://navdeep.dev/contributions"
      />

      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-10 sm:py-14">

          {/* ── Header ──────────────────────────────────────────── */}
          <div
            ref={headerRef.ref}
            className={`mb-8 sm:mb-10 reveal ${headerRef.isVisible ? 'visible' : ''}`}
          >
            <p className={`text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium reveal stagger-1 ${headerRef.isVisible ? 'visible' : ''}`}>
              OPEN SOURCE
            </p>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-normal mb-3 sm:mb-4 font-serif reveal stagger-2 ${headerRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Contributions
            </h1>
            <p className={`text-sm sm:text-base font-sans reveal stagger-3 ${headerRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Pull requests and code contributions across GitHub
              {!loading && (
                <span className={`ml-2 text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                  — {stats.total} {stats.total === 1 ? 'PR' : 'PRs'}
                </span>
              )}
            </p>
          </div>

          {/* ── Stats Bar ───────────────────────────────────────── */}
          {!loading && stats.total > 0 && (
            <div
              ref={statsRef.ref}
              className={`mb-6 sm:mb-8 reveal stagger-3 ${statsRef.isVisible ? 'visible' : ''}`}
            >
              <div className={`flex flex-wrap gap-4 sm:gap-6 py-3 sm:py-4 px-4 sm:px-5 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-[#0a0a0a] border-gray-800/60'
                  : 'bg-gray-50/80 border-gray-200'
              }`}>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg sm:text-xl font-serif font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {stats.total}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Total
                  </span>
                </div>
                <div className={`w-px self-stretch ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg sm:text-xl font-serif font-medium text-purple-500`}>
                    {stats.merged}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Merged
                  </span>
                </div>
                <div className={`w-px self-stretch ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg sm:text-xl font-serif font-medium text-emerald-500`}>
                    {stats.open}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Open
                  </span>
                </div>
                <div className={`w-px self-stretch ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-lg sm:text-xl font-serif font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {stats.repos}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {stats.repos === 1 ? 'Repo' : 'Repos'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Filters ─────────────────────────────────────────── */}
          <div
            ref={filtersRef.ref}
            className={`mb-6 sm:mb-8 reveal stagger-4 ${filtersRef.isVisible ? 'visible' : ''}`}
          >
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(
                [
                  { key: 'all', label: 'All' },
                  { key: 'merged', label: 'Merged' },
                  { key: 'open', label: 'Open' },
                  { key: 'closed', label: 'Closed' },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStateFilter(f.key)}
                  className={filterBtnClass(stateFilter === f.key)}
                >
                  {f.label}
                  {!loading && (
                    <span className="ml-1 opacity-60">
                      {f.key === 'all'
                        ? stats.total
                        : f.key === 'merged'
                          ? stats.merged
                          : f.key === 'open'
                            ? stats.open
                            : stats.closed}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── PR List ──────────────────────────────────────────── */}
          <div
            ref={listRef.ref}
            className={`reveal ${listRef.isVisible ? 'visible' : ''}`}
          >
            {loading ? (
              <Skeleton />
            ) : filteredPRs.length === 0 ? (
              <div className={`py-16 text-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                <GitPullRequest size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-sans">
                  {stateFilter === 'all'
                    ? 'No pull requests found.'
                    : `No ${stateFilter} pull requests.`}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredPRs.map((pr, index) => (
                  <a
                    key={`${pr.repository.nameWithOwner}-${pr.number}`}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block py-4 sm:py-5 transition-colors duration-200 group reveal ${listRef.isVisible ? 'visible' : ''} ${
                      index === 0
                        ? theme === 'dark'
                          ? 'border-y border-gray-800/60 hover:border-gray-700'
                          : 'border-y border-gray-200 hover:border-gray-300'
                        : theme === 'dark'
                          ? 'border-b border-gray-800/60 hover:border-gray-700'
                          : 'border-b border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    {/* Row 1: Meta */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className={`text-[11px] sm:text-xs font-mono ${theme === 'dark' ? 'text-emerald-500/70' : 'text-emerald-600/70'}`}>
                        {pr.repository.nameWithOwner}
                      </span>
                      <span className={`text-[11px] sm:text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>·</span>
                      <time className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(pr.createdAt)}
                      </time>
                      <span className={`text-[11px] sm:text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>·</span>
                      {getStatusBadge(pr.state)}
                      {getCategoryBadge(pr)}
                    </div>

                    {/* Row 2: Title */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className={`text-base sm:text-lg font-normal font-serif transition-colors duration-200 group-hover:text-emerald-500 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        <span className={`font-mono text-xs mr-1.5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          #{pr.number}
                        </span>
                        {pr.title}
                      </h2>
                      <ArrowUpRight
                        size={14}
                        className={`flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'
                        }`}
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer link ──────────────────────────────────────── */}
          {!loading && stats.total > 0 && (
            <div className="mt-10 sm:mt-12 text-center">
              <a
                href="https://github.com/deepnav4"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-emerald-500'
                    : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                <ExternalLink size={13} />
                View full profile on GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
