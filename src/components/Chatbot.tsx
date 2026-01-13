import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../store/themeStore';
import { X, Send, MessageSquare } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const KNOWLEDGE_BASE = {
  // Personal Information
  'who are you': 'I am Navdeep Singh, a passionate IT student at National Institute of Technology (NIT) Jalandhar. I specialize in full-stack development, competitive programming, and building scalable web applications.',
  'about navdeep': 'Navdeep Singh is a dedicated IT student at NIT Jalandhar with a strong foundation in modern web technologies. He excels in React, TypeScript, Node.js, and has a keen interest in competitive programming. His portfolio includes enterprise-level applications like gym management systems, developer tools, and creative drawing platforms.',
  'name': 'Navdeep Singh - a full-stack developer and competitive programmer from NIT Jalandhar.',
  'introduce yourself': 'Hello! I\'m Navdeep Singh, currently pursuing Information Technology at NIT Jalandhar. I love building things with React and TypeScript, solving algorithmic problems, and creating tools that make developers\' lives easier.',
  
  // Education & Background
  'education': 'I am currently pursuing my Bachelor of Technology degree in Information Technology at National Institute of Technology (NIT), Jalandhar - one of India\'s premier technical institutes.',
  'nit jalandhar': 'NIT Jalandhar is a premier engineering institution in India. I\'m proud to be studying Information Technology here, where I\'m gaining deep technical knowledge and practical experience.',
  'college': 'I study at National Institute of Technology (NIT) Jalandhar, pursuing Information Technology. It\'s an incredible place for learning and growth.',
  'where do you study': 'I study Information Technology at NIT Jalandhar, one of the top engineering colleges in India.',
  
  // Technical Skills
  'skills': 'My core technical skills include: Frontend - React, TypeScript, TailwindCSS, Vite. Backend - Node.js, Express, REST APIs. Databases - MongoDB, PostgreSQL. Tools - Git, Docker, VS Code. I also have strong problem-solving skills from competitive programming.',
  'frontend': 'I\'m proficient in modern frontend technologies: React 18, TypeScript, TailwindCSS, React Router, Zustand for state management, and Vite for blazing-fast builds. I focus on creating responsive, accessible, and performant user interfaces.',
  'backend': 'On the backend, I work with Node.js and Express to build RESTful APIs. I have experience with both SQL (PostgreSQL) and NoSQL (MongoDB) databases, implementing authentication, authorization, and data modeling.',
  'react': 'React is my primary frontend framework. I\'m experienced with hooks, context, custom hooks, performance optimization, and modern patterns like composition. I also use TypeScript for type safety.',
  'typescript': 'I use TypeScript extensively in all my projects for type safety, better IDE support, and catching errors early. It makes my code more maintainable and self-documenting.',
  'node': 'I build backend services with Node.js and Express, handling authentication, database operations, file uploads, and API design. I focus on clean architecture and scalability.',
  'database': 'I work with both SQL (PostgreSQL for complex queries and relations) and NoSQL (MongoDB for flexibility). I design efficient schemas and optimize queries for performance.',
  'what can you do': 'I can build full-stack web applications from scratch, including responsive UIs, REST APIs, database design, authentication systems, and deployment. I also solve complex algorithmic problems.',
  
  // Projects - Gym Management System
  'projects': 'I have built three major projects: 1) Gym Management System - Enterprise-level gym operations platform, 2) SnippetSync - Code snippet organization tool for developers, 3) Excelidraw - Collaborative drawing and diagramming application. Each demonstrates different aspects of full-stack development.',
  'gym management': 'The Gym Management System is a comprehensive enterprise solution for fitness centers. Features include: member registration & profiles, attendance tracking with QR codes, automated billing & payments, trainer management, workout plans, inventory tracking, and detailed analytics. Built with React, TypeScript, Node.js, PostgreSQL, and JWT authentication.',
  'gym project': 'This project handles the complete lifecycle of gym operations - from member onboarding to payment processing. It includes role-based access control (admin, trainer, member), automated email notifications, and responsive design for mobile use.',
  'gym features': 'Key features: Member management dashboard, QR code-based attendance, automated payment reminders, trainer assignment, workout plan templates, inventory management, revenue analytics, and multi-branch support.',
  'gym tech': 'Technical stack: Frontend - React, TypeScript, TailwindCSS. Backend - Node.js, Express, RESTful APIs. Database - PostgreSQL with complex relations. Auth - JWT tokens. Additional - QR code generation, email integration, PDF reports.',
  
  // Projects - SnippetSync
  'snippetsync': 'SnippetSync is a modern code snippet manager designed for developers. It helps organize, search, and share code snippets efficiently. Features include: syntax highlighting for 50+ languages, intelligent tagging system, full-text search, collections/folders, sharing with teams, and dark mode support.',
  'snippet': 'SnippetSync solves the problem of scattered code snippets across different files and notes. It provides a centralized, searchable repository with beautiful syntax highlighting and organization features.',
  'snippetsync features': 'Core features: Multi-language syntax highlighting, tag-based organization, powerful search (by language, tags, content), snippet collections, public/private sharing, favorites, copy-to-clipboard, markdown support in descriptions, and responsive design.',
  'snippetsync tech': 'Built with: React for UI, Monaco Editor for code editing, Prism.js for syntax highlighting, MongoDB for storage, Node.js/Express backend, and Zustand for state management.',
  
  // Projects - Excelidraw
  'excelidraw': 'Excelidraw is a collaborative drawing and diagramming tool inspired by Excalidraw. It enables real-time collaboration on sketches, diagrams, and flowcharts. Features include: freehand drawing, shapes, arrows, text, layers, undo/redo, export to PNG/SVG, and real-time multiplayer.',
  'drawing': 'Excelidraw lets you create hand-drawn style diagrams perfect for technical documentation, brainstorming, and visual communication. It has an intuitive interface with minimal learning curve.',
  'excelidraw features': 'Key capabilities: Freehand pen tool, geometric shapes, arrow connectors, text annotations, color picker, layer management, infinite canvas, zoom controls, keyboard shortcuts, export options, and collaboration features.',
  'excelidraw tech': 'Technology: React for UI, Canvas API for rendering, WebSocket for real-time sync, TypeScript for type safety, and custom algorithms for smooth drawing and shape detection.',
  
  // Competitive Programming
  'competitive programming': 'I am an active competitive programmer on LeetCode (username: unknown_man4). I have solved 450+ problems across all difficulty levels and regularly participate in weekly and biweekly contests. My focus areas include dynamic programming, graphs, trees, and advanced data structures.',
  'leetcode': 'I practice on LeetCode with username "unknown_man4". I maintain a consistent solving streak, participate in contests, and have achieved a good contest rating. I focus on understanding patterns rather than memorizing solutions.',
  'cp': 'Competitive programming has sharpened my problem-solving abilities significantly. I practice daily, focusing on topics like DP, graphs, segment trees, and optimization techniques. It helps me write efficient production code.',
  'algorithms': 'I have strong knowledge of algorithms including: sorting, searching, graph traversal (DFS/BFS), dynamic programming, greedy algorithms, backtracking, divide and conquer, and string algorithms like KMP and Rabin-Karp.',
  'data structures': 'I\'m proficient with: arrays, linked lists, stacks, queues, trees (binary, BST, AVL), graphs, heaps, hash tables, tries, segment trees, and union-find. I choose the right structure for optimal performance.',
  'contest': 'I regularly participate in LeetCode weekly and biweekly contests. These contests help me practice solving problems under time pressure and improve my speed and accuracy.',
  'problems solved': 'I have solved over 450 problems on LeetCode spanning easy, medium, and hard difficulties. Each problem teaches me new patterns and optimization techniques.',
  'rating': 'I maintain an active contest rating on LeetCode and consistently work on improving it through regular participation and practice.',
  
  // Blog & Writing
  'blog': 'I write technical blog posts about web development, algorithms, problem-solving strategies, and my learning journey. Topics include React patterns, TypeScript tips, algorithm explanations, and project retrospectives. Check the Blog section!',
  'articles': 'My blog articles cover practical development topics with code examples and detailed explanations. I write to help others learn and to solidify my own understanding.',
  'writing': 'I believe in learning by teaching. Writing technical content helps me understand concepts deeply and contribute to the developer community.',
  
  // Contact & Social
  'contact': 'You can reach me through: GitHub (for code and projects), LinkedIn (for professional networking), Email (for direct communication), or Twitter (for tech discussions). All links are in the footer!',
  'email': 'Feel free to email me for collaboration, opportunities, or questions. You\'ll find the email link in the footer section of this website.',
  'github': 'Check out my GitHub profile for all my projects, contributions, and code samples. The link is available in the footer - I keep my repositories well-documented!',
  'linkedin': 'Connect with me on LinkedIn for professional networking. You can find the link in the footer section.',
  'social': 'I\'m active on GitHub, LinkedIn, and Twitter. All my social links are conveniently placed in the footer for easy access.',
  'hire': 'I\'m open to internships, freelance projects, and full-time opportunities in full-stack development. Feel free to reach out via email or LinkedIn!',
  'collaborate': 'I love collaborating on interesting projects! If you have an idea or need a developer, reach out through email or GitHub. Let\'s build something awesome together!',
  
  // Website & Tech
  'website': 'This is my personal portfolio website showcasing my projects, blog posts, and competitive programming journey. It\'s built with modern web technologies and designed for optimal performance and user experience.',
  'tech stack': 'This website is built using: React 18 (with hooks), TypeScript (for type safety), Vite (lightning-fast builds), TailwindCSS (utility-first styling), React Router v6 (navigation), Zustand (state management), and react-helmet-async (SEO).',
  'portfolio': 'My portfolio demonstrates my skills in frontend development, UI/UX design, and building responsive applications. Every component is carefully crafted and optimized.',
  'design': 'The website features a minimalist design with a clean serif/sans-serif font pairing, smooth animations, dark mode support, and a focus on readability and user experience.',
  'performance': 'This site is optimized for performance with code splitting, lazy loading, optimized images, and minimal JavaScript. It scores high on Lighthouse metrics.',
  'responsive': 'The entire website is fully responsive, working beautifully on mobile phones, tablets, and desktop screens of all sizes.',
  
  // Career & Learning
  'experience': 'I have hands-on experience building full-stack applications, contributing to open source, and solving 450+ competitive programming problems. Each project has taught me valuable lessons in software engineering.',
  'learning': 'I\'m constantly learning new technologies and best practices. Currently exploring advanced React patterns, system design, and cloud technologies like AWS and Docker.',
  'goals': 'My goals include: mastering system design, contributing to major open-source projects, achieving higher contest ratings, and eventually building products that impact millions of users.',
  'future': 'I aim to become a well-rounded software engineer who can architect scalable systems, lead technical teams, and create innovative solutions to real-world problems.',
  'internship': 'I\'m actively seeking internship opportunities where I can apply my skills, learn from experienced engineers, and contribute to meaningful projects.',
  
  // Miscellaneous
  'help': 'I can answer questions about: my background, education, technical skills, projects (features, tech stack), competitive programming, blog, contact info, career goals, and this website. Try asking about specific projects or technologies!',
  'questions': 'Feel free to ask me about: Navdeep\'s education, technical skills, any of his three projects, competitive programming achievements, blog topics, how to contact him, or anything about this website!',
  'hobbies': 'Apart from coding, I enjoy solving algorithmic puzzles, reading tech blogs, exploring new frameworks, and contributing to open source projects. Programming is both my passion and hobby!',
  'motivation': 'I\'m driven by the desire to build things that solve real problems and make people\'s lives easier. Seeing my code in action and users benefiting from my work is incredibly rewarding.',
};

