import { Octokit } from '@octokit/rest';
import yaml from 'js-yaml';
import { Buffer } from 'buffer';

// Check if GitHub integration is enabled (production mode)
const isGitHubEnabled = import.meta.env.VITE_GITHUB_TOKEN && 
                        import.meta.env.VITE_GITHUB_OWNER && 
                        import.meta.env.VITE_GITHUB_REPO;

const octokit = isGitHubEnabled ? new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
}) : null;

const owner = import.meta.env.VITE_GITHUB_OWNER;
const repo = import.meta.env.VITE_GITHUB_REPO;
const branch = import.meta.env.VITE_GITHUB_BRANCH || 'main';

export interface BlogMetadata {
  title: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  excerpt: string;
}

export interface BlogContent {
  metadata: BlogMetadata;
  content: string;
}

/**
 * Generate markdown file content with frontmatter
 */
export function generateMarkdownFile(blogData: BlogContent): string {
  const frontmatter = yaml.dump(blogData.metadata);
  return `---\n${frontmatter}---\n\n${blogData.content}`;
}

/**
 * Download markdown file to local computer
 */
export function downloadMarkdownFile(slug: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates or updates a blog post file
 * - In local dev: returns markdown content for download
 * - In production: commits to GitHub
 */
export async function createOrUpdateBlogPost(
  slug: string,
  blogData: BlogContent
): Promise<{ success: boolean; message: string; url?: string; localMode?: boolean; content?: string }> {
  try {
    const fileContent = generateMarkdownFile(blogData);
    
    // LOCAL MODE: Return content for download
    if (!isGitHubEnabled || import.meta.env.DEV) {
      return {
        success: true,
        message: 'Blog post generated! Click download to save the file.',
        localMode: true,
        content: fileContent,
      };
    }
    
    // GITHUB MODE: Commit to repository
    const path = `src/content/blog/${slug}.md`;
    
    // Check if file exists
    let sha: string | undefined;
    try {
      const { data } = await octokit!.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      
      if ('sha' in data) {
        sha = data.sha;
      }
    } catch (error: any) {
      // File doesn't exist, that's okay
      if (error.status !== 404) {
        throw error;
      }
    }
    
    // Create or update file
    const response = await octokit!.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: sha 
        ? `Update blog post: ${blogData.metadata.title}` 
        : `Create blog post: ${blogData.metadata.title}`,
      content: Buffer.from(fileContent).toString('base64'),
      branch,
      ...(sha && { sha }),
    });
    
    return {
      success: true,
      message: sha ? 'Blog post updated successfully on GitHub!' : 'Blog post created successfully on GitHub!',
      url: response.data.content?.html_url,
      localMode: false,
    };
  } catch (error: any) {
    console.error('Error creating/updating blog post:', error);
    return {
      success: false,
      message: `Error: ${error.message || 'Failed to save blog post'}`,
    };
  }
}

/**
 * Gets list of all blog posts
 * - In local dev: returns empty array (use local file system)
 * - In production: fetches from GitHub
 */
export async function listBlogPosts(): Promise<{ name: string; sha: string }[]> {
  // LOCAL MODE: Return empty (blogs are auto-discovered from local files)
  if (!isGitHubEnabled || import.meta.env.DEV) {
    return [];
  }
  
  // GITHUB MODE: Fetch from repository
  try {
    const { data } = await octokit!.repos.getContent({
      owner,
      repo,
      path: 'src/content/blog',
      ref: branch,
    });
    
    if (Array.isArray(data)) {
      return data
        .filter(file => file.name.endsWith('.md'))
        .map(file => ({
          name: file.name.replace('.md', ''),
          sha: file.sha,
        }));
    }
    
    return [];
  } catch (error) {
    console.error('Error listing blog posts:', error);
    return [];
  }
}

/**
 * Gets content of a specific blog post
 * - In local dev: not supported (edit files directly)
 * - In production: fetches from GitHub
 */
export async function getBlogPost(slug: string): Promise<BlogContent | null> {
  // LOCAL MODE: Not supported in dev mode
  if (!isGitHubEnabled || import.meta.env.DEV) {
    return null;
  }
  
  // GITHUB MODE: Fetch from repository
  try {
    const path = `src/content/blog/${slug}.md`;
    const { data } = await octokit!.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (frontmatterMatch) {
        const metadata = yaml.load(frontmatterMatch[1]) as BlogMetadata;
        const blogContent = frontmatterMatch[2].trim();
        
        return {
          metadata,
          content: blogContent,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting blog post:', error);
    return null;
  }
}

/**
 * Deletes a blog post
 * - In local dev: not supported (delete files manually)
 * - In production: deletes from GitHub
 */
export async function deleteBlogPost(slug: string): Promise<{ success: boolean; message: string }> {
  // LOCAL MODE: Not supported in dev mode
  if (!isGitHubEnabled || import.meta.env.DEV) {
    return {
      success: false,
      message: 'Delete operation not available in local mode. Please delete the file manually from src/content/blog/',
    };
  }
  
  // GITHUB MODE: Delete from repository
  try {
    const path = `src/content/blog/${slug}.md`;
    
    // Get file SHA
    const { data } = await octokit!.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    if (!('sha' in data)) {
      return { success: false, message: 'File not found' };
    }
    
    // Delete file
    await octokit!.repos.deleteFile({
      owner,
      repo,
      path,
      message: `Delete blog post: ${slug}`,
      sha: data.sha,
      branch,
    });
    
    return {
      success: true,
      message: 'Blog post deleted successfully from GitHub!',
    };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      message: `Error: ${error.message || 'Failed to delete blog post'}`,
    };
  }
}
