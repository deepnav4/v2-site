import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'dark' | 'light';
  toggleTheme: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: async (event?: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        
        // Check if View Transitions API is supported
        if (!document.startViewTransition || !event) {
          set({ theme: newTheme });
          return;
        }

        const { clientX, clientY } = event;
        const endRadius = Math.hypot(
          Math.max(clientX, window.innerWidth - clientX),
          Math.max(clientY, window.innerHeight - clientY)
        );

        const transition = document.startViewTransition(() => {
          set({ theme: newTheme });
        });

        await transition.ready;

        const clipPath = [
          `circle(0px at ${clientX}px ${clientY}px)`,
          `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 600,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
