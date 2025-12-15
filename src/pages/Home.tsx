import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { blogPosts } from '../data/blogPosts';
import { projects } from '../data/projects';
import { useState, useEffect, useMemo } from 'react';
import { getContributionData } from '../services/githubService';
import SEO from '../components/SEO';

export default function Home() {
  const { theme } = useTheme();
  const latestPosts = blogPosts.slice(0, 3);
  const featuredProjects = projects.filter(p => p.category === 'featured').slice(0, 3);
  
  const [contributionData, setContributionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<{ count: number; date: string } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getContributionData('deepnav4'); // Replace with actual username
      setContributionData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const calendarData = useMemo(() => {
    if (!contributionData) return { weeks: [], monthLabels: [] };
    
    // Add gaps between months
    const weeksWithGaps: any[] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    contributionData.weeks.forEach((week: any) => {
      const firstDay = new Date(week.contributionDays[0].date);
      const monthNum = firstDay.getMonth();
      
      // If new month starts, add a gap (empty week) before it
      if (monthNum !== lastMonth && lastMonth !== -1) {
        weeksWithGaps.push({ contributionDays: [], isGap: true });
      }
      
      weeksWithGaps.push(week);
      
      if (monthNum !== lastMonth) {
        monthLabels.push({
          month: firstDay.toLocaleString('en-US', { month: 'short' }),
          weekIndex: weeksWithGaps.length - 1
        });
        lastMonth = monthNum;
      }
    });
    
    return { weeks: weeksWithGaps, monthLabels };
  }, [contributionData]);

  return (
    <>
      <SEO 
        title="Navdeep Singh - Software Developer & Student"
        description="Information Technology student at NIT Jalandhar. Building web applications, exploring algorithms, and sharing knowledge through code."
        url="https://navdeep.site"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className="container py-12 sm:py-8 md:py-12">
        <div className="max-w-5xl py-8 md:px-0">
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-mono tracking-wide">
            Information Technology Student <br className="sm:hidden" /> <span className="hidden sm:inline">/ </span>Developer / Writer
          </p>
          
          <h1 className={`text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl 2xl:text-8xl font-normal mb-6 sm:mb-8 leading-tight font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            I experiment with things<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>that fascinate me.
          </h1>
          
          <p className={`text-sm sm:text-base mb-12 sm:mb-12 max-w-2xl font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            I build full-stack applications with Docker, Redis, and real-time collaboration. Welcome to my lab notebook where I share experiments in software, design, and technology.
          </p>
          
          <div className="flex items-center gap-4 sm:gap-6 mb-12 sm:mb-12">
            <div>
              <p className={`text-sm sm:text-base font-semibold font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Navdeep Singh</p>
              <p className="text-xs sm:text-sm text-gray-500 font-sans">Information Technology @ NIT Jalandhar</p>
            </div>
          </div>
          
          <div className="flex flex-row gap-2 sm:gap-4 max-w-[260px] sm:max-w-none">
            <a 
              href="https://drive.google.com/file/d/1eHJiTlWrVIQ0Bp_LMxIZODbDuqINp9F3/view" 
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 sm:flex-none sm:px-6 px-2 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-sans font-medium inline-flex items-center justify-center gap-1 text-xs sm:text-base ${
                theme === 'dark' 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Resume
              <span className="text-sm sm:text-lg">→</span>
            </a>
            <Link 
              to="/about" 
              className={`flex-1 sm:flex-none sm:px-6 px-2 py-2.5 sm:py-3 border rounded-lg transition-all duration-200 font-sans font-medium text-center text-xs sm:text-base ${
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-black'
              }`}
            >
              About me
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="container py-12 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">LATE NIGHT THINKING</p>
          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Things I've figured out</h2>
          <p className={`text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Notes on systems, algorithms, and patterns worth remembering</p>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {latestPosts.map(post => (
            <Link 
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block card hover:shadow-sm hover:border-emerald-500/30"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className={`text-xs sm:text-sm mb-2 font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {post.date} · <span className="font-mono">{post.category}</span>
                  </div>
                  <h3 className={`text-base sm:text-lg md:text-xl font-normal mb-2 hover:text-emerald-500 transition-colors font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm sm:text-base font-sans line-clamp-2 sm:line-clamp-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{post.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/blog" className="inline-block mt-6 sm:mt-8 text-sm sm:text-base text-emerald-500 hover:text-emerald-400 font-medium font-sans">
          View all posts →
        </Link>
      </section>

      {/* Projects Section */}
      <section className="container py-12 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">2AM QUESTIONS</p>
          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>What I've built</h2>
          <p className={`text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Experiments that started with 'I wonder if...'</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProjects.map(project => (
            <Link 
              key={project.id} 
              to={`/projects/${project.slug}`}
              className="card hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <div className="mb-3 sm:mb-4">
                <span className={`text-xs uppercase tracking-wider font-medium font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {project.category}
                </span>
                <span className={`text-xs ml-2 font-sans ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>{project.date}</span>
              </div>
              <h3 className={`text-sm sm:text-base md:text-lg font-normal mb-2 sm:mb-3 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{project.title}</h3>
              <p className={`text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-sans line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {project.technologies.slice(0, 3).map(tech => (
                  <span key={tech} className={`text-[10px] sm:text-xs px-2 py-1 rounded border font-mono ${
                    theme === 'dark' 
                      ? 'bg-gray-900 text-gray-400 border-gray-800' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-emerald-500 hover:text-emerald-400 font-sans font-medium">
                  View details →
                </span>
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/projects" className="inline-block mt-6 sm:mt-8 text-sm sm:text-base text-emerald-500 hover:text-emerald-400 font-medium font-sans">
          View all projects →
        </Link>
      </section>

      {/* GitHub Contributions */}
      <section className="container py-12 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">CONSISTENCY &gt; INTENSITY</p>
          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>The work shows up here</h2>
          <p className={`text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>When I remember to push</p>
        </div>
        
        {/* Contribution Heatmap */}
        {loading ? (
          <div className={`text-center py-12 text-xs sm:text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Loading contribution data...
          </div>
        ) : contributionData ? (
          <div className="pb-6 relative">
            {/* Month labels row - hidden on mobile */}
            <div className="hidden sm:flex gap-[3px] mb-2 pl-[60px]">
              {calendarData.weeks.map((week: any, weekIndex: number) => {
                const monthLabel = calendarData.monthLabels.find((label: any) => label.weekIndex === weekIndex);
                return (
                  <div key={weekIndex} className={week.isGap ? "w-3" : "w-3"}>
                    {monthLabel && (
                      <div className={`text-[11px] font-mono font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {monthLabel.month}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contribution grid - smaller on mobile */}
            <div className="flex gap-[2px] sm:gap-[3px] overflow-x-auto pb-2">
              {/* Day labels - smaller on mobile */}
              <div className="flex flex-col gap-[2px] sm:gap-[3px] justify-around flex-shrink-0 pr-1 sm:pr-2">
                <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Sun</div>
                <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Mon</div>
                <div className="h-[10px] sm:h-3"></div>
                <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Wed</div>
                <div className="h-[10px] sm:h-3"></div>
                <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Fri</div>
                <div className="h-[10px] sm:h-3"></div>
              </div>

              {/* Week columns - smaller squares on mobile */}
              {calendarData.weeks.map((week: any, weekIndex: number) => {
                // If it's a gap week, render empty column
                if (week.isGap) {
                  return <div key={weekIndex} className="w-[10px] sm:w-3" />;
                }
                
                return (
                  <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-[3px]">
                    {week.contributionDays.map((day: any, dayIndex: number) => {
                      const count = day.contributionCount;
                      const date = new Date(day.date);
                      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      
                      let bgColor = day.color;
                      if (count === 0) {
                        bgColor = theme === 'dark' ? '#2d333b' : '#ebedf0';
                      }
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] sm:rounded-[3px] transition-all duration-150 ${
                            theme === 'dark' 
                              ? 'hover:ring-1 sm:hover:ring-2 hover:ring-emerald-400 hover:ring-offset-black' 
                              : 'hover:ring-1 sm:hover:ring-2 hover:ring-emerald-500 hover:ring-offset-white'
                          }`}
                          style={{ 
                            backgroundColor: bgColor,
                            boxShadow: count > 0 ? (theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)') : 'none'
                          }}
                          onMouseEnter={() => setHoveredDate({ count, date: formattedDate })}
                          onMouseLeave={() => setHoveredDate(null)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 sm:mt-6 px-1 gap-3 sm:gap-0">
                <span className={`text-[11px] sm:text-[13px] font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  {hoveredDate 
                    ? `${hoveredDate.count} contribution${hoveredDate.count !== 1 ? 's' : ''} on ${hoveredDate.date}`
                    : `${contributionData.totalContributions} contributions in the last year`
                  }
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`text-[10px] sm:text-[11px] font-mono font-medium ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>Less</span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div 
                        key={level}
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px]"
                        style={{ 
                          backgroundColor: level === 0 
                            ? (theme === 'dark' ? '#2d333b' : '#ebedf0')
                            : level === 1
                            ? 'rgba(16, 185, 129, 0.25)'
                            : level === 2
                            ? 'rgba(16, 185, 129, 0.45)'
                            : level === 3
                            ? 'rgba(16, 185, 129, 0.65)'
                            : 'rgba(16, 185, 129, 0.85)',
                          boxShadow: level > 0 ? (theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)') : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>More</span>
                </div>
              </div>
          </div>
        ) : (
          <div className={`text-center py-12 text-xs sm:text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Failed to load contribution data. Check console for details.
          </div>
        )}
      </section>

      {/* Competitive Programming */}
      <section className="container py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">ALGORITHMIC THINKING</p>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 sm:mb-6 leading-tight font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Problem solving from<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>first principles
          </h2>
          <p className={`text-base sm:text-lg max-w-3xl leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Daily LeetCode practice challenges have sharpened my approach to breaking down complex problems into fundamental concepts. Over 500+ questions solved, each teaching me to think algorithmically and optimize from the ground up.
          </p>
        </div>

        {/* Simple Two Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 sm:mb-12 max-w-3xl">
          <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              500+ Problems Solved
            </h3>
            <p className={`text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Consistent practice across algorithms, data structures, and problem-solving patterns
            </p>
          </div>

          <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Daily Practice
            </h3>
            <p className={`text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Building strong fundamentals through continuous learning and optimization
            </p>
          </div>
        </div>
      </section>

      {/* Achievements & Activities */}
      <section className="container py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">ACHIEVEMENTS & LEADERSHIP</p>
          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Making an impact</h2>
          <p className={`text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Contributions, competitions, and community work</p>
        </div>
        
        <div className="space-y-6 sm:space-y-8 max-w-3xl">
          <div className={`border-l-2 pl-4 sm:pl-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Core Member - CyberNauts & XCEED
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Organized technical workshops, mentored 50+ juniors in web development, and contributed to NIT Jalandhar's web infrastructure projects.
            </p>
          </div>

          <div className={`border-l-2 pl-4 sm:pl-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Open Source Contributions
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Contributed to NIT Jalandhar's Training & Placement website and 2 conference websites (it1dxpert.org, eaicnitj.com).
            </p>
          </div>

          <div className={`border-l-2 pl-4 sm:pl-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              500+ LeetCode Problems
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Active competitive programmer solving algorithmic challenges and improving problem-solving skills daily.
            </p>
          </div>

          <div className={`border-l-2 pl-4 sm:pl-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              NSS Volunteer
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Participated in campus social impact projects and community service initiatives at NIT Jalandhar.
            </p>
          </div>
        </div>
      </section>


    </div>
    </>
  );
}
