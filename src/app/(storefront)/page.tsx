import React from 'react';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import Hero from '@/components/storefront/Hero';
import GameGrid from '@/components/storefront/GameGrid';
import HowItWorks from '@/components/storefront/HowItWorks';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let ratePerGB = 1.0;
  let dbGames: any[] = [];

  try {
    const rateSetting = await Promise.race([
      prisma.siteSetting.findUnique({ where: { key: 'ratePerGB' } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);
    if (rateSetting && 'value' in rateSetting) {
      ratePerGB = parseFloat((rateSetting as any).value) || 1.0;
    }

    dbGames = (await Promise.race([
      prisma.game.findMany({
        where: { status: 'ACTIVE' },
        orderBy: [{ isFeatured: 'desc' }, { releaseYear: 'desc' }],
      }),
      new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2500)),
    ])) || [];
  } catch (err) {
    console.warn('Database fetch error on HomePage, using fallback catalog:', err);
  }

  const games: GameItem[] =
    dbGames.length > 0
      ? dbGames.map((g) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          genre: Array.isArray(g.genre) ? (g.genre as string[]) : [],
          coverImage: g.coverImage,
          trailerUrl: g.trailerUrl,
          sizeGB: g.sizeGB,
          price: calculatePrice(g.sizeGB, ratePerGB),
          releaseYear: g.releaseYear,
          status: g.status,
          isFeatured: g.isFeatured,
          isOP: g.isOP,
        }))
      : (FALLBACK_GAMES as any);

  return (
    <>
      <Hero />
      <GameGrid initialGames={games} />
      <HowItWorks />
    </>
  );
}
