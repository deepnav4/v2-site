import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { blogPosts } from '../data/blogPosts';
import { projects } from '../data/projects';
import { Search } from 'lucide-react';

interface SearchResult {
  type: 'blog' | 'project' | 'page';
  title: string;
  description?: string;
  url: string;
  date?: string;
}

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const pages = [
  { title: 'Home', url: '/', description: 'Main landing page' },
  { title: 'About', url: '/about', description: 'Learn more about me' },
  { title: 'Projects', url: '/projects', description: 'View my projects' },
  { title: 'Blog', url: '/blog', description: 'Read my blog posts' },
  { title: 'Competitive', url: '/competitive', description: 'CP & DSA progress' },
];

export default function UniversalSearch({ isOpen, onClose }: UniversalSearchProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search pages
    pages.forEach(page => {
      if (page.title.toLowerCase().includes(lowerQuery) || 
          page.description.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'page',
          title: page.title,
          description: page.description,
          url: page.url
        });
      }
    });

    // Search blog posts
    blogPosts.forEach(post => {
      if (post.title.toLowerCase().includes(lowerQuery) || 
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        searchResults.push({
          type: 'blog',
          title: post.title,
          description: post.excerpt,
          url: `/blog/${post.slug}`,
          date: post.date
        });
      }
    });

    // Search projects
    projects.forEach(project => {
      if (project.title.toLowerCase().includes(lowerQuery) || 
          project.description.toLowerCase().includes(lowerQuery) ||
          project.technologies.some((tech: string) => tech.toLowerCase().includes(lowerQuery))) {
        searchResults.push({
          type: 'project',
          title: project.title,
          description: project.description,
          url: `/projects/${project.slug}`
        });
      }
    });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close with Escape
      if (e.key === 'Escape') {
        onClose();
        setQuery('');
        setResults([]);
      }

      // Navigate results with arrow keys
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].url);
            onClose();
            setQuery('');
            setResults([]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  // Search as user types
  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleResultClick = (url: string) => {
    navigate(url);
    onClose();
    setQuery('');
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[15vh] px-4">
        <div 
          className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#1a1a1a] border border-gray-800' 
              : 'bg-white border border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className={`flex items-center gap-3 px-4 py-4 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <Search size={20} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, blog posts, projects..."
              autoFocus
              className={`flex-1 bg-transparent outline-none text-base ${
                theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-black placeholder-gray-400'
              }`}
            />
            <button
              onClick={onClose}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-500 hover:text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <kbd className="text-xs font-mono">ESC</kbd>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query && results.length === 0 ? (
              <div className={`px-4 py-8 text-center text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                No results found for "{query}"
              </div>
            ) : query && results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result.url)}
                    className={`w-full px-4 py-3 flex items-start gap-3 transition-colors ${
                      index === selectedIndex
                        ? theme === 'dark'
                          ? 'bg-gray-800/50'
                          : 'bg-gray-50'
                        : ''
                    } ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-800/50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-xs font-mono ${
                      result.type === 'blog'
                        ? theme === 'dark'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-500/20 text-emerald-600'
                        : result.type === 'project'
                        ? theme === 'dark'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-blue-500/20 text-blue-600'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {result.type}
                    </span>
                    <div className="flex-1 text-left">
                      <div className={`font-medium mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {result.title}
                      </div>
                      {result.description && (
                        <div className={`text-sm line-clamp-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {result.description}
                        </div>
                      )}
                      {result.date && (
                        <div className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {result.date}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`px-4 py-8 text-center text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <div className="mb-3">Search across all pages, blog posts, and projects</div>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    ⌘K
                  </kbd>
                  <span>to open</span>
                  <span className="mx-2">•</span>
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    ↑↓
                  </kbd>
                  <span>to navigate</span>
                  <span className="mx-2">•</span>
                  <kbd className={`px-2 py-1 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-gray-100 border-gray-300'
                  }`}>
                    Enter
                  </kbd>
                  <span>to select</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Export function to open search from anywhere
export const openSearch = () => {
  window.dispatchEvent(new KeyboardEvent('keydown', { 
    key: 'k', 
    metaKey: true 
  }));
};
