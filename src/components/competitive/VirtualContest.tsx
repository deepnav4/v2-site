import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../store/themeStore';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { VirtualContest, ContestResult, ContestScore } from '../../utils/cfladder';
import {
  calculateProblemScore,
  calculateContestScore,
  formatContestTime,
  getContestDifficultyColor,
} from '../../utils/cfladder';
import { getRatingColor } from '../../services/codeforcesService';

interface VirtualContestProps {
  contest: VirtualContest;
  onComplete?: (score: ContestScore) => void;
  onRegenerate?: () => void;
}

type ContestState = 'ready' | 'running' | 'finished';

export default function VirtualContestComponent({ contest, onComplete, onRegenerate }: VirtualContestProps) {
  const { theme } = useTheme();

  const [contestState, setContestState] = useState<ContestState>('ready');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showProblems, setShowProblems] = useState(true);

  const [currentProblem, setCurrentProblem] = useState<string | null>(null);
  const [problemTimers, setProblemTimers] = useState<Map<string, number>>(new Map());
  const [problemResults, setProblemResults] = useState<Map<string, ContestResult>>(new Map());
  const [attempts, setAttempts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && contestState === 'running') {
      interval = setInterval(() => {
        setElapsedSeconds(s => {
          const newTime = s + 1;
          if (newTime >= contest.totalTime * 60) {
            setIsRunning(false);
            setContestState('finished');
          }
          return newTime;
        });
        if (currentProblem) {
          setProblemTimers(prev => {
            const newTimers = new Map(prev);
            newTimers.set(currentProblem, (prev.get(currentProblem) || 0) + 1);
            return newTimers;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, contestState, currentProblem, contest.totalTime]);

  const startContest = useCallback(() => {
    setContestState('running');
    setIsRunning(true);
    setElapsedSeconds(0);
    setProblemTimers(new Map());
    setProblemResults(new Map());
    setAttempts(new Map());
    if (contest.problems.length > 0) {
      setCurrentProblem(contest.problems[0].id);
    }
  }, [contest.problems]);

  const togglePause = () => setIsRunning(!isRunning);

  const markSolved = (problemId: string) => {
    const problem = contest.problems.find(p => p.id === problemId);
    if (!problem) return;

    const timeTaken = problemTimers.get(problemId) || 0;
    const problemAttempts = attempts.get(problemId) || 0;
    const score = calculateProblemScore(problem.points, timeTaken, problem.targetTime, problemAttempts);

    setProblemResults(prev => {
      const newResults = new Map(prev);
      newResults.set(problemId, { problemId, solved: true, timeTaken, score, attempts: problemAttempts });
      return newResults;
    });

    const nextProblem = contest.problems.find(p => !problemResults.has(p.id) && p.id !== problemId);
    if (nextProblem) setCurrentProblem(nextProblem.id);
  };

  const recordWrongAttempt = (problemId: string) => {
    setAttempts(prev => {
      const newAttempts = new Map(prev);
      newAttempts.set(problemId, (prev.get(problemId) || 0) + 1);
      return newAttempts;
    });
  };

  const skipProblem = (problemId: string) => {
    setProblemResults(prev => {
      const newResults = new Map(prev);
      newResults.set(problemId, {
        problemId,
        solved: false,
        timeTaken: problemTimers.get(problemId) || 0,
        score: 0,
        attempts: attempts.get(problemId) || 0,
      });
      return newResults;
    });

    const nextProblem = contest.problems.find(p => !problemResults.has(p.id) && p.id !== problemId);
    if (nextProblem) setCurrentProblem(nextProblem.id);
  };

  const endContest = () => {
    setIsRunning(false);
    setContestState('finished');

    const finalResults: ContestResult[] = [];
    for (const problem of contest.problems) {
      const existing = problemResults.get(problem.id);
      if (existing) {
        finalResults.push(existing);
      } else {
        finalResults.push({
          problemId: problem.id,
          solved: false,
          timeTaken: problemTimers.get(problem.id) || 0,
          score: 0,
          attempts: attempts.get(problem.id) || 0,
        });
      }
    }

    const score = calculateContestScore(contest, finalResults);
    onComplete?.(score);
  };

  const resetContest = () => {
    setContestState('ready');
    setIsRunning(false);
    setElapsedSeconds(0);
    setCurrentProblem(null);
    setProblemTimers(new Map());
    setProblemResults(new Map());
    setAttempts(new Map());
  };

  const currentScore = Array.from(problemResults.values()).reduce((sum, r) => sum + r.score, 0);
  const solvedCount = Array.from(problemResults.values()).filter(r => r.solved).length;
  const remainingTime = contest.totalTime * 60 - elapsedSeconds;

  return (
    <div>
      {/* Header */}
      <div
        className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b cursor-pointer"
        style={{ borderColor: theme === 'dark' ? 'rgba(107,114,128,0.3)' : 'rgba(229,231,235,0.6)' }}
        onClick={() => setShowProblems(!showProblems)}
      >
        <div className="flex items-center gap-2">
          <h3 className={`text-base sm:text-lg font-serif font-normal ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Virtual Contest
          </h3>
          {showProblems ? (
            <ChevronUp size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          ) : (
            <ChevronDown size={18} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
          )}
        </div>
        <div className="flex items-center gap-3">
          {contestState !== 'ready' && (
            <span className={`text-xs sm:text-sm font-poppins tabular-nums ${
              remainingTime < 600 ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {formatContestTime(Math.max(0, remainingTime))}
            </span>
          )}
          <span className={`text-xs sm:text-sm font-poppins font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {solvedCount} / {contest.problems.length}
          </span>
        </div>
      </div>

      {showProblems && (
        <>
          {/* Progress Bar */}
          <div className={`h-1 sm:h-1.5 rounded-full mb-6 sm:mb-8 overflow-hidden ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-200/60'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(solvedCount / contest.problems.length) * 100}%` }}
            />
          </div>

          {/* Contest Controls */}
          {contestState === 'ready' && (
            <div className={`p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {contest.problems.length} problems · {contest.totalTime} min · {contest.totalPoints} pts max
              </div>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onRegenerate?.(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <RotateCcw size={14} className="inline mr-1" />
                  Regenerate
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); startContest(); }}
                  className="px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <Play size={14} className="inline mr-1" />
                  Start
                </button>
              </div>
            </div>
          )}

          {/* Active Timer */}
          {contestState === 'running' && (
            <div className={`p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
              theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="text-emerald-500 flex-shrink-0" size={18} />
                <span className={`text-xl sm:text-2xl font-poppins font-medium tabular-nums ${
                  remainingTime < 600 ? 'text-red-500' : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {formatContestTime(Math.max(0, remainingTime))}
                </span>
                <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  · {currentScore} pts
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePause(); }}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); endContest(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                  }`}
                >
                  End Contest
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {contestState === 'finished' && (
            <div className={`p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6 ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="grid grid-cols-4 gap-4 sm:gap-6">
                  <div>
                    <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Score</p>
                    <p className={`text-lg sm:text-xl font-poppins font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {currentScore}
                    </p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Solved</p>
                    <p className={`text-lg sm:text-xl font-poppins font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {solvedCount}/{contest.problems.length}
                    </p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
                    <p className={`text-lg sm:text-xl font-poppins font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {formatContestTime(elapsedSeconds)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Efficiency</p>
                    <p className={`text-lg sm:text-xl font-poppins font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round((currentScore / contest.totalPoints) * 100)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); resetContest(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <RotateCcw size={14} className="inline mr-1" />
                  New Contest
                </button>
              </div>
            </div>
          )}

          {/* Problem List */}
          <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {contest.problems.map((problem, idx) => {
              const result = problemResults.get(problem.id);
              const timer = problemTimers.get(problem.id) || 0;
              const problemAttempts = attempts.get(problem.id) || 0;
              const isActive = currentProblem === problem.id && contestState === 'running';
              const isSolved = result?.solved;
              const isSkipped = result && !result.solved;

              return (
                <div
                  key={problem.id}
                  className={`group py-3 sm:py-4 ${isSkipped ? 'opacity-40' : ''}`}
                >
                  {/* Mobile Layout */}
                  <div className="flex sm:hidden items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-xs ${
                        isSolved
                          ? 'text-emerald-500'
                          : isSkipped
                          ? 'text-gray-500'
                          : isActive
                          ? 'text-emerald-500'
                          : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {isSolved ? <CheckCircle2 size={16} /> : isSkipped ? <XCircle size={16} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ color: getContestDifficultyColor(problem.difficulty) }}
                        >
                          {problem.difficulty}
                        </span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-mono text-sm ${isSolved ? 'line-through text-gray-500' : 'text-emerald-500'}`}
                        >
                          {problem.contestId}{problem.index}
                        </a>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} ${isSolved ? 'line-through' : ''}`}
                        >
                          {problem.name}
                        </a>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex gap-2">
                          {problem.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-poppins ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {isSolved ? `+${result.score}` : problem.points}pts
                          </span>
                          <span className="text-xs font-poppins" style={{ color: getRatingColor(problem.rating) }}>
                            {problem.rating}
                          </span>
                        </div>
                      </div>
                      {/* Mobile Actions */}
                      {contestState === 'running' && !result && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed" style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
                          <span className={`text-xs font-mono tabular-nums ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatContestTime(timer)}
                            {problemAttempts > 0 && <span className="text-red-500 ml-2">{problemAttempts} WA</span>}
                          </span>
                          <div className="flex gap-1">
                            <button onClick={() => recordWrongAttempt(problem.id)} className="px-2 py-1 text-xs text-red-500">WA</button>
                            <button onClick={() => markSolved(problem.id)} className="px-2 py-1 text-xs text-emerald-500">AC</button>
                            <button onClick={() => skipProblem(problem.id)} className={`px-2 py-1 text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Skip</button>
                          </div>
                        </div>
                      )}
                      {result && (
                        <p className={`text-xs mt-2 ${isSolved ? 'text-emerald-500' : 'text-gray-500'}`}>
                          {isSolved ? `Solved in ${formatContestTime(result.timeTaken)}` : 'Skipped'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-4">
                    <span className={`text-xs font-poppins tabular-nums w-5 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        isSolved
                          ? 'text-emerald-500'
                          : isSkipped
                          ? 'text-gray-500'
                          : isActive
                          ? 'text-emerald-500'
                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {isSolved ? <CheckCircle2 size={14} /> : isSkipped ? <XCircle size={14} /> : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ color: getContestDifficultyColor(problem.difficulty) }}
                        >
                          {problem.difficulty}
                        </span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`font-mono text-sm ${isSolved ? 'line-through text-gray-500' : 'text-emerald-500 hover:text-emerald-400'}`}
                        >
                          {problem.contestId}{problem.index}
                        </a>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} ${isSolved ? 'line-through' : ''}`}
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

                    {/* Timer for current problem */}
                    {contestState === 'running' && !result && (
                      <span className={`text-xs font-mono tabular-nums ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatContestTime(timer)}
                        {problemAttempts > 0 && <span className="text-red-500 ml-1">({problemAttempts})</span>}
                      </span>
                    )}

                    {/* Points */}
                    <span className={`text-sm font-poppins tabular-nums ${
                      isSolved ? 'text-emerald-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {isSolved ? `+${result.score}` : problem.points}
                    </span>

                    {/* Rating */}
                    <span className="text-sm font-poppins tabular-nums" style={{ color: getRatingColor(problem.rating) }}>
                      {problem.rating}
                    </span>

                    {/* Actions */}
                    {contestState === 'running' && !result && (
                      <div className="flex gap-1">
                        {!isActive && (
                          <button
                            onClick={() => setCurrentProblem(problem.id)}
                            className={`px-2 py-1 text-xs ${theme === 'dark' ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                          >
                            Focus
                          </button>
                        )}
                        <button onClick={() => recordWrongAttempt(problem.id)} className="px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 rounded">WA</button>
                        <button onClick={() => markSolved(problem.id)} className="px-2 py-1 text-xs text-emerald-500 hover:bg-emerald-500/10 rounded">AC</button>
                        <button onClick={() => skipProblem(problem.id)} className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>Skip</button>
                      </div>
                    )}

                    {result && (
                      <span className={`text-xs ${isSolved ? 'text-emerald-500' : 'text-gray-500'}`}>
                        {isSolved ? formatContestTime(result.timeTaken) : 'Skipped'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
