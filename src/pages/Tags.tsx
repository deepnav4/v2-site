import { Link } from 'react-router-dom';
import { allTags } from '../data/blogPosts';
import { Hash } from 'lucide-react';
import { useTheme } from '../store/themeStore';

export default function Tags() {
  const { theme } = useTheme();
  
  return (
    <div className="container py-16">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Explore by Topic
        </h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Browse all tags to discover content organized by subject and theme
        </p>
      </div>

      {/* Tags Grid */}
      <div className="max-w-5xl">
        <div className="flex flex-wrap gap-3">
          {allTags.map(tag => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className={`group inline-flex items-center gap-2 px-5 py-3 rounded-full 
                transition-all duration-300 border
                ${theme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800' 
                  : 'bg-gray-50 border-gray-200 hover:border-emerald-500/50 hover:bg-white'
                }
                hover:shadow-lg hover:scale-105`}
            >
              <Hash className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-gray-500 group-hover:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-600'}`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
