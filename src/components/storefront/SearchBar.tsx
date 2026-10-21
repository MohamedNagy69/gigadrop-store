'use client';

import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { locale } = useThemeStore();
  const t = translations[locale];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="h-11 w-full rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] ps-10 pe-20 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[#CCFF00]"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute end-12 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <kbd className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
        ⌘K
      </kbd>
    </div>
  );
}
