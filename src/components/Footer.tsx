import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../store/themeStore';
import { useState, useEffect } from 'react';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [sessionTime, setSessionTime] = useState('00:00:00');
  
  useEffect(() => {
    const startTime = Date.now();
    
    const updateSessionTime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setSessionTime(`${hours}:${minutes}:${seconds}`);
    };
    
    const interval = setInterval(updateSessionTime, 1000);
    updateSessionTime();
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <footer className={`border-t mt-32 ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200'}`}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="mb-6">
                <h3 className={`text-2xl font-normal mb-3 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Navdeep Singh
                </h3>
                <p className={`text-sm leading-relaxed max-w-sm font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Information Technology student at NIT Jalandhar building things that matter. Experimenting with code, algorithms, and design.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-6">
                <a 
                  href="https://github.com/deepnav4" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-sm font-sans transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/navdeep-singh-1554a8321" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-sm font-sans transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  LinkedIn
                </a>
                <a 
                  href="mailto:workwithdeepnav@gmail.com" 
                  className={`text-sm font-sans transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Email
                </a>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
                {/* Explore */}
                <div>
                  <h4 className={`text-xs uppercase tracking-wider mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Explore
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Home
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/about" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        About
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/projects" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Projects
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Content */}
                <div>
                  <h4 className={`text-xs uppercase tracking-wider mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Content
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/blog" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Writing
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/tags" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Tags
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Tools */}
                <div>
                  <h4 className={`text-xs uppercase tracking-wider mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Tools
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/competitive" 
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        CP Stats
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="https://v2.screenager.dev" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-sans transition-colors inline-flex items-center gap-1 group ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Previous Site
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className={`py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200'
        }`}>
          <p className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
            © {currentYear} Navdeep Singh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span 
              className={`text-xs font-mono ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
              }`}
            >
              Session: {sessionTime}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
