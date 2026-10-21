'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Check, Plus } from 'lucide-react';
import { GameItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations, genreTranslations } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils';

interface GameCardProps {
  game: GameItem;
}

export default function GameCard({ game }: GameCardProps) {
  const { addItem, removeItem, isInCart, wishlistIds, toggleWishlist } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];

  const added = isInCart(game.id);
  const wished = wishlistIds.includes(game.id);

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) {
      removeItem(game.id);
    } else {
      addItem({
        id: game.id,
        name: game.name,
        coverImage: game.coverImage,
        sizeGB: game.sizeGB,
        price: game.price,
        releaseYear: game.releaseYear,
        genre: game.genre,
      });
    }
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(game.id);
  };

  return (
    <div className="game-card-anim group relative flex flex-col overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] transition-all duration-300 hover:scale-[1.02] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
      {/* Tall Cover Image (~3:4 ratio) */}
      <Link
        href={`/games/${game.id}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-[#0A0A0A]"
      >
        <img
          src={game.coverImage}
          alt={game.name}
          loading="lazy"
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
        />

        {/* Dark Gradient Overlay at bottom of cover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

        {/* Top-left Badges: Year pill + OP badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5" dir="ltr">
          <span className="rounded-[6px] bg-[#CCFF00] px-2.5 py-0.5 text-[11px] font-extrabold text-black">
            {game.releaseYear}
          </span>
          {game.isOP && (
            <span className="rounded-[6px] border border-[#CCFF00]/60 bg-black/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#CCFF00] backdrop-blur-sm">
              OP
            </span>
          )}
        </div>

        {/* Top-right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWish}
          aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all ${
            wished
              ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
              : 'border-white/20 bg-black/60 text-white hover:border-[#CCFF00] hover:text-[#CCFF00]'
          }`}
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-black' : ''}`} />
        </button>

        {/* Game Name + Year Overlay at Bottom of Image */}
        <div className="absolute inset-x-3 bottom-3">
          <div className="flex flex-wrap gap-1 mb-1">
            {game.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs"
              >
                {locale === 'ar' ? genreTranslations[g] || g : g}
              </span>
            ))}
          </div>
          <p className="line-clamp-1 text-sm font-bold text-white drop-shadow" dir="ltr">
            {game.name}
          </p>
        </div>
      </Link>

      {/* Card Body Below Image */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link
            href={`/games/${game.id}`}
            className="group/title flex items-center justify-between gap-1 text-[16px] font-semibold text-[var(--text-primary)] transition-colors hover:text-[#CCFF00]"
          >
            <span className="line-clamp-1" dir="ltr">{game.name}</span>
            <span className="text-[#CCFF00] transition-transform group-hover/title:translate-x-0.5">
              ›
            </span>
          </Link>
          <p className="mt-1 text-xs font-medium text-[var(--text-secondary)]">
            {t.pcGame} · {formatNumber(game.sizeGB)} {t.gbUnit}
          </p>
        </div>

        {/* Price Row + "+ Add" Button */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {t.priceLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold text-[var(--text-primary)]">
                {formatNumber(game.price)}
              </span>
              <span className="text-[12px] font-medium text-[#CCFF00]">
                {t.egpCurrency}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleCart}
            className={`inline-flex items-center gap-1 rounded-[8px] px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
              added
                ? 'border border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                : 'bg-[#CCFF00] text-black hover:bg-[#B8E600] hover:scale-105'
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{t.addedBtn.replace('✓ ', '')}</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>{t.addBtn.replace('+ ', '')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
