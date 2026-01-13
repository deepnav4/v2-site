import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { Plus, Edit2, Trash2, Eye, Save, X, LogOut, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  createOrUpdateBlogPost,
  listBlogPosts,
  getBlogPost,
  deleteBlogPost,
  downloadMarkdownFile,
  type BlogMetadata,
} from '../services/githubContentService';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

export default function Creator() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Editor state
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingSlug, setEditingSlug] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [readTime, setReadTime] = useState('5 min read');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [blogList, setBlogList] = useState<{ name: string; sha: string }[]>([]);
  const [expandedSection, setExpandedSection] = useState<'info' | 'content'>('info');

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('creator_authenticated');
    const authTime = localStorage.getItem('creator_auth_time');
    
    // Check if authenticated and session is still valid (24 hours)
    if (authStatus === 'true' && authTime) {
      const timeElapsed = Date.now() - parseInt(authTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (timeElapsed < twentyFourHours) {
        loadBlogList();
      } else {
        // Session expired
        handleLogout();
      }
    } else {
      // Not authenticated, redirect to login
      navigate('/creator/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('creator_authenticated');
    localStorage.removeItem('creator_auth_time');
    navigate('/creator/login');
  };

  const loadBlogList = async () => {
    // In dev mode, use local blogPosts from auto-discovery
    if (import.meta.env.DEV) {
      const localBlogs = blogPosts.map(post => ({
        name: post.slug,
        sha: post.id,
      }));
      setBlogList(localBlogs);
    } else {
      // In production, fetch from GitHub
      const list = await listBlogPosts();
      setBlogList(list);
    }
  };

  const resetForm = () => {
    setMode('list');
    setEditingSlug('');
    setSlug('');
    setTitle('');
    setDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    setReadTime('5 min read');
    setCategory('');
    setTags('');
    setExcerpt('');
    setContent('');
    setMessage('');
  };

  const handleCreateNew = () => {
    resetForm();
    setMode('create');
  };

  const handleEdit = async (blogSlug: string) => {
    setLoading(true);
    
    // In dev mode, fetch from local blogPosts
    if (import.meta.env.DEV) {
      const localBlog = blogPosts.find(post => post.slug === blogSlug);
      if (localBlog) {
        setMode('edit');
        setEditingSlug(blogSlug);
        setSlug(blogSlug);
        setTitle(localBlog.title);
        setDate(localBlog.date);
        setReadTime(localBlog.readTime);
        setCategory(localBlog.category);
        setTags(localBlog.tags.join(', '));
        setExcerpt(localBlog.excerpt);
        // Note: Can't fetch full content in local mode - show message
        setContent('// Content editing not available in local mode\n// Please edit the .md file directly');
        setMessage('Edit mode: Modify the markdown file directly in src/content/blog/' + blogSlug + '.md');
      }
    } else {
      // In production, fetch from GitHub
      const blogData = await getBlogPost(blogSlug);
      if (blogData) {
        setMode('edit');
        setEditingSlug(blogSlug);
        setSlug(blogSlug);
        setTitle(blogData.metadata.title);
        setDate(blogData.metadata.date);
        setReadTime(blogData.metadata.readTime);
        setCategory(blogData.metadata.category);
        setTags(blogData.metadata.tags.join(', '));
        setExcerpt(blogData.metadata.excerpt);
        setContent(blogData.content);
      }
    }
    
    setLoading(false);
  };

  const handleDelete = async (blogSlug: string) => {
    if (!confirm(`Are you sure you want to delete "${blogSlug}"?`)) return;
    
    setLoading(true);
    const result = await deleteBlogPost(blogSlug);
    setMessage(result.message);
    if (result.success) {
      loadBlogList();
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = async () => {
    if (!slug || !title || !content) {
      setMessage('Please fill in all required fields (slug, title, content)');
      return;
    }

    setLoading(true);
    const metadata: BlogMetadata = {
      title,
      date,
      readTime,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      excerpt,
    };

    const result = await createOrUpdateBlogPost(slug, { metadata, content });
    
    // If local mode, trigger download
    if (result.localMode && result.content) {
      downloadMarkdownFile(slug, result.content);
      setMessage(`${result.message} Now place ${slug}.md in src/content/blog/ folder.`);
    } else {
      // Production mode - blog committed to GitHub
      setMessage(`${result.message} Note: Go to Vercel/Netlify and trigger a manual redeploy for the blog to appear on the site.`);
    }
    
    if (result.success) {
      loadBlogList();
      setTimeout(() => {
        resetForm();
      }, 2000);
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <>
      <SEO 
        title="Creator Dashboard"
        description="Manage blog posts"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 mb-3 sm:mb-4 font-sans font-medium">
                CONTENT MANAGEMENT
              </p>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl font-normal font-serif ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Creator Studio
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors font-sans text-sm ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
                  : 'text-red-600 hover:bg-red-50 border border-red-200'
              }`}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          {/* Mode Info Banner */}
          <div className={`mb-8 p-5 rounded-2xl border ${
            import.meta.env.DEV
              ? theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'
              : theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <p className={`text-sm font-sans ${
              import.meta.env.DEV
                ? theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                : theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              <strong className="font-semibold">{import.meta.env.DEV ? 'Local Development Mode' : 'Production Mode'}</strong>
              <br />
              <span className="opacity-90">
                {import.meta.env.DEV 
                  ? 'New posts will download as .md files. Place them in src/content/blog/ for automatic discovery.'
                  : 'Changes commit directly to GitHub repository and trigger automatic deployment.'
                }
              </span>
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-5 rounded-2xl border font-sans ${
              message.includes('Error') || message.includes('failed')
                ? theme === 'dark' 
                  ? 'bg-red-500/5 border-red-500/20 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-800'
                : theme === 'dark'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {message}
            </div>
          )}

          {/* List View */}
          {mode === 'list' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal font-serif mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Published Content
                  </h2>
                  <p className={`text-sm sm:text-base font-sans ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {blogList.length} {blogList.length === 1 ? 'article' : 'articles'} in repository
                  </p>
                </div>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-sans font-medium"
                >
                  <Plus size={20} />
                  New Article
                </button>
              </div>

              {blogList.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-base sm:text-lg font-serif mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No articles yet
                  </p>
                  <p className={`text-sm sm:text-base font-sans ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Create your first blog post to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {blogList.map((blog) => (
                    <div
                      key={blog.sha}
                      className={`group p-6 rounded-xl border transition-all hover:border-emerald-500/50 ${
                        theme === 'dark'
                          ? 'bg-gray-900/50 border-gray-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium font-sans text-base sm:text-lg mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {blog.name}
                          </h3>
                          <p className={`text-xs sm:text-sm font-mono ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            /blog/{blog.name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(blog.name)}
                            className={`p-3 rounded-xl transition-all ${
                              theme === 'dark'
                                ? 'text-blue-400 hover:bg-blue-500/10 border border-blue-500/20'
                                : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                            }`}
                            title="Edit blog post"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.name)}
                            className={`p-3 rounded-xl transition-all ${
                              theme === 'dark'
                                ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
                                : 'text-red-600 hover:bg-red-50 border border-red-200'
                            }`}
                            title="Delete blog post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Editor View */}
          {(mode === 'create' || mode === 'edit') && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal font-serif mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {mode === 'create' ? 'New Article' : 'Edit Article'}
                  </h2>
                  <p className={`text-sm sm:text-base font-sans ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {mode === 'create' ? 'Write and see your content come to life in real-time' : `Editing: ${editingSlug}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 font-sans font-medium text-sm"
                  >
                    <Save size={18} />
                    {loading ? 'Publishing...' : 'Publish Article'}
                  </button>
                  <button
                    onClick={resetForm}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors font-sans text-sm ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:bg-gray-800 border border-gray-800'
                        : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Preview - Always Visible */}
                <div className={`order-2 lg:order-1 p-8 rounded-2xl border overflow-auto max-h-[900px] ${
                  theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          content ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}></div>
                        <p className={`text-xs uppercase tracking-wider font-sans font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Live Preview
                        </p>
                      </div>
                      {content && (
                        <span className={`text-xs font-mono ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {content.length} characters
                        </span>
                      )}
                    </div>
                    <h3 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-normal ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {title || 'Untitled Article'}
                    </h3>
                    {date && (
                      <p className={`text-xs sm:text-sm mt-2 font-sans ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {date} {readTime && `· ${readTime}`}
                      </p>
                    )}
                  </div>
                  {content ? (
                    <div className={`prose max-w-none font-sans ${
                      theme === 'dark' ? 'prose-invert' : ''
                    }`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className={`text-center py-20 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <Eye size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="font-sans text-sm italic">
                        Start writing to see your content rendered here...
                      </p>
                    </div>
                  )}
                </div>

                {/* Editor Form */}
                <div className="order-1 lg:order-2">
                  <div className={`p-8 rounded-2xl border ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    {/* Step 1: Article Information */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            1
                          </div>
                          <h3 className={`text-base sm:text-lg font-semibold font-sans ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            Article Information
                          </h3>
                        </div>
                        <button
                          onClick={() => setExpandedSection(expandedSection === 'info' ? 'content' : 'info')}
                          className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
                            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                          }`}
                          title={expandedSection === 'info' ? 'Minimize' : 'Expand'}
                        >
                          <div className={`transform transition-transform duration-300 ease-in-out ${
                            expandedSection === 'info' ? 'rotate-0' : 'rotate-180'
                          }`}>
                            <ChevronUp size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                          </div>
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedSection === 'info' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className={`space-y-5 transform transition-all duration-500 ease-in-out ${
                        expandedSection === 'info' ? 'translate-y-0' : '-translate-y-4'
                      }`}>
                        <div>
                          <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            URL Slug
                          </label>
                          <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            placeholder="my-awesome-article"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                            required
                          />
                          {slug && (
                            <p className={`text-xs mt-1.5 font-mono ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              URL: /blog/{slug}
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className={`block text-xs uppercase tracking-wider font-medium font-sans ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              Title
                            </label>
                            {title.length > 60 && (
                              <span className="text-xs text-amber-500">
                                {title.length} chars (keep under 60)
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter article title"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              Date
                            </label>
                            <input
                              type="text"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              placeholder="January 1, 2024"
                              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                              }`}
                            />
                          </div>

                          <div>
                            <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              Read Time
                            </label>
                            <input
                              type="text"
                              value={readTime}
                              onChange={(e) => setReadTime(e.target.value)}
                              placeholder="5 min read"
                              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            Category
                          </label>
                          <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Tech, Design, Tutorial..."
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs uppercase tracking-wider font-medium mb-2 font-sans ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            Tags
                          </label>
                          <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="react, typescript, tutorial"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                          <p className={`text-xs mt-1.5 font-sans ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Tip: Separate multiple tags with commas
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className={`block text-xs uppercase tracking-wider font-medium font-sans ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              Excerpt
                            </label>
                            {excerpt.length > 160 && (
                              <span className="text-xs text-amber-500">
                                {excerpt.length} chars (keep under 160)
                              </span>
                            )}
                          </div>
                          <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="A brief summary of your article..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans resize-none ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                          />
                          <p className={`text-xs mt-1.5 font-sans ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            Note: Shown in blog preview cards and search results
                          </p>
                        </div>
                      </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`border-t mb-8 ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}></div>

                    {/* Step 2: Write Content */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            2
                          </div>
                          <h3 className={`text-lg font-semibold font-sans ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            Write Your Content
                          </h3>
                        </div>
                        <button
                          onClick={() => setExpandedSection(expandedSection === 'content' ? 'info' : 'content')}
                          className={`p-2 rounded-lg transition-all duration-300 ease-in-out ${
                            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                          }`}
                          title={expandedSection === 'content' ? 'Minimize' : 'Expand'}
                        >
                          <div className={`transform transition-transform duration-300 ease-in-out ${
                            expandedSection === 'content' ? 'rotate-0' : 'rotate-180'
                          }`}>
                            <ChevronUp size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                          </div>
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedSection === 'content' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className={`transform transition-all duration-500 ease-in-out ${
                        expandedSection === 'content' ? 'translate-y-0' : '-translate-y-4'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <label className={`block text-xs uppercase tracking-wider font-medium font-sans ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                          }`}>
                            Article Content (Markdown)
                          </label>
                          <a
                            href="https://www.markdownguide.org/cheat-sheet/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-500 hover:text-emerald-400 font-sans"
                          >
                            Markdown Guide →
                          </a>
                        </div>
                        <div className="relative">
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing your article using markdown syntax..."
                            rows={28}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono text-sm resize-none ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            }`}
                            required
                          />
                          {content && (
                            <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-mono ${
                              theme === 'dark' ? 'bg-gray-900/80 text-gray-400' : 'bg-white/80 text-gray-600'
                            }`}>
                              {content.split('\n').length} lines · {content.split(/\s+/).length} words
                            </div>
                          )}
                        </div>
                        <div className={`mt-4 p-4 rounded-xl ${
                          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
                        }`}>
                          <p className={`text-xs font-sans leading-relaxed ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <strong>Pro Tips:</strong> Use headings (##) for structure, code blocks (```) for snippets, 
                            and check the live preview panel on the left to see how your article looks.
                          </p>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
