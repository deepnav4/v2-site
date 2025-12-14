import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import SEO from '../components/SEO';

export default function About() {
  const { theme } = useTheme();
  
  return (
    <>
      <SEO 
        title="About - Navdeep Singh"
        description="Information Technology student at NIT Jalandhar. Passionate about web development, algorithms, and building impactful software solutions."
        url="https://navdeep.dev/about"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container py-12 sm:py-16 md:py-24">
        {/* Header Section */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-4 sm:mb-6 font-sans font-medium">
            ABOUT ME
          </p>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Navdeep Singh
          </h1>
          <p className={`text-lg sm:text-xl mb-6 sm:mb-8 font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            IT Student · Builder · Problem Solver
          </p>
          
          {/* Quick Info Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${
              theme === 'dark' ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <GraduationCap size={20} className="text-emerald-500" />
              <div>
                <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Education
                </p>
                <p className={`font-sans font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  NIT Jalandhar
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${
              theme === 'dark' ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-gray-50'
            }`}>
              <MapPin size={20} className="text-emerald-500" />
              <div>
                <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Location
                </p>
                <p className={`font-sans font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  India
                </p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Introduction */}
          <section>
            <p className={`text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              I'm Navdeep Singh, an Information Technology student at NIT Jalandhar (CGPA: 8.33) who builds scalable web applications 
              and explores full-stack development. I believe in learning by building - from Dockerized microservices to real-time 
              collaborative tools.
            </p>
            
            <p className={`text-base sm:text-lg leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              When I see an interesting technology, I don't just read about it - I build something with it. Whether it's implementing 
              real-time collaboration with WebSockets, containerizing applications with Docker, or creating collaborative whiteboards 
              from scratch using Canvas API. That's what this site is. My lab notebook.
            </p>
          </section>

          <section>
            <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              What Drives Me
            </h2>
            <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed">
              I believe the best way to understand technology is to build it from scratch. When I wanted to understand real-time collaboration, 
              I built SnippetSync with Redis Pub/Sub and WebSockets. When I needed to grasp microservices architecture, I created a Dockerized 
              gym management platform with automated CI/CD pipelines.
            </p>
            
            <p className="leading-relaxed">
              I solve problems by understanding the fundamentals. Whether it's implementing a collaborative whiteboard with Canvas API maintaining 
              60fps or building scalable backends with proper load balancing, I focus on what's actually happening under the hood - the real constraints, 
              the bottlenecks, the trade-offs.
            </p>
            
            <p className="leading-relaxed">
              Competitive programming keeps my problem-solving skills sharp. With 500+ problems solved on LeetCode, I've learned that elegant solutions 
              come from recognizing patterns and thinking algorithmically. It's addictive watching a complex problem break down into simple, 
              efficient logic.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            What I Build
          </h2>
          <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed">
              I've built production-ready applications including a Gym Management System with Dockerized microservices and CI/CD pipelines, 
              SnippetSync - a real-time collaborative code editor with Redis Pub/Sub, and ExceliDraw - a collaborative whiteboard built 
              from scratch using Canvas API with 60fps smooth rendering.
            </p>
            
            <p className="leading-relaxed">
              My projects aren't just tutorials - they solve real problems. RideShare integrates Google Maps for real-time location tracking, 
              and my ChatApp handles group messaging with typing indicators and persistent storage. I've contributed to NIT Jalandhar's 
              Training & Placement website and two conference websites (it1dxpert.org, eaicnitj.com).
            </p>
            
            <p className="leading-relaxed">
              Beyond building, I'm grinding competitive programming with 500+ problems solved on LeetCode and actively participating as a 
              Core Member of CyberNauts & XCEED Technical Clubs, where I've mentored 50+ juniors in web development.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            What I Write About
          </h2>
          <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed">
              I document my journeys of discovery. When I encounter a piece of technology that feels 
              magical or broken, I fall down the rabbit hole of research and experimentation until I 
              understand it completely. Then I write about it.
            </p>
            
            <p className="leading-relaxed">
              Not tutorials. Not guides. Just the story of figuring something out. The confusion, the 
              dead ends, the moment it finally clicks. If explaining something forces me to understand 
              it at a deeper level, then it was worth writing.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Right Now
          </h2>
          <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed">
              Currently pursuing B.Tech in Information Technology at NIT Jalandhar (CGPA: 8.33). Serving as a Core Member of 
              CyberNauts & XCEED Technical Clubs, organizing workshops and mentoring 50+ juniors. Also volunteering with NSS on 
              social impact projects.
            </p>
            
            <p className="leading-relaxed">
              Actively contributing to college infrastructure projects and conference websites while solving 500+ competitive programming 
              problems. Always looking for opportunities to build, learn, and collaborate on interesting technical challenges.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            My Stack
          </h2>
          <div className={`space-y-2 sm:space-y-3 text-sm sm:text-base font-sans ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Languages:</strong> JavaScript, TypeScript, C++, Python</p>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Frontend:</strong> React.js, Next.js, Tailwind CSS, Redux</p>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Backend:</strong> Node.js, Express.js, Socket.io, REST APIs</p>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Databases:</strong> MongoDB, PostgreSQL, Prisma, Redis</p>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>DevOps:</strong> Docker, Kubernetes, NGINX, GitHub Actions, AWS EC2</p>
            <p className="leading-relaxed"><strong className={theme === 'dark' ? 'text-white' : 'text-black'}>Tools:</strong> Git, Canvas API, WebSockets, Google Maps API, JWT</p>
            
            <p className={`text-xs sm:text-sm italic mt-4 sm:mt-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Focused on building scalable, production-ready applications with modern web technologies.
            </p>
          </div>
        </section>

        <section>
          <h2 className={`text-2xl sm:text-3xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Connect
          </h2>
          <div className={`space-y-4 sm:space-y-6 text-sm sm:text-base font-sans mb-6 sm:mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="leading-relaxed">
              Find me at <code className={`px-2 py-1 rounded font-mono text-sm ${theme === 'dark' ? 'bg-gray-900 text-emerald-400' : 'bg-gray-100 text-emerald-600'}`}>@deepnav4</code> on most platforms.
            </p>
            
            <p className="leading-relaxed">
              Up for technical discussions, debugging weird problems, or talking about why a certain 
              approach is fundamentally broken. I won't judge your tech choices.
            </p>
            
            <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Fair warning: I respond with excessive enthusiasm about IT and CS fundamentals.
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <h3 className={`text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              WHERE TO FIND ME
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <a href="https://github.com/deepnav4" target="_blank" rel="noopener noreferrer"
                 className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all font-sans ${
                   theme === 'dark' 
                     ? 'border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/50' 
                     : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                 }`}>
                <Github size={20} className="text-emerald-500 sm:w-6 sm:h-6" />
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>GitHub</div>
                  <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>@deepnav4</div>
                </div>
              </a>
              
              <a href="https://linkedin.com/in/navdeep-singh-1554a8321" target="_blank" rel="noopener noreferrer"
                 className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all font-sans ${
                   theme === 'dark' 
                     ? 'border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/50' 
                     : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                 }`}>
                <Linkedin size={20} className="text-emerald-500 sm:w-6 sm:h-6" />
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LinkedIn</div>
                  <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Connect</div>
                </div>
              </a>
              
              <a href="tel:+919478619241"
                 className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all font-sans ${
                   theme === 'dark' 
                     ? 'border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/50' 
                     : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                 }`}>
                <Twitter size={20} className="text-emerald-500 sm:w-6 sm:h-6" />
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Phone</div>
                  <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>+91-9478619241</div>
                </div>
              </a>
              
              <a href="mailto:workwithdeepnav@gmail.com"
                 className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all font-sans ${
                   theme === 'dark' 
                     ? 'border-gray-800 hover:border-gray-700 bg-gray-900/30 hover:bg-gray-900/50' 
                     : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100'
                 }`}>
                <Mail size={20} className="text-emerald-500 sm:w-6 sm:h-6" />
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Email</div>
                  <div className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Get in touch</div>
                </div>
              </a>
            </div>
          </div>
        </section>

          <section className={`border-t pt-12 sm:pt-16 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              MORE TO EXPLORE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Link to="/blog" className={`p-4 sm:p-6 rounded-lg border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-emerald-500/30 bg-gray-900/30' 
                  : 'border-gray-200 hover:border-emerald-500/30 bg-gray-50'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Blog</h3>
                <p className={`text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Notes on systems, algorithms, and things worth remembering
                </p>
              </Link>
              
              <Link to="/projects" className={`p-4 sm:p-6 rounded-lg border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-emerald-500/30 bg-gray-900/30' 
                  : 'border-gray-200 hover:border-emerald-500/30 bg-gray-50'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold mb-2 font-sans ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Projects</h3>
                <p className={`text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Things I've built while asking "what if?"
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
