import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../store/themeStore';
import { blogPosts } from '../data/blogPosts';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import SEO from '../components/SEO';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function BlogPost() {
  const { theme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const [markdownContent, setMarkdownContent] = useState('');

  // Scroll reveal refs
  const headerRef = useScrollReveal();

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
        // Remove manual Table of Contents section if it exists
        content = content.replace(/^## Table of Contents\s*[\s\S]*?---\s*/mi, '');
        // Remove {#id} patterns from headings
        content = content.replace(/(#+ .*?)\s*\{#[\w-]+\}\s*$/gm, '$1');
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
              // Remove manual Table of Contents section if it exists
              content = content.replace(/^## Table of Contents\s*[\s\S]*?---\s*/mi, '');
              // Remove {#id} patterns from headings
              content = content.replace(/(#+ .*?)\s*\{#[\w-]+\}\s*$/gm, '$1');
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
      <div className="container py-12 sm:py-16 md:py-20">
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
            <header
              ref={headerRef.ref}
              className={`mb-10 sm:mb-12 md:mb-16 reveal ${headerRef.isVisible ? 'visible' : ''}`}
            >
              <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6 text-xs sm:text-sm font-sans reveal stagger-1 ${headerRef.isVisible ? 'visible' : ''} ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                <time>{post.date}</time>
                <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}>•</span>
                <span>{post.readTime}</span>
                <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}>•</span>
                <span className="font-mono">{post.category}</span>
              </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-6 sm:mb-8 leading-tight font-serif reveal stagger-2 ${headerRef.isVisible ? 'visible' : ''} ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {post.title}
            </h1>
            
            <p className={`text-base sm:text-lg max-w-none leading-relaxed font-sans ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
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
