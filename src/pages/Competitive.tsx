import { useState, useEffect } from 'react';
import { useTheme } from '../store/themeStore';
import { TrendingUp, Target, Sparkles, BookOpen, Trophy } from 'lucide-react';
import SEO from '../components/SEO';
import { getLeetCodeStats } from '../services/leetcodeService';

function Competitive() {
  const { theme } = useTheme();
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getLeetCodeStats('unknown_man4');
        setLeetcodeStats(stats);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <SEO 
        title="Competitive Programming - Navdeep Singh"
        description="My journey in competitive programming and data structures & algorithms. Daily practice, problem-solving insights, and continuous learning."
        url="https://navdeep.dev/competitive"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-16">
          {/* Header */}
          <div className="mb-16">
            <p className={`text-xs uppercase tracking-[0.2em] mb-6 font-sans font-medium ${
              theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'
            }`}>
              Competitive Programming
            </p>
            <h1 className={`text-5xl md:text-6xl font-normal mb-6 font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              The Journey of Problem Solving
            </h1>
            <p className={`text-lg font-sans max-w-3xl leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Competitive programming isn't just about solving problems—it's about developing a problem-solving 
              mindset, learning to think algorithmically, and continuously pushing your boundaries. Every bug is a 
              lesson, every accepted solution is a victory, and every new concept is a tool in your arsenal.
            </p>
          </div>

          {/* Philosophy Section */}
          <div className={`mb-16 p-8 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
              }`}>
                <Sparkles className="text-emerald-500" size={24} />
              </div>
              <div>
                <h2 className={`text-2xl font-normal mb-3 font-serif ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  My Approach to Competitive Programming
                </h2>
                <div className={`space-y-4 text-base font-sans leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <p>
                    I believe in <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>consistent daily practice</strong> over 
                    sporadic intense sessions. Solving even one problem a day builds momentum and keeps algorithmic thinking sharp.
                  </p>
                  <p>
                    My focus areas include <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Dynamic Programming</strong>, 
                    <strong className={theme === 'dark' ? 'text-white' : 'text-black'}> Graph Algorithms</strong>, and 
                    <strong className={theme === 'dark' ? 'text-white' : 'text-black'}> Advanced Data Structures</strong>. 
                    Each topic requires not just memorizing patterns, but understanding the underlying intuition.
                  </p>
                  <p>
                    I document my learning journey, write editorial-style explanations for difficult problems, and believe in 
                    the <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Feynman Technique</strong>—if you can't 
                    explain it simply, you don't understand it well enough.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LeetCode Stats */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className={`text-3xl font-normal font-serif ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                LeetCode Progress
              </h2>
            </div>

            {loading ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="animate-pulse">Loading stats...</div>
              </div>
            ) : error ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="mb-2">Unable to fetch live data.</p>
                <p className="text-sm">Showing approximate statistics.</p>
              </div>
            ) : null}
            
            {leetcodeStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Contest Rating */}
                <div className={`p-8 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                    }`}>
                      <Trophy className="text-emerald-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm uppercase tracking-wider mb-2 font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Contest Rating
                      </h3>
                      <p className={`text-5xl font-bold font-mono mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {leetcodeStats?.contestData?.rating || 'N/A'}
                      </p>
                      <p className={`text-sm font-sans ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Global Ranking: {leetcodeStats?.ranking?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contests Attended */}
                <div className={`p-8 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                    }`}>
                      <Target className="text-emerald-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm uppercase tracking-wider mb-2 font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Contests Attended
                      </h3>
                      <p className={`text-5xl font-bold font-mono mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {leetcodeStats?.contestData?.attendedContestsCount || 0}
                      </p>
                      <p className={`text-sm font-sans ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Top {leetcodeStats?.contestData?.topPercentage?.toFixed(1) || '0'}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contest History */}
          <div className="mb-16">
            <h2 className={`text-3xl font-normal mb-8 font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Contest Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Contest Stats */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <Trophy className="text-emerald-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Contest Statistics
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Regular participation in contests to test problem-solving skills under time pressure.
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Total Attended</p>
                        <p className={`text-xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          {leetcodeStats?.contestData?.attendedContestsCount || '50+'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Current Rating</p>
                        <p className={`text-xl font-bold font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {leetcodeStats?.contestData?.rating || '1650'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Performance */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <Trophy className="text-emerald-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Best Performance
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Consistent improvement and achieving better ranks in competitive programming contests.
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Top Percentage</p>
                        <p className={`text-xl font-bold font-mono ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Top {leetcodeStats?.contestData?.topPercentage?.toFixed(1) || '15'}%
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Streak</p>
                        <p className={`text-xl font-bold font-mono ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Principles */}
          <div className="mb-16">
            <h2 className={`text-3xl font-normal mb-8 font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Key Learning Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Practice */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <Target className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Daily Consistency
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Solving at least one problem daily builds pattern recognition and muscle memory. 
                      Small consistent efforts compound over time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Deep Understanding */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <BookOpen className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Deep Understanding
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Don't just memorize solutions. Understand why an approach works, its time complexity, 
                      and when to apply it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pattern Recognition */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <TrendingUp className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Pattern Recognition
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Learn to recognize common patterns: sliding window, two pointers, DFS/BFS, 
                      dynamic programming states, and greedy choices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review & Reflect */}
              <div className={`p-6 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-100'
                  }`}>
                    <Sparkles className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 font-sans ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Review & Reflect
                    </h3>
                    <p className={`text-sm font-sans leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Revisit old problems. The same problem after a month reveals how much you've grown. 
                      Write explanations to solidify understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources & Philosophy */}
          <div className={`p-8 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <h2 className={`text-2xl font-normal mb-4 font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Why Competitive Programming Matters
            </h2>
            <div className={`space-y-4 text-base font-sans leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <p>
                Beyond technical interviews, competitive programming teaches <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>problem decomposition</strong>—the 
                ability to break complex problems into manageable subproblems. This skill transfers directly to system design and 
                real-world software engineering.
              </p>
              <p>
                It builds <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>mental models</strong> for efficiency. 
                You start thinking in terms of Big O notation naturally, making you write better production code from the start.
              </p>
              <p>
                Most importantly, it cultivates <strong className={theme === 'dark' ? 'text-white' : 'text-black'}>resilience</strong>. 
                Every "Wrong Answer" or "Time Limit Exceeded" is a chance to debug, optimize, and learn. The growth happens in the struggle, not the success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Competitive;
