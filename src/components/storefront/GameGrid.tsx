'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { GameItem } from '@/types';
import GameCard from './GameCard';
import GameListItem from './GameListItem';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import ViewToggle from './ViewToggle';
import { ALL_GENRES } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations, genreTranslations } from '@/lib/i18n';
import { Clock, Trash2 } from 'lucide-react';

interface GameGridProps {
  initialGames: GameItem[];
  initialGenre?: string;
  ratePerGB?: number;
  showCategoryBanner?: boolean;
}

export default function GameGrid({
  initialGames,
  initialGenre = 'All',
  ratePerGB = 1.0,
  showCategoryBanner = false,
}: GameGridProps) {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(16);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const { recentlyViewedIds, clearRecentlyViewed } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];

  const filteredGames = useMemo(() => {
    let list = [...initialGames];

    if (selectedGenre && selectedGenre !== 'All') {
      list = list.filter((g) =>
        g.genre.some((gen) => gen.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          g.genre.some((gen) => gen.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'releaseDate':
          return b.releaseYear - a.releaseYear;
        case 'sizeAsc':
          return a.sizeGB - b.sizeGB;
        case 'sizeDesc':
          return b.sizeGB - a.sizeGB;
        case 'featured':
        default:
          if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
          if (a.isOP !== b.isOP) return a.isOP ? -1 : 1;
          return b.releaseYear - a.releaseYear;
      }
    });

    return list;
  }, [initialGames, selectedGenre, search, sort]);

  const recentlyViewedGames = useMemo(() => {
    return recentlyViewedIds
      .map((id) => initialGames.find((g) => g.id === id))
      .filter(Boolean) as GameItem[];
  }, [recentlyViewedIds, initialGames]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.game-card-anim',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [selectedGenre, sort, view]);

  const displayedGames = filteredGames.slice(0, visibleCount);

  return (
    <>
      {showCategoryBanner && (
        <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-12">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {locale === 'ar' ? 'تصفح حسب التصنيف' : 'BROWSE BY CATEGORY'}
            </span>
            <h1 className="mt-1 text-4xl sm:text-5xl font-bold text-[var(--text-primary)]">
              {selectedGenre === 'All'
                ? locale === 'ar'
                  ? 'جميع تصنيفات ألعاب الكمبيوتر'
                  : 'All PC Game Genres'
                : locale === 'ar'
                ? `ألعاب ${genreTranslations[selectedGenre] || selectedGenre}`
                : `${selectedGenre} Games`}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {locale === 'ar'
                ? `صفِّ الألعاب حسب التصنيف، المساحة، أو سنة الإصدار. السعر ${ratePerGB.toFixed(2)} ج.م لكل جيجابايت.`
                : `Filter titles by genre, storage size, or release year. Priced at ${ratePerGB.toFixed(2)} EGP per GB.`}
            </p>
          </div>
        </div>
      )}
      <section id="library" className="py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
              {t.theLibrary}
            </span>
            <h2 className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.chooseYourGames}
            </h2>
            <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
              {initialGames.length} {t.librarySubtitle}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-flex items-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#CCFF00]">
              {filteredGames.length} {t.gamesCounter}
            </span>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {['All', ...ALL_GENRES].map((genre) => {
            const active = selectedGenre.toLowerCase() === genre.toLowerCase();
            const label =
              locale === 'ar' ? genreTranslations[genre] || genre : genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => {
                  setSelectedGenre(genre);
                  setVisibleCount(16);
                }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#CCFF00] text-black font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                    : 'border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[#CCFF00] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex items-center gap-3">
            <SortDropdown value={sort} onChange={setSort} />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        {/* Games Grid or List View */}
        <div ref={gridRef}>
          {displayedGames.length === 0 ? (
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] py-16 text-center">
              <p className="text-lg font-semibold text-[var(--text-primary)]">
                {t.noGamesMatch} &ldquo;{search || selectedGenre}&rdquo;
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {t.tryClearingSearch}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedGenre('All');
                }}
                className="mt-4 rounded-[8px] bg-[#CCFF00] px-5 py-2 text-xs font-bold text-black"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedGames.map((game) => (
                <GameListItem key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredGames.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 16)}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[#CCFF00] bg-[var(--bg-card)] px-8 py-3.5 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[#CCFF00] hover:text-black"
            >
              {t.loadMore} ({filteredGames.length - visibleCount} {t.remaining})
            </button>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewedGames.length > 0 && (
          <div className="mt-20 border-t border-[var(--border)] pt-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#CCFF00]" />
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {t.recentlyViewed}
                </h3>
              </div>
              <button
                type="button"
                onClick={clearRecentlyViewed}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[#FF4444]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.clearHistory}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewedGames.slice(0, 4).map((game) => (
                <GameCard key={`recent-${game.id}`} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
