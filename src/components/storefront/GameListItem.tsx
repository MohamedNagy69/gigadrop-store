'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Check, Plus } from 'lucide-react';
import { GameItem } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { translations, genreTranslations } from '@/lib/i18n';
import { formatNumber } from '@/lib/utils';

export default function GameListItem({ game }: { game: GameItem }) {
  const { addItem, removeItem, isInCart, wishlistIds, toggleWishlist } = useCartStore();
  const { locale } = useThemeStore();
  const t = translations[locale];
  const added = isInCart(game.id);
  const wished = wishlistIds.includes(game.id);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg-card)] p-3.5 transition-colors hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
      {/* Left: Thumbnail + Metadata */}
      <div className="flex items-center gap-4">
        <Link
          href={`/games/${game.id}`}
          className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-[8px] bg-black"
        >
          <img
            src={game.coverImage}
            alt={game.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Link>

        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#CCFF00] px-1.5 py-0.5 text-[10px] font-extrabold text-black">
              {game.releaseYear}
            </span>
            {game.isOP && (
              <span className="rounded border border-[#CCFF00]/50 px-1.5 py-0.5 text-[10px] font-bold text-[#CCFF00]">
                OP
              </span>
            )}
            <span className="text-xs text-[var(--text-secondary)]">
              {game.genre
                .map((g) => (locale === 'ar' ? genreTranslations[g] || g : g))
                .join(' · ')}
            </span>
          </div>

          <Link
            href={`/games/${game.id}`}
            dir="ltr"
            className="mt-1 block text-base font-bold text-[var(--text-primary)] hover:text-[#CCFF00]"
          >
            {game.name} ›
          </Link>

          <p className="text-xs text-[var(--text-secondary)]">
            {t.pcGame} ·{' '}
            <strong className="text-[var(--text-primary)]">
              {formatNumber(game.sizeGB)} {t.gbUnit}
            </strong>
          </p>
        </div>
      </div>

      {/* Right: Price + Wishlist + Add Button */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[var(--border)] pt-3 sm:pt-0">
        <div className="text-start sm:text-end">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.priceLabel}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[var(--text-primary)]">
              {formatNumber(game.price)}
            </span>
            <span className="text-xs font-semibold text-[#CCFF00]">
              {t.egpCurrency}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(game.id)}
            aria-label="Toggle wishlist"
            className={`flex h-9 w-9 items-center justify-center rounded-[8px] border transition-colors ${
              wished
                ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[#CCFF00]'
            }`}
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-black' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() =>
              added
                ? removeItem(game.id)
                : addItem({
                    id: game.id,
                    name: game.name,
                    coverImage: game.coverImage,
                    sizeGB: game.sizeGB,
                    price: game.price,
                    releaseYear: game.releaseYear,
                    genre: game.genre,
                  })
            }
            className={`inline-flex h-9 items-center gap-1.5 rounded-[8px] px-4 text-xs font-bold transition-all ${
              added
                ? 'border border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                : 'bg-[#CCFF00] text-black hover:bg-[#B8E600]'
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
