import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../store/themeStore';
import { projects } from '../data/projects';
import SEO from '../components/SEO';

export default function Projects() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'featured' | 'personal' | 'hackathon'>('all');
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      <SEO 
        title="Projects - Navdeep Singh"
        description="A collection of web applications, tools, and open-source projects built with modern technologies like React, Node.js, TypeScript, and more."
        url="https://navdeep.dev/projects"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="container py-16">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h1 className={`text-5xl md:text-6xl font-normal mb-6 font-serif ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Projects
            </h1>
            <p className={`text-base font-sans mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete collection spanning different domains and technologies
            </p>
            <p className={`text-sm font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {filteredProjects.length} projects
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                filter === 'all'
                  ? 'bg-emerald-500 text-black'
                  : theme === 'dark'
                    ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All {projects.length}
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                filter === 'featured'
                  ? 'bg-emerald-500 text-black'
                  : theme === 'dark'
                    ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Featured {projects.filter(p => p.category === 'featured').length}
            </button>
            <button
              onClick={() => setFilter('personal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                filter === 'personal'
                  ? 'bg-emerald-500 text-black'
                  : theme === 'dark'
                    ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Personal {projects.filter(p => p.category === 'personal').length}
            </button>
            <button
              onClick={() => setFilter('hackathon')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                filter === 'hackathon'
                  ? 'bg-emerald-500 text-black'
                  : theme === 'dark'
                    ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hackathon {projects.filter(p => p.category === 'hackathon').length}
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={`pb-8 ${index !== filteredProjects.length - 1 ? 'border-b' : ''} ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="mb-4 flex items-start gap-4">
                <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
                  0{index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-medium font-sans">
                      {project.category}
                    </span>
                  </div>
                  
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className={`text-2xl font-normal mb-3 font-serif hover:text-emerald-500 transition-colors cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {project.title}
                    </h3>
                  </Link>
                  
                  <p className={`text-sm mb-4 leading-relaxed font-sans max-w-3xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(tech => (
                      <span 
                        key={tech}
                        className={`text-xs font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 text-sm items-center">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 font-sans transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className={`text-center py-16 font-sans ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
    </>
  );
}
