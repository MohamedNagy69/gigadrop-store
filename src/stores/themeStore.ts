'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocaleType } from '@/types';

interface ThemeState {
  theme: 'dark' | 'light';
  locale: LocaleType;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleLocale: () => void;
  setLocale: (locale: LocaleType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      locale: 'ar',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
      },
      setTheme: (theme) => set({ theme }),
      toggleLocale: () => {
        const next = get().locale === 'en' ? 'ar' : 'en';
        set({ locale: next });
      },
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'gigadrop-theme-v2-storage',
    }
  )
);
