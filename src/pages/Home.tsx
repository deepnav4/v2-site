import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { blogPosts } from '../data/blogPosts';
import { projects } from '../data/projects';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getContributionData } from '../services/githubService';
import { ArrowRight, Code2 } from 'lucide-react';
import SEO from '../components/SEO';

// Custom hook for scroll reveal animations
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  const { theme } = useTheme();
  const latestPosts = blogPosts.slice(0, 3);
  const featuredProjects = projects.filter(p => p.category === 'featured').slice(0, 3);

  const [contributionData, setContributionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<{ count: number; date: string } | null>(null);

  // Section refs for scroll animations
  const heroRef = useScrollReveal(0.1);
  const blogRef = useScrollReveal(0.1);
  const projectsRef = useScrollReveal(0.1);
  const githubRef = useScrollReveal(0.1);

  useEffect(() => {
    async function fetchData() {
      const data = await getContributionData('deepnav4');
      setContributionData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const calendarData = useMemo(() => {
    if (!contributionData) return { weeks: [], monthLabels: [] };

    const weeksWithGaps: any[] = [];
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    contributionData.weeks.forEach((week: any) => {
      const firstDay = new Date(week.contributionDays[0].date);
      const monthNum = firstDay.getMonth();

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
        <section
          ref={heroRef.ref}
          className={`container pt-20 pb-12 sm:py-12 md:py-20 relative reveal ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="max-w-5xl">
            {/* Subtle label */}
            {/* <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 reveal stagger-1 ${heroRef.isVisible ? 'visible' : ''} ${
              theme === 'dark'
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-emerald-500/5 border-emerald-500/20'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className={`text-xs font-medium tracking-wide ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                Open to opportunities
              </span>
            </div> */}

            <p className={`text-[10px] sm:text-sm mb-6 sm:mb-8 font-mono tracking-wide whitespace-nowrap reveal stagger-2 ${heroRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Information Technology Student <span className="mx-1 sm:mx-2 text-emerald-500">/</span> Developer <span className="mx-1 sm:mx-2 text-emerald-500">/</span> Writer
            </p>

            <h1 className={`text-[42px] sm:text-[56px] md:text-[68px] lg:text-[88px] xl:text-[100px] font-normal mb-8 leading-[1.05] font-serif tracking-tight reveal stagger-3 ${heroRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              I experiment with things
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              that fascinate me.
            </h1>

            <p className={`text-sm sm:text-base mb-12 max-w-2xl font-sans leading-relaxed reveal stagger-4 ${heroRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              I build full-stack applications with Docker, Redis, and real-time collaboration.
              Welcome to my lab notebook where I share experiments in software, design, and technology.
            </p>

            {/* Profile info with subtle animation */}
            <div className={`flex items-center gap-4 sm:gap-6 mb-12 reveal stagger-5 ${heroRef.isVisible ? 'visible' : ''}`}>
              {/* <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-white'
                  : 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-black'
              }`}>
                N
              </div> */}
              <div>
                <p className={`text-base font-thin font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Navdeep Singh
                </p>
                <p className={`text-sm font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  Information Technology @ NIT Jalandhar
                </p>
              </div>
            </div>

            {/* CTA Buttons with premium hover */}
            <div className={`flex flex-row gap-3 sm:gap-4 reveal stagger-6 ${heroRef.isVisible ? 'visible' : ''}`}>
              <a
                href="https://drive.google.com/file/d/1sxmW7jDX1WN7VbJOK3_y95XuHb59iooh/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative px-6 py-3 rounded-xl font-sans font-medium inline-flex items-center justify-center gap-2 text-sm overflow-hidden transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                    : 'bg-black text-white hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]'
                }`}
              >
                <span className="relative z-10">View Resume</span>
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                to="/about"
                className={`group px-6 py-3 border rounded-xl font-sans font-medium text-center text-sm transition-all duration-300 inline-flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'border-gray-800 text-gray-300 hover:border-emerald-500/50 hover:text-white hover:bg-emerald-500/5'
                    : 'border-gray-300 text-gray-700 hover:border-emerald-500/50 hover:text-black hover:bg-emerald-500/5'
                }`}
              >
                About me
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section
          ref={blogRef.ref}
          className={`container py-16 sm:py-20 reveal ${blogRef.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8 sm:mb-10">
            <div className={`inline-flex items-center gap-2 mb-4 reveal stagger-1 ${blogRef.isVisible ? 'visible' : ''}`}>
              {/* <Sparkles size={14} className="text-emerald-500" /> */}
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-sans font-medium">
                LATE NIGHT THINKING
              </p>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 font-serif tracking-tight reveal stagger-2 ${blogRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Things I've figured out
            </h2>
            <p className={`text-sm sm:text-base font-sans reveal stagger-3 ${blogRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Notes on systems, algorithms, and patterns worth remembering
            </p>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {latestPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className={`group block card-premium rounded-xl p-5 sm:p-6 reveal ${blogRef.isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-3 text-xs sm:text-sm mb-3 font-sans ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <span>{post.date}</span>
                      <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                      <span className="font-mono text-emerald-500">{post.category}</span>
                    </div>
                    <h3 className={`text-lg sm:text-xl font-normal mb-2 transition-colors duration-300 font-serif group-hover:text-emerald-500 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {post.title}
                    </h3>
                    <p className={`text-sm sm:text-base font-sans line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight size={20} className={`flex-shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-1 ${
                    theme === 'dark' ? 'text-gray-600 group-hover:text-emerald-500' : 'text-gray-400 group-hover:text-emerald-500'
                  }`} />
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/blog"
            className={`group inline-flex items-center gap-2 mt-8 text-sm sm:text-base font-medium font-sans transition-all duration-300 ${
              theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
          >
            View all posts
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          </Link>
        </section>

        {/* Projects Section */}
        <section
          ref={projectsRef.ref}
          className={`container py-16 sm:py-20 reveal ${projectsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8 sm:mb-10">
            <div className={`inline-flex items-center gap-2 mb-4 reveal stagger-1 ${projectsRef.isVisible ? 'visible' : ''}`}>
              <Code2 size={14} className="text-emerald-500" />
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-sans font-medium">
                2AM QUESTIONS
              </p>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 font-serif tracking-tight reveal stagger-2 ${projectsRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              What I've built
            </h2>
            <p className={`text-sm sm:text-base font-sans reveal stagger-3 ${projectsRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Experiments that started with 'I wonder if...'
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className={`group card-premium rounded-xl p-5 sm:p-6 reveal ${projectsRef.isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs uppercase tracking-wider font-medium font-sans px-2 py-1 rounded ${
                    theme === 'dark'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {project.category}
                  </span>
                  <span className={`text-xs font-mono ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    {project.date}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-normal mb-3 transition-colors duration-300 font-serif ${
                  theme === 'dark' ? 'text-white group-hover:text-emerald-400' : 'text-black group-hover:text-emerald-600'
                }`}>
                  {project.title}
                </h3>
                <p className={`text-sm mb-4 font-sans line-clamp-2 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className={`text-xs px-2 py-1 rounded-md font-mono transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-900 text-gray-400 border border-gray-800'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={`flex items-center gap-2 text-sm font-sans font-medium transition-all duration-300 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  <span>View details</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/projects"
            className={`group inline-flex items-center gap-2 mt-8 text-sm sm:text-base font-medium font-sans transition-all duration-300 ${
              theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
          >
            View all projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          </Link>
        </section>

        {/* GitHub Contributions */}
        <section
          ref={githubRef.ref}
          className={`container py-16 sm:py-20 reveal ${githubRef.isVisible ? 'visible' : ''}`}
        >
          <div className="mb-8 sm:mb-10">
            <div className={`inline-flex items-center gap-2 mb-4 reveal stagger-1 ${githubRef.isVisible ? 'visible' : ''}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-sans font-medium">
                CONSISTENCY &gt; INTENSITY
              </p>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 font-serif tracking-tight reveal stagger-2 ${githubRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              The work shows up here
            </h2>
            <p className={`text-sm sm:text-base font-sans reveal stagger-3 ${githubRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              When I remember to push
            </p>
          </div>

          {/* Contribution Heatmap */}
          {loading ? (
            <div className={`py-12 reveal stagger-4 ${githubRef.isVisible ? 'visible' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  Loading contribution data...
                </span>
              </div>
            </div>
          ) : contributionData ? (
            <div className={`pb-6 relative reveal stagger-4 ${githubRef.isVisible ? 'visible' : ''}`}>
              {/* Month labels row - hidden on mobile */}
              <div className="hidden sm:flex gap-[3px] mb-2 pl-[60px]">
                {calendarData.weeks.map((week: any, weekIndex: number) => {
                  const monthLabel = calendarData.monthLabels.find((label: any) => label.weekIndex === weekIndex);
                  return (
                    <div key={weekIndex} className={week.isGap ? "w-3" : "w-3"}>
                      {monthLabel && (
                        <div className={`text-[11px] font-mono font-semibold ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {monthLabel.month}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Contribution grid */}
              <div className="flex gap-[2px] sm:gap-[3px] overflow-x-auto pb-2">
                {/* Day labels */}
                <div className="flex flex-col gap-[2px] sm:gap-[3px] justify-around flex-shrink-0 pr-1 sm:pr-2">
                  <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>Sun</div>
                  <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>Mon</div>
                  <div className="h-[10px] sm:h-3"></div>
                  <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>Wed</div>
                  <div className="h-[10px] sm:h-3"></div>
                  <div className={`text-[8px] sm:text-[11px] font-mono font-medium h-[10px] sm:h-3 flex items-center ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>Fri</div>
                  <div className="h-[10px] sm:h-3"></div>
                </div>

                {/* Week columns */}
                {calendarData.weeks.map((week: any, weekIndex: number) => {
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
                          bgColor = theme === 'dark' ? '#1a1a1a' : '#ebedf0';
                        }

                        return (
                          <div
                            key={dayIndex}
                            className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-[2px] sm:rounded-[3px] transition-all duration-200 cursor-pointer ${
                              theme === 'dark'
                                ? 'hover:ring-2 hover:ring-emerald-400/50 hover:ring-offset-1 hover:ring-offset-black'
                                : 'hover:ring-2 hover:ring-emerald-500/50 hover:ring-offset-1 hover:ring-offset-white'
                            }`}
                            style={{
                              backgroundColor: bgColor,
                              boxShadow: count > 0 ? (theme === 'dark' ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 2px rgba(0,0,0,0.1)') : 'none'
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 px-1 gap-3 sm:gap-0">
                <span className={`text-[11px] sm:text-[13px] font-mono transition-all duration-300 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {hoveredDate
                    ? `${hoveredDate.count} contribution${hoveredDate.count !== 1 ? 's' : ''} on ${hoveredDate.date}`
                    : <><AnimatedCounter end={contributionData.totalContributions} /> contributions in the last year</>
                  }
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`text-[10px] sm:text-[11px] font-mono font-medium ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>Less</span>
                  <div className="flex gap-1 sm:gap-1.5">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-transform hover:scale-125"
                        style={{
                          backgroundColor: level === 0
                            ? (theme === 'dark' ? '#1a1a1a' : '#ebedf0')
                            : level === 1
                            ? 'rgba(16, 185, 129, 0.25)'
                            : level === 2
                            ? 'rgba(16, 185, 129, 0.45)'
                            : level === 3
                            ? 'rgba(16, 185, 129, 0.65)'
                            : 'rgba(16, 185, 129, 0.9)',
                          boxShadow: level > 0 ? (theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)') : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-mono ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                  }`}>More</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`py-12 text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Failed to load contribution data. Check console for details.
            </div>
          )}
        </section>

        {/* Competitive Programming - Simple */}
        <section className="container py-16 sm:py-20">
          <p className={`text-lg sm:text-xl max-w-2xl font-serif leading-relaxed mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Generate your personalized{' '}
            <a
              href="https://codeforces.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 hover:underline"
            >
              Codeforces
            </a>
            {' '}
            ladder. Track your progress, identify weak areas, and climb the ranks with a customized practice plan based on your performance and goals.
          </p>
          <Link
            to="/competitive"
            className={`group inline-flex items-center gap-2 text-sm font-sans transition-colors ${
              theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Climb Your Ladder
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </section>


      </div>
    </>
  );
}
