import React from 'react';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import Hero from '@/components/storefront/Hero';
import GameGrid from '@/components/storefront/GameGrid';
import HowItWorks from '@/components/storefront/HowItWorks';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let ratePerGB = 1.0;
  let dbGames: any[] = [];

  try {
    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

    dbGames = await prisma.game.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ isFeatured: 'desc' }, { releaseYear: 'desc' }],
    });
  } catch (err) {
    console.error('Database fetch error on HomePage:', err);
  }

  const games: GameItem[] = dbGames.map((g) => ({
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
  }));

  return (
    <>
      <Hero />
      <GameGrid initialGames={games} />
      <HowItWorks />
    </>
  );
}
