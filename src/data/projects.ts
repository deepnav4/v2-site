export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: 'featured' | 'personal' | 'hackathon';
  date: string;
  technologies: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'gym-management-system',
    title: 'Gym Management System',
    description: 'Designed and deployed a scalable gym management platform using a Dockerized microservices architecture. Implemented automated CI/CD workflows via GitHub Actions to streamline deployment. Developed dashboards for members and trainers with real-time analytics.',
    category: 'featured',
    date: '2024',
    technologies: ['Docker', 'NGINX', 'GitHub Actions', 'Node.js', 'React', 'Microservices'],
    github: 'https://github.com/deepnav4/Gym-Manangment',
    demo: 'https://gym-manangment.vercel.app'
  },
  {
    id: 2,
    slug: 'snippetsync',
    title: 'SnippetSync',
    description: 'Developed a real-time collaborative code editor supporting live cursors and instant updates. Integrated Redis Pub/Sub to distribute events across scalable backend instances. Created a companion VS Code extension for syncing code edits from the IDE.',
    category: 'featured',
    date: '2024',
    technologies: ['React', 'Node.js', 'Redis', 'Docker', 'WebSockets', 'VS Code Extension'],
    github: 'https://github.com/deepnav4/snippetSync',
    demo: 'https://snippet-sync-orpin.vercel.app'
  },
  {
    id: 3,
    slug: 'excelidraw',
    title: 'ExceliDraw',
    description: 'Implemented a collaborative whiteboard from scratch using pure Canvas API. Built multi-user real-time sync, undo/redo operations, and object transform features. Optimized rendering to maintain 60fps smooth drawing for concurrent users.',
    category: 'featured',
    date: '2024',
    technologies: ['Canvas API', 'WebSockets', 'JavaScript', 'Real-time Sync'],
    github: 'https://github.com/deepnav4/turborepo-draw-app'
  },
  {
    id: 4,
    slug: 'rideshare',
    title: 'RideShare',
    description: 'Built a full-stack ride booking platform integrating Google Maps for real-time location tracking. Implemented JWT authentication and secure route-based access control. MERN stack application with production-ready features.',
    category: 'featured',
    date: '2024',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Google Maps API', 'JWT'],
    github: 'https://github.com/thedevsumit/RideShare',
    demo: 'https://ride-share-nine.vercel.app'
  },
  {
    id: 5,
    slug: 'chatapp',
    title: 'ChatApp',
    description: 'Created a real-time chat platform supporting group and private messaging. Implemented typing indicator, online status and persistent chat storage. Built with Socket.io for real-time bidirectional communication.',
    category: 'personal',
    date: '2024',
    technologies: ['Socket.io', 'Express.js', 'React', 'MongoDB', 'Real-time'],
    github: 'https://github.com/deepnav4/chat-app',
    demo: 'https://real-time-chat-liard.vercel.app'
  },
  {
    id: 6,
    slug: 'nit-jalandhar-tnp',
    title: 'NIT Jalandhar T&P Website',
    description: 'Contributed to the official Training & Placement website of NIT Jalandhar. Worked on improving user experience and implementing new features for better placement management.',
    category: 'personal',
    date: '2024',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express.js'],
  },
  {
    id: 7,
    slug: 'it1dxpert',
    title: 'IT1DXpert Conference Website',
    description: 'Developed conference website for IT1DXpert. Implemented responsive design and registration system for conference attendees.',
    category: 'personal',
    date: '2024',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    demo: 'https://it1dxpert.org'
  },
  {
    id: 8,
    slug: 'eaic-nitj',
    title: 'EAIC NITJ Website',
    description: 'Built conference website for EAIC at NIT Jalandhar. Features include event schedules, speaker profiles, and registration management.',
    category: 'personal',
    date: '2024',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    demo: 'https://eaicnitj.com'
  },
  {
    id: 9,
    slug: 'cf-ladder',
    title: 'CF Ladder',
    description: 'Personalized Codeforces problem ladder system leveraging contest performance metrics. Features adaptive difficulty calibration and progress tracking.',
    category: 'featured',
    date: '2024',
    technologies: ['Codeforces API', 'Redis', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    demo: '/ladder'
  },
  {
    id: 10,
    slug: 'portfolio',
    title: 'Portfolio Website',
    description: 'Personal portfolio website showcasing projects, blog posts, and professional experience. Built with modern web technologies and optimized for performance.',
    category: 'personal',
    date: '2024',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/deepnav4/v2.site',
    demo: 'https://navdeep-site.vercel.app'
  }
];
