import type { ReactNode } from 'react';
import { useTheme } from '../store/themeStore';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} data-theme={theme}>
      <Header />
      <div className="flex-1 ml-28">
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
