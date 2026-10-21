import React from 'react';
import { calculatePrice } from '@/lib/utils';
import GameGrid from '@/components/storefront/GameGrid';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { safePrismaQuery } from '@/lib/safePrisma';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function GenresPage({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  const activeGenre = searchParams?.genre || 'All';

  const rateSetting = await safePrismaQuery(
    (db) => db.siteSetting.findUnique({ where: { key: 'ratePerGB' } }),
    null,
    1200
  );
  const ratePerGB = rateSetting ? parseFloat((rateSetting as any).value) || 1.0 : 1.0;

  const dbGames = await safePrismaQuery(
    (db) =>
      db.game.findMany({
        where: { status: 'ACTIVE' },
        orderBy: [{ isFeatured: 'desc' }, { releaseYear: 'desc' }],
      }),
    [],
    1500
  );

  const games: GameItem[] =
    dbGames.length > 0
      ? dbGames.map((g: any) => ({
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
    <div className="pt-20">
      <GameGrid initialGames={games} initialGenre={activeGenre} ratePerGB={ratePerGB} showCategoryBanner />
    </div>
  );
}
