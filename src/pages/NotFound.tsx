import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { Home, ArrowLeft } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function NotFound() {
  const { theme } = useTheme();

  // Scroll reveal refs
  const contentRef = useScrollReveal();
  const linksRef = useScrollReveal();

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container">
        <div
          ref={contentRef.ref}
          className={`max-w-2xl mx-auto text-center reveal ${contentRef.isVisible ? 'visible' : ''}`}
        >
          {/* 404 Display */}
          <div className={`mb-8 reveal stagger-1 ${contentRef.isVisible ? 'visible' : ''}`}>
            <h1 className={`text-9xl font-normal mb-4 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              404
            </h1>
            <div className={`inline-block px-4 py-2 rounded-lg mb-6 ${
              theme === 'dark' ? 'bg-gray-900/50 border border-gray-800' : 'bg-gray-100 border border-gray-200'
            }`}>
              <p className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Page Not Found
              </p>
            </div>
          </div>

          {/* Message */}
          <h2 className={`text-2xl font-normal mb-4 font-serif reveal stagger-2 ${contentRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Looks like you've wandered off the path
          </h2>
          <p className={`text-base mb-12 font-sans max-w-md mx-auto reveal stagger-3 ${contentRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center reveal stagger-4 ${contentRef.isVisible ? 'visible' : ''}`}>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-sans text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Home size={16} />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-sans text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-800'
                  : 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div
            ref={linksRef.ref}
            className={`mt-16 pt-12 border-t reveal ${linksRef.isVisible ? 'visible' : ''}`}
            style={{ borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb' }}
          >
            <p className={`text-xs uppercase tracking-wider mb-6 font-sans font-semibold reveal stagger-1 ${linksRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
            }`}>
              Quick Links
            </p>
            <div className={`flex flex-wrap justify-center gap-6 reveal stagger-2 ${linksRef.isVisible ? 'visible' : ''}`}>
              <Link
                to="/about"
                className={`text-sm font-sans transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                About
              </Link>
              <Link
                to="/projects"
                className={`text-sm font-sans transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className={`text-sm font-sans transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Blog
              </Link>
              <Link
                to="/competitive"
                className={`text-sm font-sans transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Competitive
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
