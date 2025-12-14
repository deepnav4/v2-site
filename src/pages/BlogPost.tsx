import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../store/themeStore';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';

export default function BlogPost() {
  const { theme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  useEffect(() => {
    // Load markdown content
    const loadContent = async () => {
      if (!slug) return;

      try {
        // Try loading from build first
        const module = await import(`../content/blog/${slug}.md?raw`);
        let content = module.default;
        // Remove frontmatter (YAML between ---)
        content = content.replace(/^---[\s\S]*?---\s*/m, '');
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error loading markdown from build:', error);
        
        // Fallback: Try fetching from GitHub in production if file not found in build
        if (!import.meta.env.DEV && import.meta.env.VITE_GITHUB_OWNER && import.meta.env.VITE_GITHUB_REPO) {
          try {
            console.log('Attempting to fetch from GitHub...');
            const response = await fetch(`https://raw.githubusercontent.com/${import.meta.env.VITE_GITHUB_OWNER}/${import.meta.env.VITE_GITHUB_REPO}/main/src/content/blog/${slug}.md`);
            
            if (response.ok) {
              let content = await response.text();
              console.log('Successfully fetched from GitHub');
              // Remove frontmatter
              content = content.replace(/^---[\s\S]*?---\s*/m, '');
              setMarkdownContent(content);
              return;
            } else {
              console.error('GitHub fetch failed with status:', response.status);
            }
          } catch (fetchError) {
            console.error('Error fetching from GitHub:', fetchError);
          }
        }
        
        setMarkdownContent('# Blog post not found\n\nThe requested blog post could not be loaded. If this is a newly created post, please wait for the site to rebuild or trigger a manual deployment.');
      }
    };

    loadContent();
  }, [slug]);

  useEffect(() => {
    // Extract headings from the article after markdown is rendered
    const timer = setTimeout(() => {
      const articleHeadings = Array.from(document.querySelectorAll('article h2, article h3'))
        .map((heading) => ({
          id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1])
        }));
      
      // Add IDs to headings if they don't have them
      document.querySelectorAll('article h2, article h3').forEach((heading) => {
        if (!heading.id) {
          heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
        }
      });
      
      setHeadings(articleHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [markdownContent]);



  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!post) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-12 sm:py-16 text-center">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Post not found
          </h1>
          <Link to="/blog" className="text-sm sm:text-base text-emerald-500 hover:text-emerald-400 transition-colors font-sans">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post.title}
        description={post.excerpt}
        type="article"
        url={`https://navdeep.dev/blog/${post.slug}`}
        article={{
          publishedTime: post.date,
          author: 'Navdeep Singh',
          tags: post.tags
        }}
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        {/* <div className={`h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div 
            className="h-full bg-emerald-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div> */}
      </div>

      {/* Progress Percentage Display with TOC - Hidden on mobile */}
      <div 
        className="hidden lg:block fixed top-1/2 -translate-y-1/2 right-4 lg:right-8 z-50"
        onMouseEnter={() => setShowTOC(true)}
        onMouseLeave={() => setShowTOC(false)}
      >
        {/* Expandable Container */}
        <div 
          className={`shadow-lg backdrop-blur-sm ${
            theme === 'dark' ? 'bg-black/80 border border-gray-800' : 'bg-white/80 border border-gray-200'
          }`}
          style={{
            width: showTOC ? '280px' : '64px',
            height: showTOC ? 'auto' : '64px',
            maxHeight: showTOC ? '480px' : '64px',
            borderRadius: showTOC ? '12px' : '16px',
            transition: showTOC 
              ? 'border-radius 0.15s ease-out, width 0.25s ease-out 0.15s, max-height 0.25s ease-out 0.4s'
              : 'max-height 0.2s ease-in, width 0.2s ease-in 0.2s, border-radius 0.15s ease-in 0.4s',
            overflow: 'hidden',
          }}
        >
          
          {/* Percentage Display - Always Visible */}
          <div 
            className="flex items-center justify-center"
            style={{
              minHeight: '64px',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Circle percentage - always rendered, hidden on expand */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: showTOC ? 0 : 1,
                transition: showTOC ? 'opacity 0.1s ease-out' : 'opacity 0.15s ease-in 0.3s',
                pointerEvents: showTOC ? 'none' : 'auto'
              }}
            >
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace' }}>
                {Math.round(scrollProgress)}%
              </span>
            </div>

            {/* Expanded header - always rendered, hidden when collapsed */}
            <div 
              className="w-full px-4 py-3 flex items-center gap-3 border-b" 
              style={{ 
                borderColor: theme === 'dark' ? '#1f2937' : '#e5e7eb',
                opacity: showTOC ? 1 : 0,
                transition: showTOC ? 'opacity 0.2s ease-out 0.3s' : 'opacity 0.1s ease-in',
                pointerEvents: showTOC ? 'auto' : 'none'
              }}
            >
              <div className="flex-shrink-0">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace' }}>
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Contents
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Jump to section
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents - Only visible when expanded */}
          <div 
            className="overflow-y-auto px-3 py-3 toc-scrollbar" 
            style={{ 
              maxHeight: '400px',
              opacity: showTOC ? 1 : 0,
              transition: showTOC ? 'opacity 0.2s ease-out 0.5s' : 'opacity 0.15s ease-in',
              pointerEvents: showTOC ? 'auto' : 'none'
            }}
          >
            {headings.map((heading, index) => (
              <button
                key={index}
                onClick={() => scrollToHeading(heading.id)}
                className={`w-full text-left py-2 px-3 rounded-md mb-1 transition-all text-sm ${
                  heading.level === 3 ? 'pl-6 text-xs' : ''
                } ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-emerald-400 hover:bg-gray-900/50' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                <span className={`${heading.level === 2 ? 'font-medium' : ''}`}>
                  {heading.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-in-out 0.3s both;
          }
          
          .toc-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .toc-scrollbar::-webkit-scrollbar-track {
            background: ${theme === 'dark' ? '#0a0a0a' : '#f5f5f5'};
            border-radius: 3px;
          }
          
          .toc-scrollbar::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 3px;
          }
          
          .toc-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #059669;
          }
        `}</style>
      </div>

      <div className="container py-12 sm:py-16 md:py-24">
        <div className={`mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base font-sans ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-emerald-500 transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{post.title}</span>
        </div>

        <article className="max-w-4xl">
            <header className="mb-10 sm:mb-12 md:mb-16">
              <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                <time>{post.date}</time>
                <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}>•</span>
                <span>{post.readTime}</span>
                <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}>•</span>
                <span className="font-mono">{post.category}</span>
              </div>
            
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-6 sm:mb-8 leading-tight font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {post.title}
            </h1>
            
            <p className={`text-base sm:text-lg md:text-xl leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {post.excerpt}
            </p>
            
            <div className={`flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8 text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {post.tags.map((tag, index) => (
                <span key={tag}>
                  <Link
                    to={`/tags/${tag}`}
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {tag}
                  </Link>
                  {index < post.tags.length - 1 && <span className="ml-3">/</span>}
                </span>
              ))}
            </div>
          </header>

          <div className={`prose sm:prose-lg max-w-none font-sans ${
            theme === 'dark' 
              ? 'prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-code:text-gray-300 prose-code:font-mono prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-li:text-gray-400' 
              : 'prose-headings:font-serif prose-headings:text-black prose-p:text-gray-900 prose-strong:text-black prose-code:text-gray-900 prose-code:font-mono prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-li:text-gray-900'
          }`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, children, ...props}) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  return <h1 id={id} className="font-serif" {...props}>{children}</h1>;
                },
                h2: ({node, children, ...props}) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  return <h2 id={id} className="font-serif" {...props}>{children}</h2>;
                },
                h3: ({node, children, ...props}) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  return <h3 id={id} className="font-serif" {...props}>{children}</h3>;
                },
                pre: ({node, children, ...props}) => {
                  const [copied, setCopied] = useState(false);
                  
                  const handleCopy = () => {
                    const code = node?.children?.[0];
                    if (code && 'children' in code) {
                      const text = code.children
                        .map((child: any) => (typeof child === 'object' && 'value' in child ? child.value : ''))
                        .join('');
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  };

                  return (
                    <div className="relative group">
                      <button
                        onClick={handleCopy}
                        className={`absolute top-3 right-3 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black'
                        }`}
                        title="Copy code"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <pre
                        className={`!mt-0 !mb-0 !border ${
                          theme === 'dark'
                            ? '!bg-[#0a0a0a] !border-gray-800'
                            : '!bg-gray-50 !border-gray-200'
                        }`}
                        {...props}
                      >
                        {children}
                      </pre>
                    </div>
                  );
                },
                code: ({node, inline, className, children, ...props}: any) => {
                  if (inline) {
                    return <code className={className} {...props}>{children}</code>
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </article>

        <div className={`mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t max-w-4xl ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-emerald-500 hover:text-emerald-400 transition-colors font-sans font-medium"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
