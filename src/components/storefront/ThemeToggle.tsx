'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme, locale, toggleLocale } = useThemeStore();
  const isAr = locale === 'ar';

  return (
    <div className="inline-flex h-10 items-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-1 shadow-sm">
      <button
        onClick={toggleLocale}
        type="button"
        title={isAr ? 'Switch to English' : 'التبديل إلى اللغة العربية'}
        aria-label="Toggle language"
        className="flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold text-[var(--text-primary)] transition-all hover:bg-[#CCFF00] hover:text-black whitespace-nowrap"
      >
        {isAr ? 'EN' : 'عربي'}
      </button>

      <span className="mx-0.5 h-4 w-[1px] bg-[var(--border)]" />

      <button
        onClick={toggleTheme}
        type="button"
        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        aria-label="Toggle theme"
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-card-hover)] hover:text-[#CCFF00]"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-[#CCFF00]" />
        ) : (
          <Moon className="h-4 w-4 text-[#111111]" />
        )}
      </button>
    </div>
  );
}
