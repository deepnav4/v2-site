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
    <footer className={`border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200'}`}>
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="mb-6 sm:mb-8">
                <h3 className={`text-xl sm:text-2xl font-normal mb-2 sm:mb-3 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Navdeep Singh
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed max-w-sm font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Information Technology student at NIT Jalandhar building things that matter. Experimenting with code, algorithms, and design.
                </p>
              </div>
              
              {/* Social Links - Mobile optimized with better touch targets */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <a 
                  href="https://github.com/deepnav4" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-xs sm:text-sm font-sans transition-colors py-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/navdeep-singh-1554a8321" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-xs sm:text-sm font-sans transition-colors py-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  LinkedIn
                </a>
                <a 
                  href="mailto:workwithdeepnav@gmail.com" 
                  className={`text-xs sm:text-sm font-sans transition-colors py-2 ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Email
                </a>
              </div>
            </div>
            
            {/* Navigation Links - Improved mobile layout */}
            <div className="lg:col-span-7 mt-4 sm:mt-0">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
                {/* Explore */}
                <div>
                  <h4 className={`text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Explore
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link 
                        to="/" 
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Home
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/about" 
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        About
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/projects" 
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Projects
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Content */}
                <div>
                  <h4 className={`text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Content
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link 
                        to="/blog" 
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Writing
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Tools */}
                <div>
                  <h4 className={`text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 font-sans font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Tools
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link 
                        to="/competitive" 
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        CP Stats
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="https://v2.navdeep.site" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs sm:text-sm font-sans transition-colors inline-flex items-center gap-1 group py-1 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Previous Site
                        <ArrowUpRight size={10} className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Enhanced mobile layout */}
        <div className={`py-4 sm:py-6 border-t flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4 ${
          theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200'
        }`}>
          <p className={`text-[10px] sm:text-xs font-mono text-center sm:text-left ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
            © {currentYear} Navdeep Singh. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span 
              className={`text-[10px] sm:text-xs font-mono ${
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
