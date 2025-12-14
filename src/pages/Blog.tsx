import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { blogPosts, allTags } from '../data/blogPosts';
import SEO from '../components/SEO';

export default function Blog() {
  const { theme } = useTheme();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  const filteredPosts = selectedTag === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.tags.includes(selectedTag));

  return (
    <>
      <SEO 
        title={selectedTag !== 'All' ? `${selectedTag} - Blog` : 'Blog - Navdeep Singh'}
        description={selectedTag !== 'All' ? `Articles tagged with ${selectedTag}` : 'Thoughts on web development, algorithms, system design, and software engineering.'}
        url={`https://navdeep.dev/blog${selectedTag !== 'All' ? `/tags/${selectedTag}` : ''}`}
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container py-12 sm:py-16">
        {/* Header Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-4 sm:mb-6 font-sans font-medium">
            LATE NIGHT THINKING
          </p>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-normal mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Things I've figured out
          </h1>
          <p className={`text-base sm:text-lg font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Notes on systems, algorithms, and patterns worth remembering
          </p>
        </div>

        {/* Tags Filter */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 font-sans ${
                selectedTag === 'All'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : theme === 'dark'
                    ? 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-700'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 font-sans ${
                  selectedTag === tag
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                    : theme === 'dark'
                      ? 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-700'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-0">
          {filteredPosts.map(post => (
            <Link 
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`block py-6 sm:py-8 border-b transition-colors duration-200 group ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:border-gray-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <article>
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <time className={`text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                    {post.date}
                  </time>
                  <span className={`text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    •
                  </span>
                  <span className={`text-xs sm:text-sm font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                    {post.category}
                  </span>
                </div>
                
                <h2 className={`text-xl sm:text-2xl font-normal mb-2 sm:mb-3 transition-colors duration-200 font-serif group-hover:text-emerald-500 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {post.title}
                </h2>
                
                <p className={`text-sm sm:text-base leading-relaxed font-sans line-clamp-2 sm:line-clamp-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>

        {/* View More */}
        {filteredPosts.length > 10 && (
          <div className="mt-12 sm:mt-16 text-center">
            <button className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 font-sans ${
              theme === 'dark'
                ? 'bg-[#0a0a0a] text-gray-300 border border-gray-800 hover:border-gray-700'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}>
              Load more posts
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
