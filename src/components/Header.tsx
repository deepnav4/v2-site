import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Briefcase, FileText, BarChart3, User, Moon, Sun, Search, Clock, Edit3, Menu, X } from 'lucide-react';
import { useTheme } from '../store/themeStore';
import UniversalSearch from './UniversalSearch';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 border-b ${
        theme === 'dark' ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur-sm`}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <Link to="/" className={`text-lg sm:text-xl font-serif font-medium ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            navdeep.site
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Sun className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-black'
              }`}
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-90 scale-90' : 'rotate-0 scale-100'
              }`}>
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`${
            theme === 'dark' ? 'bg-black/98' : 'bg-white/98'
          }`}>
            <nav className="px-6 py-6 space-y-2">
              {/* Navigation Links */}
              <div className="space-y-1 mb-6">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <Home className={`w-5 h-5 transition-transform duration-200 ${isActive('/') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/') ? '→ ' : ''}Home</span>
                </Link>

                <Link
                  to="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/projects')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 transition-transform duration-200 ${isActive('/projects') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/projects') ? '→ ' : ''}Projects</span>
                </Link>

                <Link
                  to="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/blog')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <FileText className={`w-5 h-5 transition-transform duration-200 ${isActive('/blog') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/blog') ? '→ ' : ''}Blog</span>
                </Link>

                <Link
                  to="/competitive"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/competitive')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <BarChart3 className={`w-5 h-5 transition-transform duration-200 ${isActive('/competitive') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/competitive') ? '→ ' : ''}Competitive</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/about')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <User className={`w-5 h-5 transition-transform duration-200 ${isActive('/about') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/about') ? '→ ' : ''}About</span>
                </Link>

                <Link
                  to="/creator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/creator')
                      ? theme === 'dark'
                        ? 'bg-white/5 text-white'
                        : 'bg-black/5 text-black'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white active:scale-95'
                        : 'text-gray-600 hover:text-black active:scale-95'
                  }`}
                >
                  <Edit3 className={`w-5 h-5 transition-transform duration-200 ${isActive('/creator') ? '' : 'group-hover:scale-110'}`} strokeWidth={1.5} />
                  <span className="font-sans text-base tracking-tight">{isActive('/creator') ? '→ ' : ''}Creator</span>
                </Link>
              </div>

              {/* Utility Buttons */}
              <div className={`pt-4 border-t space-y-1 ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group flex items-center justify-center px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-95 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
                </button>

                <a
                  href="https://v2.navdeep.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-95 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Clock className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.5} />
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-4 top-0 h-screen w-20 flex-col items-center py-8 z-50 group">
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

    {/* Universal Search Modal */}
    {isSearchOpen && (
      <UniversalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    )}
    </>
  );
}
