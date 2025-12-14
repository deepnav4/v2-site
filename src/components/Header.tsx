import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Briefcase, FileText, BarChart3, User, Moon, Sun, Search, Clock, Edit3, ExternalLink } from 'lucide-react';
import { useTheme } from '../store/themeStore';
import UniversalSearch from './UniversalSearch';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-4 top-0 h-screen w-20 flex flex-col items-center py-8 z-50 group">
      <div className={`absolute inset-0 border-r opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r-2xl ${
        theme === 'dark' 
          ? 'bg-[#0a0a0a] border-[#1a1a1a]' 
          : 'bg-gray-50 border-gray-200'
      }`}></div>
      {/* Main Navigation Icons */}
      <nav className="relative flex-1 flex flex-col items-center gap-2 mt-8">
        <Link 
          to="/" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <Link 
          to="/projects" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/projects') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Projects"
        >
          <Briefcase className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <Link 
          to="/blog" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/blog') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Blog"
        >
          <FileText className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <Link 
          to="/competitive" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/competitive') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Competitive Programming"
        >
          <BarChart3 className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <Link 
          to="/about" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/about') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="About"
        >
          <User className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <Link 
          to="/creator" 
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            isActive('/creator') 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : theme === 'dark'
                ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
                : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Creator"
        >
          <Edit3 className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        {/* <a 
          href="https://v2.navdeep.site" 
          target="_blank"
          rel="noopener noreferrer"
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-500 hover:bg-[#151515] hover:text-emerald-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-500'
          }`}
          title="Previous Site"
        >
          <ExternalLink className="w-5 h-5" strokeWidth={1.5} />
        </a> */}
      </nav>

      {/* Bottom Utility Icons */}
      <div className="relative flex flex-col items-center gap-2 mb-4">
        <div className={`w-10 h-px mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-200'
        }`}></div>
        
        <button 
          onClick={(e) => toggleTheme(e)}
          className={`relative p-3 rounded-xl transition-all duration-200 overflow-hidden ${
            theme === 'dark'
              ? 'text-gray-600 hover:bg-[#151515] hover:text-gray-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Sun className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>

        <button 
          onClick={() => setIsSearchOpen(true)}
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-600 hover:bg-[#151515] hover:text-gray-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          title="Search (⌘K)"
        >
          <Search className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <a 
          href="https://v2.navdeep.site"
          target="_blank"
          rel="noopener noreferrer"
          className={`relative p-3 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-gray-600 hover:bg-[#151515] hover:text-gray-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
          title="History"
        >
          <Clock className="w-5 h-5" strokeWidth={1.5} />
        </a>
      </div>

      {/* Universal Search Modal */}
      {isSearchOpen && (
        <UniversalSearch 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </aside>
  );
}
