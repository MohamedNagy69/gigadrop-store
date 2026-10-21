'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex h-11 items-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] p-1">
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        className={`flex h-full items-center justify-center rounded-[6px] px-3 transition-colors ${
          view === 'grid'
            ? 'bg-[#CCFF00] text-black font-bold'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label="List view"
        className={`flex h-full items-center justify-center rounded-[6px] px-3 transition-colors ${
          view === 'list'
            ? 'bg-[#CCFF00] text-black font-bold'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
