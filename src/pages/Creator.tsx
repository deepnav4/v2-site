import { useState, useEffect } from 'react';
import { useTheme } from '../store/themeStore';
import { Lock, Plus, Edit2, Trash2, Eye, Save, X, LogOut } from 'lucide-react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
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
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [blogList, setBlogList] = useState<{ name: string; sha: string }[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('creator_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadBlogList();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envUsername = import.meta.env.VITE_CREATOR_USERNAME;
    const envPassword = import.meta.env.VITE_CREATOR_PASSWORD;
    
    if (username === envUsername && password === envPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('creator_authenticated', 'true');
      setError('');
      loadBlogList();
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('creator_authenticated');
    resetForm();
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
    setShowPreview(false);
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
      setMessage(result.message);
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

  if (!isAuthenticated) {
    return (
      <>
        <SEO 
          title="Creator Login"
          description="Creator access"
        />
        <div className={`min-h-screen flex items-center justify-center px-4 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center mb-6">
              <Lock size={48} className="text-emerald-500" />
            </div>
            <h1 className={`text-2xl font-serif font-bold text-center mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Creator Access
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Creator Dashboard"
        description="Manage blog posts"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-3xl font-serif font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Creator Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          {/* Mode Info Banner */}
          <div className={`mb-6 p-4 rounded-lg border ${
            import.meta.env.DEV
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
          }`}>
            <p className={`text-sm ${
              import.meta.env.DEV
                ? 'text-blue-800 dark:text-blue-300'
                : 'text-emerald-800 dark:text-emerald-300'
            }`}>
              <strong>{import.meta.env.DEV ? '🔧 Local Mode:' : '☁️ Production Mode:'}</strong>{' '}
              {import.meta.env.DEV 
                ? 'Creating a blog will download a .md file. Place it in src/content/blog/ folder and it will auto-appear on your site!'
                : 'Changes will be committed directly to GitHub repository.'
              }
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('Error') || message.includes('failed')
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
            }`}>
              {message}
            </div>
          )}

          {/* List View */}
          {mode === 'list' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Blog Posts ({blogList.length})
                </h2>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Create New Post
                </button>
              </div>

              <div className="grid gap-4">
                {blogList.map((blog) => (
                  <div
                    key={blog.sha}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {blog.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blog.name)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.name)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor View */}
          {(mode === 'create' || mode === 'edit') && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {mode === 'create' ? 'Create New Post' : `Edit: ${editingSlug}`}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                  >
                    <Eye size={20} />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save & Publish'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editor Form */}
                <div className={`p-6 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Slug (URL) *
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="my-blog-post"
                        disabled={mode === 'edit'}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white disabled:opacity-50'
                            : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-100'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="My Awesome Blog Post"
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Date
                        </label>
                        <input
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="December 14, 2025"
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="5 min read"
                          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="web-development"
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="react, typescript, tutorial"
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Excerpt
                      </label>
                      <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A brief description of your post..."
                        rows={2}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Content (Markdown) *
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="# Your content here&#10;&#10;Write your blog post in markdown..."
                        rows={20}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {showPreview && (
                  <div className={`p-6 rounded-lg border overflow-auto ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-2xl font-serif font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {title || 'Preview'}
                    </h3>
                    <div className={`prose max-w-none ${
                      theme === 'dark' ? 'prose-invert' : ''
                    }`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || '*Write some content to see the preview...*'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
