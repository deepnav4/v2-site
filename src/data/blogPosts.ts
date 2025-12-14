import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  tags: string[];
  slug: string;
}

// Auto-discover all markdown files in src/content/blog/
const blogModules = import.meta.glob('../content/blog/*.md', { eager: true, query: '?raw', import: 'default' });

// Parse frontmatter and generate blog posts array
export const blogPosts: BlogPost[] = Object.entries(blogModules).map(([path, content], index) => {
  // Extract slug from file path (e.g., "../content/blog/git-diff-lcs.md" -> "git-diff-lcs")
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  
  // Parse frontmatter
  const { data } = matter(content as string);
  
  // Calculate estimated read time based on word count
  const wordCount = (content as string).split(/\s+/).length;
  const readTime = `${Math.ceil(wordCount / 200)} min read`;
  
  return {
    id: String(index + 1),
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: data.readTime || readTime,
    category: data.category || 'general',
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags : []
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

// Auto-generate unique tags from all blog posts
export const allTags = Array.from(
  new Set(blogPosts.flatMap(post => post.tags))
).sort();
