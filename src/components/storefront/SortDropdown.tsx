'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { translations } from '@/lib/i18n';

interface SortDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { locale } = useThemeStore();
  const t = translations[locale];

  return (
    <div className="relative inline-flex items-center">
      <ArrowUpDown className="pointer-events-none absolute start-3.5 h-3.5 w-3.5 text-[#CCFF00]" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort games"
        className="h-11 appearance-none rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] ps-9 pe-8 text-sm font-medium text-[var(--text-primary)] outline-none transition-colors focus:border-[#CCFF00] cursor-pointer"
      >
        <option value="featured">{t.sortFeatured}</option>
        <option value="name">{t.sortNameAZ}</option>
        <option value="releaseDate">{t.sortReleaseDate}</option>
        <option value="sizeAsc">{t.sortSizeAsc}</option>
        <option value="sizeDesc">{t.sortSizeDesc}</option>
      </select>
    </div>
  );
}
