import { useState, useEffect } from 'react';
import { useTheme } from '../store/themeStore';
import { TrendingUp, Target, Sparkles, BookOpen, TrendingDown, Minus, LineChart, BarChart3, Activity } from 'lucide-react';
import SEO from '../components/SEO';
import { getLeetCodeContestData, type LeetCodeContestData } from '../services/leetcodeService';
import { LineChart as RechartsLine, BarChart as RechartsBar, AreaChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Competitive() {
  const { theme } = useTheme();
  const [contestData, setContestData] = useState<LeetCodeContestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area');

  useEffect(() => {
    async function fetchData() {
      try {
        const username = import.meta.env.VITE_LEETCODE_USERNAME || 'unknown_man4';
        const data = await getLeetCodeContestData(username);
        setContestData(data);
        setError(!data);
      } catch (err) {
        console.error('Failed to fetch contest data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

          {/* LeetCode Contest Stats */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className={`text-3xl font-normal font-serif ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                LeetCode Contest Performance
              </h2>
            </div>

            {loading ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="animate-pulse">Loading contest data...</div>
              </div>
            ) : error || !contestData ? (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="mb-2">Unable to fetch live contest data.</p>
              </div>
            ) : (
              <>
                {/* Two Column Layout: Graph (Left) and Stats (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {/* Left: Rating Progress Graph */}
                  <div className={`p-6 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-base font-normal font-serif ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        Rating Progression
                      </h3>
                      {/* Chart Type Switcher */}
                      <div className={`flex gap-1 p-1 rounded-lg border ${
                        theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-300'
                      }`}>
                        <button
                          onClick={() => setChartType('area')}
                          className={`p-1.5 rounded transition-all ${
                            chartType === 'area'
                              ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Area Chart"
                        >
                          <Activity size={16} />
                        </button>
                        <button
                          onClick={() => setChartType('line')}
                          className={`p-1.5 rounded transition-all ${
                            chartType === 'line'
                              ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Line Chart"
                        >
                          <LineChart size={16} />
                        </button>
                        <button
                          onClick={() => setChartType('bar')}
                          className={`p-1.5 rounded transition-all ${
                            chartType === 'bar'
                              ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                              : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Bar Chart"
                        >
                          <BarChart3 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ width: '100%', height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'area' ? (
                          <AreaChart
                            data={contestData.contestParticipation.map((contest, idx) => ({
                              name: `#${idx + 1}`,
                              rating: Math.round(contest.rating),
                              rank: contest.ranking,
                              contest: contest.contest.title,
                              solved: contest.problemsSolved,
                              total: contest.totalProblems,
                            }))}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid 
                              strokeDasharray="3 3" 
                              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                              opacity={0.3}
                            />
                            <XAxis 
                              dataKey="name" 
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <YAxis 
                              domain={[1200, 'auto']}
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(8px)',
                              }}
                              labelStyle={{ 
                                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                              }}
                              itemStyle={{ 
                                color: theme === 'dark' ? '#10b981' : '#059669',
                                fontSize: '13px',
                                fontWeight: '600',
                              }}
                              formatter={(value: any, name: string, props: any) => {
                                if (name === 'rating') {
                                  return [
                                    <div key="tooltip" className="space-y-1">
                                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        Rating: {value}
                                      </div>
                                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Rank: {props.payload.rank.toLocaleString()}
                                      </div>
                                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Solved: {props.payload.solved}/{props.payload.total}
                                      </div>
                                    </div>,
                                    ''
                                  ];
                                }
                                return [value, name];
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="#10b981" 
                              strokeWidth={2.5}
                              fill="url(#colorRating)"
                              animationDuration={1000}
                              animationEasing="ease-in-out"
                            />
                          </AreaChart>
                        ) : chartType === 'line' ? (
                          <RechartsLine
                            data={contestData.contestParticipation.map((contest, idx) => ({
                              name: `#${idx + 1}`,
                              rating: Math.round(contest.rating),
                              rank: contest.ranking,
                              contest: contest.contest.title,
                              solved: contest.problemsSolved,
                              total: contest.totalProblems,
                            }))}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid 
                              strokeDasharray="3 3" 
                              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                              opacity={0.3}
                            />
                            <XAxis 
                              dataKey="name" 
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <YAxis 
                              domain={[1200, 'auto']}
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                backdropFilter: 'blur(8px)',
                              }}
                              labelStyle={{ 
                                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                                fontSize: '12px',
                                marginBottom: '4px',
                              }}
                              formatter={(value: any, name: string, props: any) => {
                                if (name === 'rating') {
                                  return [
                                    <div key="tooltip" className="space-y-1">
                                      <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                        Rating: {value}
                                      </div>
                                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Rank: {props.payload.rank.toLocaleString()}
                                      </div>
                                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Solved: {props.payload.solved}/{props.payload.total}
                                      </div>
                                    </div>,
                                    ''
                                  ];
                                }
                                return [value, name];
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="#10b981" 
                              strokeWidth={2.5}
                              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, strokeWidth: 2 }}
                              animationDuration={1000}
                              animationEasing="ease-in-out"
                            />
                          </RechartsLine>
                        ) : (
                          <RechartsBar
                            data={contestData.contestParticipation.map((contest, idx) => ({
                              name: `#${idx + 1}`,
                              rating: Math.round(contest.rating),
                              rank: contest.ranking,
                              contest: contest.contest.title,
                              solved: contest.problemsSolved,
                              total: contest.totalProblems,
                            }))}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid 
                              strokeDasharray="3 3" 
                              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                              opacity={0.3}
                            />
                            <XAxis 
                              dataKey="name" 
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <YAxis 
                              domain={[1200, 'auto']}
                              stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                              tick={{ fontSize: 11, fill: theme === 'dark' ? '#6b7280' : '#9ca3af' }}
                            />
                            <Tooltip
                              cursor={false}
                              contentStyle={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                              }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div 
                                      className={`rounded-lg border shadow-lg p-3 ${
                                        theme === 'dark' 
                                          ? 'bg-gray-800/95 border-gray-700' 
                                          : 'bg-white/95 border-gray-200'
                                      }`}
                                      style={{ backdropFilter: 'blur(8px)' }}
                                    >
                                      <div className="space-y-1">
                                        <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                          Rating: {data.rating}
                                        </div>
                                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Rank: {data.rank.toLocaleString()}
                                        </div>
                                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Solved: {data.solved}/{data.total}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar 
                              dataKey="rating" 
                              fill="#10b981"
                              radius={[8, 8, 0, 0]}
                              animationDuration={1000}
                              animationEasing="ease-in-out"
                            />
                          </RechartsBar>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Stats Summary */}
                  <div className="space-y-4">
                    <div className={`p-5 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`text-xs uppercase tracking-wider mb-2 font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Current Rating
                      </p>
                      <p className={`text-3xl font-semibold font-sans mb-1 ${
                        theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        {Math.round(contestData.contestRating)}
                      </p>
                      <p className={`text-xs font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Rank {contestData.contestGlobalRanking?.toLocaleString()}
                      </p>
                    </div>

                    <div className={`p-5 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`text-xs uppercase tracking-wider mb-2 font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Contests Attended
                      </p>
                      <p className={`text-3xl font-semibold font-sans mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {contestData.contestAttend}
                      </p>
                      <p className={`text-xs font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Active participation
                      </p>
                    </div>

                    <div className={`p-5 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`text-xs uppercase tracking-wider mb-2 font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        Top Percentage
                      </p>
                      <p className={`text-3xl font-semibold font-sans mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {contestData.contestTopPercentage.toFixed(1)}%
                      </p>
                      <p className={`text-xs font-sans ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        of {(contestData.totalParticipants / 1000).toFixed(0)}k users
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contest History - Latest First */}
                <div>
                  <h3 className={`text-xl font-normal mb-6 font-serif ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Recent Contests
                  </h3>
                  <div className="space-y-3">
                    {contestData.contestParticipation.slice().reverse().map((contest, idx) => {
                      const TrendIcon = contest.trendDirection === 'UP' ? TrendingUp : 
                                       contest.trendDirection === 'DOWN' ? TrendingDown : Minus;
                      const trendColor = contest.trendDirection === 'UP' ? 'text-emerald-500' : 
                                        contest.trendDirection === 'DOWN' ? 'text-red-500' : 'text-gray-500';
                      
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border hover:border-emerald-500/50 transition-colors ${
                            theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2 flex-1">
                              <h4 className={`text-sm font-medium font-sans ${
                                theme === 'dark' ? 'text-white' : 'text-black'
                              }`}>
                                {contest.contest.title}
                              </h4>
                              <TrendIcon className={`${trendColor} flex-shrink-0`} size={14} />
                            </div>
                            <p className={`text-xs font-sans ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {new Date(contest.contest.startTime * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-6 text-xs">
                            <div>
                              <span className={`font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Rating: </span>
                              <span className={`font-semibold font-mono ${
                                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                              }`}>
                                {Math.round(contest.rating)}
                              </span>
                            </div>
                            <div>
                              <span className={`font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Rank: </span>
                              <span className={`font-semibold font-mono ${
                                theme === 'dark' ? 'text-white' : 'text-black'
                              }`}>
                                {contest.ranking.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className={`font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Solved: </span>
                              <span className={`font-semibold font-mono ${
                                theme === 'dark' ? 'text-white' : 'text-black'
                              }`}>
                                {contest.problemsSolved}/{contest.totalProblems}
                              </span>
                            </div>
                            {contest.finishTimeInSeconds > 0 && (
                              <div>
                                <span className={`font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Time: </span>
                                <span className={`font-semibold font-mono ${
                                  theme === 'dark' ? 'text-white' : 'text-black'
                                }`}>
                                  {Math.floor(contest.finishTimeInSeconds / 60)}m
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Learning Principles */}
          <div className="mb-16">
            <h2 className={`text-3xl font-normal mb-12 font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Key Learning Principles
            </h2>
            <div className="space-y-6 max-w-3xl">
              {/* Daily Consistency */}
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <Target className="text-emerald-500" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium mb-2 font-sans ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Daily Consistency
                  </h3>
                  <p className={`text-sm font-sans leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Solving at least one problem daily builds pattern recognition and muscle memory. Small consistent efforts compound over time.
                  </p>
                </div>
              </div>

              {/* Deep Understanding */}
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <BookOpen className="text-emerald-500" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium mb-2 font-sans ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Deep Understanding
                  </h3>
                  <p className={`text-sm font-sans leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Don't just memorize solutions. Understand why an approach works, its time complexity, and when to apply it.
                  </p>
                </div>
              </div>

              {/* Pattern Recognition */}
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium mb-2 font-sans ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Pattern Recognition
                  </h3>
                  <p className={`text-sm font-sans leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Learn to recognize common patterns: sliding window, two pointers, DFS/BFS, dynamic programming states, and greedy choices.
                  </p>
                </div>
              </div>

              {/* Review & Reflect */}
              <div className="flex items-start gap-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <Sparkles className="text-emerald-500" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-medium mb-2 font-sans ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Review & Reflect
                  </h3>
                  <p className={`text-sm font-sans leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Revisit old problems. The same problem after a month reveals how much you've grown. Write explanations to solidify understanding.
                  </p>
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
