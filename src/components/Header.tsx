import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, BarChart3, User, Moon, Sun, Search, ExternalLink, Edit3, Menu, X } from 'lucide-react';
import { useTheme } from '../store/themeStore';
import UniversalSearch from './UniversalSearch';
import AnimatedIcon from './AnimatedIcon';
import homeIcon from '../assets/lottie/home.json';
import assignmentIcon from '../assets/lottie/assignment.json';
import workIcon from '../assets/lottie/work.json';
import graphIcon from '../assets/lottie/graph.json';
import profileIcon from '../assets/lottie/profile.json';
import searchIcon from '../assets/lottie/search.json';
import clockIcon from '../assets/lottie/clock.json';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-sm bg-black/20'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

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
        <div className={`overflow-hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className={`px-4 py-4 ${
            theme === 'dark' ? 'bg-black' : 'bg-white'
          }`}>
            {/* Navigation Links with staggered animation */}
            <div className="space-y-1">
              {[
                { to: '/', icon: Home, label: 'Home' },
                { to: '/projects', icon: Briefcase, label: 'Projects' },
                { to: '/blog', icon: FileText, label: 'Blog' },
                { to: '/competitive', icon: BarChart3, label: 'Competitive' },
                { to: '/about', icon: User, label: 'About' },
                { to: '/creator', icon: Edit3, label: 'Creator' },
              ].map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    isActive(item.to)
                      ? 'text-emerald-500'
                      : theme === 'dark'
                        ? 'text-gray-400 active:text-white'
                        : 'text-gray-600 active:text-black'
                  }`}
                  style={{
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-poppins text-sm font-normal">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider + Utility Row */}
            <div
              className={`mt-4 pt-4 border-t flex items-center gap-2 ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}
              style={{
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(10px)',
                opacity: isMobileMenuOpen ? 1 : 0,
                transitionDelay: isMobileMenuOpen ? '300ms' : '0ms',
                transitionDuration: '300ms',
                transitionProperty: 'transform, opacity',
              }}
            >
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 active:text-white'
                    : 'text-gray-600 active:text-black'
                }`}
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-poppins font-normal">Search</span>
              </button>

              <a
                href="https://v2.navdeep.site"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 active:text-white'
                    : 'text-gray-600 active:text-black'
                }`}
              >
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-poppins font-normal">Previous Site</span>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center z-50 group">
        {/* Background container - only visible on hover */}
        <div className={`absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-[#0a0a0a]/90 border border-[#1a1a1a] backdrop-blur-sm'
            : 'bg-white/90 border border-gray-200 backdrop-blur-sm'
        }`}></div>

        {/* Main Navigation Icons */}
        <nav className="relative flex flex-col items-center gap-1">
          <Link
            to="/"
            className={`relative p-3 rounded-xl transition-all duration-200 group ${
              isActive('/')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="Home"
          >
            <AnimatedIcon src={homeIcon} size={24} className="w-6 h-6" trigger="hover" isActive={isActive('/')} theme={theme} />
          </Link>

          <Link
            to="/projects"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              isActive('/projects')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="Projects"
          >
            <AnimatedIcon src={workIcon} size={24} className="w-6 h-6" trigger="hover" isActive={isActive('/projects')} theme={theme} />
          </Link>

          <Link
            to="/blog"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              isActive('/blog')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="Blog"
          >
            <AnimatedIcon src={assignmentIcon} size={24} className="w-6 h-6" trigger="hover" isActive={isActive('/blog')} theme={theme} />
          </Link>

          <Link
            to="/competitive"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              isActive('/competitive')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="Competitive Programming"
          >
            <AnimatedIcon src={graphIcon} size={24} className="w-6 h-6" trigger="hover" isActive={isActive('/competitive')} theme={theme} />
          </Link>

          <Link
            to="/about"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              isActive('/about')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="About"
          >
            <AnimatedIcon src={profileIcon} size={24} className="w-6 h-6" trigger="hover" isActive={isActive('/about')} theme={theme} />
          </Link>

          <Link
            to="/creator"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              isActive('/creator')
                ? 'text-emerald-500'
                : theme === 'dark'
                  ? 'text-gray-500 hover:text-emerald-500'
                  : 'text-gray-600 hover:text-emerald-500'
            }`}
            title="Creator"
          >
            <div style={{ filter: isActive('/creator') ? 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(500%) hue-rotate(125deg)' : (theme === 'dark' ? 'brightness(0) saturate(100%) invert(1)' : 'brightness(0)') }}>
              <Edit3 className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </Link>

          {/* Divider */}
          <div className={`w-6 h-px my-2 transition-opacity duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}></div>

          <button
            onClick={(e) => toggleTheme(e)}
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-600 hover:text-gray-400'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ filter: theme === 'dark' ? 'brightness(0) saturate(100%) invert(1)' : 'brightness(0)' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Sun className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-600 hover:text-gray-400'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Search (⌘K)"
          >
            <AnimatedIcon src={searchIcon} size={24} className="w-6 h-6" trigger="click" theme={theme} />
          </button>

          <a
            href="https://v2.navdeep.site"
            target="_blank"
            rel="noopener noreferrer"
            className={`relative p-3 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-600 hover:text-gray-400'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title="History"
          >
            <AnimatedIcon src={clockIcon} size={24} className="w-6 h-6" trigger="hover" theme={theme} />
          </a>
        </nav>

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