export default function Chatbot() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello, I'm here to answer your questions about Navdeep's work, projects, and experience. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Lock body scroll when chatbot is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const findBestMatch = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Score each knowledge base entry
    let bestMatch = '';
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
      let score = 0;
      const keywords = key.split(' ');
      
      // Exact match gets highest score
      if (lowerQuery === key) {
        score = 100;
      }
      // Check if query contains the key
      else if (lowerQuery.includes(key)) {
        score = 80;
      }
      // Check if key contains the query
      else if (key.includes(lowerQuery)) {
        score = 70;
      }
      // Check for keyword matches
      else {
        keywords.forEach(keyword => {
          if (lowerQuery.includes(keyword) && keyword.length > 2) {
            score += 20;
          }
        });
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = value;
      }
    }
    
    // If we found a good match, return it
    if (bestScore >= 20) {
      return bestMatch;
    }

    // Check for common greetings
    if (/^(hi|hello|hey|greetings|yo|sup)/i.test(lowerQuery)) {
      return "Hello. How can I help you learn more about Navdeep today?";
    }
    
    // Check for thanks
    if (/^(thanks|thank you|thx|ty)/i.test(lowerQuery)) {
      return "You're welcome. Feel free to ask anything else about Navdeep's work, skills, or projects.";
    }

    // Default response with suggestions
    return "I don't have specific information on that topic. You can ask me about:\n\n• Education and background\n• Technical skills (React, TypeScript, Node.js)\n• Projects: Gym Management, SnippetSync, Excelidraw\n• Competitive programming achievements\n• Blog articles\n• Contact information\n\nPlease try rephrasing your question.";
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userInput = input;
    
    // Add user message
    const userMessage: Message = {
      text: userInput,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate realistic typing delay based on response length
    const response = findBestMatch(userInput);
    const typingDelay = Math.min(800 + response.length * 10, 2000);
    
    setTimeout(() => {
      const botResponse: Message = {
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className={`group relative p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
              theme === 'dark'
                ? 'bg-[#0a0a0a] border border-gray-800 hover:border-gray-700'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
            aria-label="Open assistant"
          >
            <MessageSquare 
              size={20} 
              className={`sm:w-6 sm:h-6 transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-400 group-hover:text-white' 
                  : 'text-gray-600 group-hover:text-gray-900'
              }`}
            />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-[400px] h-[500px] sm:h-[600px] rounded-lg flex flex-col z-50 shadow-2xl border ${
            theme === 'dark' 
              ? 'bg-[#0a0a0a] border-gray-800' 
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <MessageSquare size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <h3 className={`font-sans text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Assistant
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-md transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-900' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div 
            className={`chatbot-messages flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            }`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: theme === 'dark' ? '#1f1f1f #000000' : '#d1d5db #f9fafb'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg ${
                    message.isBot
                      ? theme === 'dark'
                        ? 'bg-[#0a0a0a] border border-gray-800 text-gray-200'
                        : 'bg-white border border-gray-200 text-gray-900'
                      : theme === 'dark'
                      ? 'bg-gray-900 border border-gray-800 text-gray-200'
                      : 'bg-gray-900 text-gray-100'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1.5 font-mono ${
                      message.isBot
                        ? theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`px-4 py-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-[#0a0a0a] border border-gray-800' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 sm:p-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                disabled={isTyping}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md border font-sans text-base sm:text-sm focus:outline-none focus:ring-1 transition-all ${
                  theme === 'dark'
                    ? 'bg-black border-gray-800 text-white placeholder-gray-600 focus:ring-gray-700 focus:border-gray-700'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-300 focus:border-gray-300'
                } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md transition-all flex items-center justify-center ${
                  !input.trim() || isTyping
                    ? theme === 'dark'
                      ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
                aria-label="Send message"
              >
                <Send size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
