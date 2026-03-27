import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../store/themeStore';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gauge,
  Info,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  fetchCFUserData,
  fetchCFProblems,
  getRatingColor,
  type CFUserData,
  type CFProblem,
  type CFProblemStat,
} from '../services/codeforcesService';
import {
  calculateLadderMetrics,
  convertCFContests,
  selectProblems,
  type LadderMetrics,
  type LadderProblem,
} from '../utils/cfladder';

function Competitive() {
  const { theme } = useTheme();
  const [handle, setHandle] = useState('');
  const [userData, setUserData] = useState<CFUserData | null>(null);
  const [problems, setProblems] = useState<CFProblem[]>([]);
  const [problemStats, setProblemStats] = useState<CFProblemStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ladderGenerated, setLadderGenerated] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isHidingDetails, setIsHidingDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scroll reveal refs
  const headerRef = useScrollReveal();
  const inputRef = useScrollReveal();

  // Skeleton loading component
  const SkeletonBox = ({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) => (
    <div className={`${width} ${height} rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} animate-pulse`} />
  );

  const UserProfileSkeleton = () => (
    <div className={`p-4 sm:p-6 rounded-lg border mb-6 ${
      theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-4">
        {/* Avatar skeleton */}
        <div className={`w-16 h-16 rounded-full flex-shrink-0 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
        } animate-pulse`} />
        <div className="flex-1">
          <SkeletonBox width="w-32" height="h-6" />
          <div className="mt-2 space-y-2">
            <SkeletonBox width="w-24" height="h-4" />
            <SkeletonBox width="w-40" height="h-4" />
          </div>
        </div>
      </div>
    </div>
  );

  const MetricsSkeleton = () => (
    <div>
      <div className={`h-6 w-40 rounded-lg mb-4 animate-pulse ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
      }`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <SkeletonBox width="w-20" height="h-3" />
            <div className="mt-2">
              <SkeletonBox width="w-16" height="h-6" />
            </div>
            <div className="mt-2">
              <SkeletonBox width="w-24" height="h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProblemListSkeleton = () => (
    <div>
      <div className={`h-6 w-32 rounded-lg mb-4 animate-pulse ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
      }`} />
      <div className={`h-2 rounded-full mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} overflow-hidden`}>
        <div className="h-full w-1/3 bg-emerald-500 animate-pulse" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
              } animate-pulse`} />
              {/* Problem info */}
              <div className="flex-1 space-y-1">
                <SkeletonBox width="w-64" height="h-4" />
                <div className="flex gap-1 pt-1">
                  <SkeletonBox width="w-12" height="h-3" />
                  <SkeletonBox width="w-12" height="h-3" />
                  <SkeletonBox width="w-12" height="h-3" />
                </div>
              </div>
              {/* Time and buttons */}
              <SkeletonBox width="w-12" height="h-4" />
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
              } animate-pulse`} />
              <SkeletonBox width="w-12" height="h-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Calculate ladder metrics
  const ladderMetrics = useMemo<LadderMetrics | null>(() => {
    if (!userData) return null;

    // If no contests, use default rating
    const contests = userData.contests.length > 0
      ? convertCFContests(userData.contests)
      : [
          {
            oldRating: 1500,
            newRating: userData.user.rating || 1500,
            timestamp: Date.now() / 1000,
            contestName: 'Initial Rating',
            ranking: 0,
          }
        ];

    const currentRating = userData.user.rating || 1500;
    return calculateLadderMetrics(contests, currentRating);
  }, [userData]);

  // Select problems for ladder
  const ladderProblems = useMemo<LadderProblem[]>(() => {
    if (!ladderMetrics || problems.length === 0) {
      console.log('Ladder metrics missing or no problems:', { ladderMetrics: !!ladderMetrics, problemsCount: problems.length });
      return [];
    }

    console.log('Selecting problems with difficulty:', ladderMetrics.difficulty);
    const selected = selectProblems(
      problems,
      problemStats,
      ladderMetrics.difficulty,
      userData?.solvedProblems || new Set(),
      30
    );
    console.log('Selected problems:', selected.length);
    return selected;
  }, [ladderMetrics, problems, problemStats, userData?.solvedProblems]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('=== STATE UPDATE ===');
    console.log('userData:', userData);
    console.log('problems:', problems.length);
    console.log('problemStats:', problemStats.length);
    console.log('ladderMetrics:', ladderMetrics);
    console.log('ladderProblems:', ladderProblems.length);
    console.log('ladderGenerated:', ladderGenerated);
  }, [userData, problems, problemStats, ladderMetrics, ladderProblems, ladderGenerated]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle generate ladder
  const handleGenerateLadder = useCallback(async () => {
    if (!handle.trim()) {
      setError('Please enter a Codeforces handle');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user data and problems in parallel
      const [userDataResult, problemsResult] = await Promise.all([
        fetchCFUserData(handle.trim()),
        fetchCFProblems(),
      ]);

      if (!userDataResult) {
        setError('User not found or API error');
        setLoading(false);
        return;
      }

      console.log('User data:', userDataResult);
      console.log('Problems count:', problemsResult.problems.length);
      console.log('Problem stats count:', problemsResult.problemStats.length);

      setUserData(userDataResult);
      setProblems(problemsResult.problems);
      setProblemStats(problemsResult.problemStats);
      setLadderGenerated(true);
      setCompletedProblems(new Set());
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handle]);

  // Toggle problem completion
  const toggleComplete = (problemId: string) => {
    setCompletedProblems(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      return next;
    });
  };

  // Start timer for a problem
  const startTimer = (problemId: string) => {
    setActiveTimer(problemId);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  // Toggle timer pause/play
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset timer
  const resetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setActiveTimer(null);
  };

  // Toggle details with animation
  const toggleDetails = () => {
    if (showDetails) {
      // Start hiding animation
      setIsHidingDetails(true);
      // Wait for animation to complete, then hide
      setTimeout(() => {
        setShowDetails(false);
        setIsHidingDetails(false);
      }, 500);
    } else {
      // Show immediately
      setShowDetails(true);
    }
  };

  // Refresh ladder with latest data
  const handleRefreshLadder = useCallback(async () => {
    if (!userData || !userData.user.handle) return;

    setIsRefreshing(true);
    try {
      // Fetch fresh user data and problems
      const [userDataResult, problemsResult] = await Promise.all([
        fetchCFUserData(userData.user.handle),
        fetchCFProblems(),
      ]);

      if (!userDataResult) {
        setError('Failed to refresh data');
        setIsRefreshing(false);
        return;
      }

      // Update with fresh data
      setUserData(userDataResult);
      setProblems(problemsResult.problems);
      setProblemStats(problemsResult.problemStats);
      // Keep ladder generated state and completed problems
    } catch (err) {
      setError('Failed to refresh. Please try again.');
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [userData]);

  return (
    <>
      <SEO
        title="CF Ladder - Adaptive Problem Practice"
        description="Generate personalized Codeforces problem ladders based on your performance metrics. Adaptive difficulty calibration for optimal practice."
        url="https://navdeep.dev/competitive"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div
            ref={headerRef.ref}
            className={`mb-8 sm:mb-12 reveal ${headerRef.isVisible ? 'visible' : ''}`}
          >
            <p className={`text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium reveal stagger-1 ${headerRef.isVisible ? 'visible' : ''}`}>
              CODEFORCES LADDER
            </p>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-normal mb-4 sm:mb-6 font-serif leading-tight reveal stagger-2 ${headerRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Adaptive Problem Practice
            </h1>
            <p className={`text-sm sm:text-base font-sans max-w-3xl leading-relaxed reveal stagger-3 ${headerRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Generate a personalized problem ladder based on your contest history.
              The algorithm analyzes your volatility, success rate, and trend to calibrate
              the perfect difficulty range for optimal improvement.
            </p>
          </div>

          {/* Handle Input */}
          <div
            ref={inputRef.ref}
            className={`mb-12 sm:mb-16 reveal ${inputRef.isVisible ? 'visible' : ''}`}
          >
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .error-message {
                animation: slideDown 0.3s ease-out;
              }
              @keyframes flowDown {
                from {
                  opacity: 0;
                  transform: translateY(-15px);
                  max-height: 0;
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                  max-height: 1000px;
                }
              }
              .flow-down {
                animation: flowDown 0.5s ease-out forwards;
              }
              @keyframes flowUp {
                from {
                  opacity: 1;
                  transform: translateY(0);
                  max-height: 1000px;
                }
                to {
                  opacity: 0;
                  transform: translateY(-15px);
                  max-height: 0;
                }
              }
              .flow-up {
                animation: flowUp 0.5s ease-out forwards;
              }
            `}</style>
            <div className="flex items-center gap-3 sm:gap-4 pb-4" style={{ borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #e5e5e5' }}>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateLadder()}
                placeholder="Enter Codeforces handle"
                className={`flex-1 bg-transparent text-base sm:text-lg font-serif outline-none placeholder:${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              />
              <button
                onClick={handleGenerateLadder}
                disabled={loading}
                className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-emerald-500 hover:text-emerald-400 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-emerald-300 border-t-emerald-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Generate Ladder</span>
                    <span className="sm:hidden">Generate</span>
                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="error-message mt-3 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* User Profile & Metrics */}
          {userData && ladderMetrics && (
            <div className="mb-12 sm:mb-16">
              {/* User Info Header */}
              <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-8 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={userData.user.avatar || userData.user.titlePhoto}
                    alt={userData.user.handle}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className={`text-xl sm:text-2xl font-serif font-normal ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {userData.user.handle}
                      </h2>
                      <span className="text-purple-500 text-xs sm:text-sm font-sans">
                        ({userData.user.rank})
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm font-sans mt-1.5 sm:mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-semibold" style={{ color: getRatingColor(userData.user.rating) }}>
                        Rating: {userData.user.rating}
                      </span>
                      <span className={`ml-3 sm:ml-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Contests: {userData.contests.length}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
                  <button
                    onClick={handleRefreshLadder}
                    disabled={isRefreshing}
                    className={`flex items-center gap-1.5 text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors disabled:opacity-50 ${isRefreshing ? 'cursor-not-allowed' : ''}`}
                    title="Refresh with latest rating data"
                  >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                  <button
                    onClick={toggleDetails}
                    className={`text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
              </div>

              {/* Performance Analysis Details */}
              {(showDetails || isHidingDetails) && (
                <div className={`mb-8 p-6 rounded-lg ${isHidingDetails ? 'flow-up' : 'flow-down'} ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-serif font-normal mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Performance Analysis
                  </h3>

                  <div className="space-y-6">
                    {/* Recent Trend */}
                    <div>
                      <p className={`text-sm font-sans mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Recent Trend
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">↓</span>
                        <span className={`font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Average change: {ladderMetrics.volatility.mean.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Volatility */}
                    <div>
                      <p className={`text-sm font-sans mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Volatility
                      </p>
                      <span className={`font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {ladderMetrics.volatility.volatility.toFixed(1)} —{' '}
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          Moderately consistent
                        </span>
                      </span>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div>
                      <p className={`text-sm font-sans mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Strengths & Weaknesses
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Strengths */}
                        <div>
                          <p className={`text-xs uppercase tracking-wider mb-2 font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Strong
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['graphs', 'greedy', 'dp'].map(tag => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-1 rounded-full font-sans ${
                                  theme === 'dark'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Weaknesses */}
                        <div>
                          <p className={`text-xs uppercase tracking-wider mb-2 font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Improve
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['strings', 'combinatorics'].map(tag => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-1 rounded-full font-sans ${
                                  theme === 'dark'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ladder Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className={`text-xl font-serif font-normal ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {userData.user.handle}'s Ladder
                  </h2>
                </div>

                {/* Metrics Row */}
                <div className="flex flex-wrap gap-x-12 gap-y-6 mb-8">
                  {/* Baseline Rating */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-xs uppercase tracking-wider font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Baseline Rating
                      </p>
                      <div className="relative">
                        <HelpCircle size={14} className={`cursor-help ${theme === 'dark' ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-white'
                        }`}>
                          This is not your actual Codeforces rating. It's a calculated difficulty level optimized for your practice needs. Computed from your current rating, adjusted for volatility and success rate.
                        </div>
                      </div>
                    </div>
                    <p className={`text-2xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {ladderMetrics.difficulty.baselineRating}
                    </p>
                  </div>

                  {/* Volatility */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-xs uppercase tracking-wider font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Volatility
                      </p>
                      <div className="relative">
                        <HelpCircle size={14} className={`cursor-help ${theme === 'dark' ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-white'
                        }`}>
                          Measures the consistency of your contest performance. Low volatility indicates stable performance, while high volatility suggests inconsistent results.
                        </div>
                      </div>
                    </div>
                    <p className={`text-2xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {ladderMetrics.volatility.volatility.toFixed(0)}
                    </p>
                  </div>

                  {/* Success Rate */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-xs uppercase tracking-wider font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Success Rate
                      </p>
                      <div className="relative">
                        <HelpCircle size={14} className={`cursor-help ${theme === 'dark' ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-white'
                        }`}>
                          The percentage of recent contests where you gained rating points. A higher success rate leads to more challenging problems in your ladder.
                        </div>
                      </div>
                    </div>
                    <p className={`text-2xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {Math.round(ladderMetrics.successRate.successRate * 100)}%
                    </p>
                  </div>

                  {/* Range */}
                  <div className="relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-xs uppercase tracking-wider font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Range
                      </p>
                      <div className="relative">
                        <HelpCircle size={14} className={`cursor-help ${theme === 'dark' ? 'text-gray-600 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-900 text-white'
                        }`}>
                          The difficulty range for your practice problems, calibrated based on your learning curve and recent performance trends.
                        </div>
                      </div>
                    </div>
                    <p className={`text-2xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {ladderMetrics.difficulty.lowerBound}–{ladderMetrics.difficulty.upperBound}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Problem Ladder */}
          {ladderGenerated && ladderProblems.length > 0 && (
            <div>

              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: theme === 'dark' ? 'rgba(107,114,128,0.3)' : 'rgba(229,231,235,0.6)' }}>
                <h3 className={`text-lg font-serif font-normal ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Your Ladder
                </h3>
                <span className={`text-sm font-mono font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {completedProblems.size} / {ladderProblems.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className={`h-1.5 rounded-full mb-8 overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-200/60'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${(completedProblems.size / ladderProblems.length) * 100}%` }}
                />
              </div>

              {/* Active Timer */}
              {activeTimer && (
                <div className={`p-3 sm:p-4 rounded-lg border mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="text-amber-500 flex-shrink-0" size={18} />
                    <span className={`text-xl sm:text-2xl font-mono font-bold ${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                    }`}>
                      {formatTimer(timerSeconds)}
                    </span>
                    <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Problem {activeTimer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button
                      onClick={toggleTimer}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Problem List */}
              <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
                {ladderProblems.map((problem, idx) => {
                  const isCompleted = completedProblems.has(problem.id);
                  const isActive = activeTimer === problem.id;

                  return (
                    <div
                      key={problem.id}
                      className={`group py-3 sm:py-4 ${isCompleted ? 'opacity-40' : ''}`}
                    >
                      {/* Mobile Layout */}
                      <div className="flex sm:hidden items-start gap-3">
                        <button
                          onClick={() => toggleComplete(problem.id)}
                          className={`flex-shrink-0 w-4 h-4 mt-1 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : theme === 'dark'
                              ? 'border-gray-600 hover:border-emerald-500'
                              : 'border-gray-300 hover:border-emerald-500'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 size={10} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-mono text-sm ${
                                isCompleted ? 'line-through' : 'text-emerald-500'
                              }`}
                            >
                              {problem.contestId}{problem.index}
                            </a>
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm truncate ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              } ${isCompleted ? 'line-through' : ''}`}
                            >
                              {problem.name}
                            </a>
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex gap-2">
                              {problem.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag}
                                  className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                                {problem.suggestedTime}m
                              </span>
                              <span className="text-xs font-mono" style={{ color: getRatingColor(problem.rating) }}>
                                {problem.rating}
                              </span>
                              <button
                                onClick={() => startTimer(problem.id)}
                                disabled={isCompleted}
                                className={`${
                                  isCompleted ? 'opacity-30' : isActive ? 'text-amber-500' : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                }`}
                              >
                                <Play size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center gap-4">
                        <span className={`text-xs font-mono tabular-nums w-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <button
                          onClick={() => toggleComplete(problem.id)}
                          className={`flex-shrink-0 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : theme === 'dark'
                              ? 'border-gray-600 hover:border-emerald-500'
                              : 'border-gray-300 hover:border-emerald-500'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 size={10} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-mono text-sm ${isCompleted ? 'line-through' : 'text-emerald-500 hover:text-emerald-400'}`}
                            >
                              {problem.contestId}{problem.index}
                            </a>
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} ${isCompleted ? 'line-through' : ''}`}
                            >
                              {problem.name}
                            </a>
                          </div>
                          <div className="flex gap-2 mt-0.5">
                            {problem.tags.slice(0, 3).map(tag => (
                              <span key={tag} className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span className={`text-xs font-mono tabular-nums ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {problem.suggestedTime}m
                        </span>

                        <span className="flex items-center gap-1.5 text-sm">
                          <span className={`font-serif ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Rating:</span>
                          <span className="font-mono font-semibold tabular-nums" style={{ color: getRatingColor(problem.rating) }}>
                            {problem.rating}
                          </span>
                        </span>

                        <button
                          onClick={() => startTimer(problem.id)}
                          disabled={isCompleted}
                          className={`transition-colors ${
                            isCompleted ? 'opacity-30 cursor-not-allowed' : isActive ? 'text-amber-500' : theme === 'dark' ? 'text-gray-600 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-500'
                          }`}
                        >
                          <Play size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!ladderGenerated && !loading && (
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Gauge size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-sans">Enter your Codeforces handle to generate a personalized ladder</p>
            </div>
          )}

          {/* Loading State - Skeleton Loaders */}
          {loading && (
            <div className="space-y-8">
              <UserProfileSkeleton />
              <MetricsSkeleton />
              <ProblemListSkeleton />
            </div>
          )}

          {/* No Problems Found */}
          {ladderGenerated && ladderProblems.length === 0 && !loading && (
            <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              <Info size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-sans mb-2">No suitable problems found</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                Try a handle with more contest history or different difficulty
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Competitive;
