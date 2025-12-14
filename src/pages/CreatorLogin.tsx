import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { Lock } from 'lucide-react';
import SEO from '../components/SEO';

export default function CreatorLogin() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envUsername = import.meta.env.VITE_CREATOR_USERNAME;
    const envPassword = import.meta.env.VITE_CREATOR_PASSWORD;
    
    if (username === envUsername && password === envPassword) {
      localStorage.setItem('creator_authenticated', 'true');
      localStorage.setItem('creator_auth_time', Date.now().toString());
      setError('');
      navigate('/creator');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <SEO 
        title="Creator Studio - Serverless Content Platform"
        description="Manage your content with Git-based serverless architecture"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Information */}
            <div>
              <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-6 font-sans font-medium">
                  SERVERLESS CONTENT PLATFORM
                </p>
                <h1 className={`text-5xl md:text-6xl font-normal mb-6 font-serif leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  Git-Powered<br />Creator Studio
                </h1>
                <p className={`text-lg font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  A serverless CMS built on GitHub's infrastructure. Write, publish, and manage content 
                  with zero server costs and infinite scalability.
                </p>
              </div>

              {/* Architecture Highlights */}
              <div className="space-y-6 mb-12">
                <div>
                  <h2 className={`text-2xl font-normal mb-6 font-serif ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    How It Works
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className={`p-5 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <span className="text-lg font-bold font-mono">1</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-sans ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          Git-Based Storage
                        </h3>
                        <p className={`text-sm font-sans ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Content stored as markdown files in GitHub repository. Version control included automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <span className="text-lg font-bold font-mono">2</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-sans ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          Automatic Deployment
                        </h3>
                        <p className={`text-sm font-sans ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Push to main branch triggers Vercel rebuild. Content goes live in under 60 seconds.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <span className="text-lg font-bold font-mono">3</span>
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 font-sans ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          Zero Infrastructure
                        </h3>
                        <p className={`text-sm font-sans ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          No databases, no servers, no maintenance. Static files served from edge network globally.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Can Do */}
              <div>
                <h2 className={`text-xl font-normal mb-4 font-serif ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  Creator Capabilities
                </h2>
                <ul className={`space-y-3 font-sans text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    Create and publish blog posts with markdown support
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    Live preview with syntax highlighting
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    Edit existing content with version history
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    Local development mode with auto-discovery
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-emerald-500">✓</span>
                    Production mode commits directly to GitHub
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:sticky lg:top-24">
              <div className={`p-8 rounded-2xl border ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800 backdrop-blur-xl' 
                  : 'bg-white border-gray-200 shadow-xl'
              }`}>
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
                  }`}>
                    <Lock size={32} className="text-emerald-500" />
                  </div>
                </div>
                
                <h2 className={`text-2xl font-serif font-normal text-center mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  Creator Access
                </h2>
                <p className={`text-center text-sm mb-8 font-sans ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Authenticate to access content management
                </p>
                
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                      }`}
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-500 text-sm text-center font-sans">{error}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors font-sans"
                  >
                    Access Creator Studio →
                  </button>
                </form>

                <div className={`mt-6 pt-6 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-xs text-center font-sans ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Secured with environment variables • Zero database storage
                  </p>
                </div>
              </div>

              {/* Tech Stack Badge */}
              <div className={`mt-6 p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className={`text-xs font-mono text-center ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Built with GitHub API • Octokit • React • TypeScript
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
