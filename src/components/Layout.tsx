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
    <div className={`min-h-screen flex transition-colors duration-300 overflow-x-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`} data-theme={theme}>
      <Header />
      {/* Mobile: Add top padding for fixed header, Desktop: Add left margin for sidebar */}
      <div className="flex-1 pt-16 lg:pt-0 lg:ml-28 overflow-x-hidden w-full">
        {/* 90% width container for better aesthetics on desktop, full width on mobile */}
        <div className="w-full lg:w-[90%] mx-auto overflow-x-hidden">
          <main className="min-h-screen overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </div>
        <Chatbot />
      </div>
    </div>
  );
}
