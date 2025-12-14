import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../store/themeStore';
import { projects } from '../data/projects';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectDetail() {
  const { theme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    // Load markdown content for project
    if (slug) {
      import(`../content/projects/${slug}.md?raw`)
        .then((module) => {
          let content = module.default;
          // Remove frontmatter (YAML between ---)
          content = content.replace(/^---[\s\S]*?---\s*/m, '');
          setMarkdownContent(content);
        })
        .catch((error) => {
          console.error('Error loading markdown:', error);
          setMarkdownContent('');
        });
    }
  }, [slug]);

  if (!project) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="container py-12 sm:py-16 text-center">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Project not found
          </h1>
          <Link to="/projects" className="text-sm sm:text-base text-emerald-500 hover:text-emerald-400 transition-colors font-sans">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container py-12 sm:py-16 md:py-24">
        {/* Breadcrumb Navigation */}
        <div className={`mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base font-sans ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/projects" className="hover:text-emerald-500 transition-colors">Projects</Link>
          <span className="mx-2">/</span>
          <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{project.title}</span>
        </div>

        <article className="max-w-4xl">
          <header className="mb-10 sm:mb-12 md:mb-16">
            {/* Category Badge */}
            <div className="mb-4 sm:mb-6">
              <span className={`inline-block px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-lg font-mono ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}>
                {project.category}
              </span>
            </div>

            {/* Project Title */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-6 sm:mb-8 leading-tight font-serif ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {project.title}
            </h1>
            
            {/* Project Description */}
            <p className={`text-base sm:text-lg md:text-xl leading-relaxed font-sans mb-6 sm:mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.description}
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-800 hover:border-emerald-500/30 text-gray-300 hover:text-emerald-400'
                      : 'bg-gray-50 border-gray-200 hover:border-emerald-500/30 text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  <Github size={18} />
                  View Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
                  }`}
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
            
            {/* Technologies */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              {project.technologies.map((tech, index) => (
                <span key={tech}>
                  <span className="hover:text-emerald-500 transition-colors cursor-default">
                    {tech}
                  </span>
                  {index < project.technologies.length - 1 && <span className="ml-3">/</span>}
                </span>
              ))}
            </div>
          </header>

          {/* Project Content */}
          {markdownContent && (
            <div className={`prose sm:prose-lg max-w-none font-sans ${
              theme === 'dark' 
                ? 'prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-code:text-gray-300 prose-code:font-mono prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-li:text-gray-400' 
                : 'prose-headings:font-serif prose-headings:text-black prose-p:text-gray-900 prose-strong:text-black prose-code:text-gray-900 prose-code:font-mono prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-li:text-gray-900'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
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
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </article>

        {/* Back Link */}
        <div className={`mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t max-w-4xl ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-emerald-500 hover:text-emerald-400 transition-colors font-sans font-medium"
          >
            <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
            Back to all projects
          </Link>
        </div>
      </div>
    </div>
  );
}
