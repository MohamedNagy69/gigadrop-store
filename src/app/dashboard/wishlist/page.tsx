'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Paper, Typography } from '@mui/material';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { GameItem } from '@/types';
import GameCard from '@/components/storefront/GameCard';

export default function WishlistPage() {
  const { wishlistIds } = useCartStore();
  const { locale } = useThemeStore();
  const isAr = locale === 'ar';

  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => {
        if (data.games) {
          setGames(data.games);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const wishedGames = games.filter((g) => wishlistIds.includes(g.id));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#CCFF00]">
          {isAr ? 'محفوظة لوقت لاحق' : 'SAVED FOR LATER'}
        </span>
        <Typography variant="h4" fontWeight={800}>
          {isAr
            ? `قائمة الأمنيات (${wishedGames.length})`
            : `My Wishlist (${wishedGames.length})`}
        </Typography>
      </div>

      {loading ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          {isAr ? 'جاري تحميل قائمة الأمنيات...' : 'Loading wishlist...'}
        </Paper>
      ) : wishedGames.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6">
            {isAr ? 'قائمة الأمنيات فارغة حالياً' : 'Your wishlist is empty'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isAr
              ? 'اضغط على أيقونة القلب على أي لعبة في المتجر لحفظها هنا.'
              : 'Click the heart icon on any game card in the storefront to save it here.'}
          </Typography>
          <Link
            href="/#library"
            className="mt-4 inline-block rounded-[8px] bg-[#CCFF00] px-6 py-2.5 text-xs font-extrabold text-black"
          >
            {isAr ? 'تصفح مكتبة الألعاب ›' : 'Explore Game Library ›'}
          </Link>
        </Paper>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
