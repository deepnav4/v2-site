import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { blogPosts, allTags } from '../data/blogPosts';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Edit3 } from 'lucide-react';

export default function Blog() {
  const { theme } = useTheme();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Scroll reveal refs
  const headerRef = useScrollReveal();
  const tagsRef = useScrollReveal();
  const postsRef = useScrollReveal();

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
      <div className="container py-12 sm:py-16 md:py-20">
        {/* Header Section */}
        <div
          ref={headerRef.ref}
          className={`mb-8 sm:mb-12 reveal ${headerRef.isVisible ? 'visible' : ''}`}
        >
          <p className={`text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium reveal stagger-1 ${headerRef.isVisible ? 'visible' : ''}`}>
            LATE NIGHT THINKING
          </p>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-normal mb-4 sm:mb-6 font-serif reveal stagger-2 ${headerRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Things I've figured out
          </h1>
          <div className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 reveal stagger-3 ${headerRef.isVisible ? 'visible' : ''}`}>
            <p className={`text-sm sm:text-base font-sans max-w-3xl leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              Notes on systems, algorithms, and patterns worth remembering
              <span className={`ml-2 text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                — {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </p>
            <Link
              to="/creator"
              className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-600 hover:text-emerald-500'
                  : 'text-gray-400 hover:text-emerald-600'
              }`}
            >
              <Edit3 size={11} />
              Write a new post
            </Link>
          </div>
        </div>

        {/* Tags Filter */}
        <div
          ref={tagsRef.ref}
          className={`mb-6 sm:mb-8 reveal stagger-4 ${tagsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all duration-200 font-sans ${
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
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all duration-200 font-sans ${
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
        <div
          ref={postsRef.ref}
          className={`reveal ${postsRef.isVisible ? 'visible' : ''}`}
        >
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`block py-4 sm:py-5 transition-colors duration-200 group reveal ${postsRef.isVisible ? 'visible' : ''} ${
                index === 0
                  ? theme === 'dark'
                    ? 'border-y border-gray-800/60 hover:border-gray-700'
                    : 'border-y border-gray-200 hover:border-gray-300'
                  : theme === 'dark'
                    ? 'border-b border-gray-800/60 hover:border-gray-700'
                    : 'border-b border-gray-200 hover:border-gray-300'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <article>
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <time className={`text-[11px] sm:text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {post.date}
                  </time>
                  <span className={`text-[11px] sm:text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>·</span>
                  <span className={`text-[11px] sm:text-xs font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                    {post.readTime}
                  </span>
                  <span className={`text-[11px] sm:text-xs ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}>·</span>
                  <span className={`text-[11px] sm:text-xs font-mono text-emerald-500/70`}>
                    {post.category}
                  </span>
                </div>
                
                <h2 className={`text-base sm:text-lg font-normal mb-1 sm:mb-1.5 transition-colors duration-200 font-serif group-hover:text-emerald-500 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {post.title}
                </h2>
                
                <p className={`text-xs sm:text-sm leading-relaxed font-sans line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>

        {/* View More */}
        {filteredPosts.length > 10 && (
          <div className="mt-10 sm:mt-12 text-center">
            <button className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 font-sans ${
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
