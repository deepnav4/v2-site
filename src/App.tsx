import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tags from './pages/Tags';
import NotFound from './pages/NotFound';
import Competitive from './pages/Competitive.tsx';
import Creator from './pages/Creator';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/:tag" element={<Blog />} />
          <Route path="/competitive" element={<Competitive />} />
          <Route path="/creator" element={<Creator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
