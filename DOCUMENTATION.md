# Project Documentation

## 📋 Overview

This is a complete portfolio and blog website built with modern web technologies, featuring:
- Personal homepage with hero section
- Blog with filtering and tagging
- Projects showcase
- About page
- Codeforces ladder tool
- Fully responsive design

## 🏗️ Architecture

### Directory Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation bar (sticky)
│   ├── Footer.tsx          # Footer with social links
│   └── Layout.tsx          # Wrapper component
├── pages/
│   ├── Home.tsx            # Landing page
│   ├── About.tsx           # Profile & bio
│   ├── Blog.tsx            # Blog listing
│   ├── BlogPost.tsx        # Individual post
│   ├── Projects.tsx        # Project showcase
│   ├── Tags.tsx            # Tag browser
│   └── Ladder.tsx          # CF Ladder tool
├── data/
│   ├── blogPosts.ts        # Blog metadata
│   └── projects.ts         # Project data
└── content/
    └── blog/               # Markdown files
```

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: Gray (#666666)
- **Accent**: Blue (#0066cc)
- **Border**: Light Gray (#e5e5e5)

### Typography
- **Sans**: Inter, system-ui
- **Mono**: JetBrains Mono, Monaco

### Components
- Cards with hover effects
- Responsive navigation
- Tag filters
- Project cards with tech stacks
- Blog post previews

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Content Management

### Blog Posts

1. **Add metadata** to `src/data/blogPosts.ts`:

```typescript
{
  id: '6',
  slug: 'your-post-slug',
  title: 'Your Post Title',
  date: 'December 12, 2025',
  readTime: '10 min read',
  category: 'programming',
  excerpt: 'Brief description...',
  tags: ['javascript', 'tutorial']
}
```

2. **Create markdown file** in `src/content/blog/your-post-slug.md`:

```markdown
---
title: "Your Post Title"
date: "December 12, 2025"
category: "programming"
tags: ["javascript", "tutorial"]
excerpt: "Brief description..."
---

# Your Post Title

Content here...
```

### Projects

Add to `src/data/projects.ts`:

```typescript
{
  id: 15,
  title: 'Project Name',
  description: 'Description...',
  category: 'featured', // or 'personal', 'hackathon'
  date: 'December 2025',
  technologies: ['React', 'TypeScript'],
  github: 'https://github.com/user/repo',
  demo: 'https://demo.com'
}
```

## 🛣️ Routes

- `/` - Home
- `/about` - About page
- `/blog` - Blog listing
- `/blog/:slug` - Individual post
- `/projects` - Projects showcase
- `/tags` - All tags
- `/tags/:tag` - Posts by tag
- `/ladder` - Codeforces Ladder tool

## 🎯 Features Implemented

✅ React Router DOM for navigation
✅ TypeScript for type safety
✅ Tailwind CSS for styling
✅ Responsive design (mobile-first)
✅ Component-based architecture
✅ SEO meta tags
✅ Blog post filtering by tags
✅ Project filtering by category
✅ Reusable card components
✅ Social media links
✅ Form inputs (Ladder tool)

## 🔧 Configuration Files

### tailwind.config.js
Custom theme with colors, fonts, and typography plugin

### postcss.config.js
PostCSS configuration for Tailwind

### tsconfig.json
TypeScript compiler options

### vite.config.ts
Vite build configuration

## 📦 Dependencies

### Core
- react: ^19.2.0
- react-dom: ^19.2.0
- react-router-dom: ^7.1.3

### Styling
- tailwindcss: ^3.4.17
- @tailwindcss/typography: ^0.5.16

### Content
- react-markdown: ^9.0.2
- gray-matter: ^4.0.3
- remark-gfm: ^4.0.0

### Icons
- lucide-react: ^0.469.0

### Dev Tools
- typescript: ~5.9.3
- vite: ^7.2.4
- @vitejs/plugin-react: ^5.1.1

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  accent: '#your-color',
}
```

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Header.tsx`

### Modify Layout
Edit `src/components/Layout.tsx` to change overall structure

## 🐛 Troubleshooting

### Tailwind styles not applying
- Ensure `index.css` imports Tailwind directives
- Check `tailwind.config.js` content paths
- Restart dev server

### Routes not working
- Verify React Router DOM is installed
- Check route paths in `App.tsx`
- Ensure `BrowserRouter` wraps the app

### TypeScript errors
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` settings
- Restart TypeScript server in IDE

## 📈 Performance

- Built with Vite for fast HMR
- Optimized bundle splitting
- Lazy loading for routes (can be added)
- Image optimization (can be added)

## 🔒 SEO

Meta tags included in `index.html`:
- Title
- Description
- Open Graph tags

Can be extended with:
- Sitemap generation
- robots.txt
- Structured data (JSON-LD)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev/guide/)

---

Built with React + TypeScript + Tailwind CSS
