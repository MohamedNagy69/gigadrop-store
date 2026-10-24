import React from 'react';
import { notFound } from 'next/navigation';
import { calculatePrice } from '@/lib/utils';
import GameDetail from '@/components/storefront/GameDetail';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { safePrismaQuery } from '@/lib/safePrisma';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rateSetting = await safePrismaQuery(
    (db) => db.siteSetting.findUnique({ where: { key: 'ratePerGB' } }),
    null,
    1200
  );
  const ratePerGB = rateSetting ? parseFloat((rateSetting as any).value) || 1.0 : 1.0;

  const game = await safePrismaQuery(
    (db) =>
      db.game.findUnique({
        where: { id },
        include: {
          reviews: {
            where: { isVisible: true },
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
    null,
    1500
  );

  // If not found in database or database connection unavailable, check fallback catalog
  if (!game) {
    const fallbackMatch = FALLBACK_GAMES.find(
      (g) =>
        g.id === id ||
        g.name.toLowerCase() === decodeURIComponent(id).toLowerCase()
    );

    if (!fallbackMatch) {
      notFound();
    }

    const similarGames: GameItem[] = (FALLBACK_GAMES.filter((g) => g.id !== fallbackMatch.id)
      .slice(0, 4) as any[])
      .map((g) => ({
        ...g,
        genre: Array.isArray(g.genre) ? (g.genre as string[]) : [],
        price: calculatePrice(g.sizeGB, ratePerGB),
      }));

    const formattedGame = {
      id: fallbackMatch.id,
      name: fallbackMatch.name,
      description: fallbackMatch.description,
      genre: fallbackMatch.genre,
      coverImage: fallbackMatch.coverImage,
      trailerUrl: fallbackMatch.trailerUrl,
      sizeGB: fallbackMatch.sizeGB,
      price: calculatePrice(fallbackMatch.sizeGB, ratePerGB),
      releaseYear: fallbackMatch.releaseYear,
      status: fallbackMatch.status as any,
      isFeatured: fallbackMatch.isFeatured,
      isOP: fallbackMatch.isOP,
      avgRating: fallbackMatch.avgRating || 4.9,
      reviewsCount: fallbackMatch.reviewsCount || 12,
      reviews: [],
    };

    return (
      <GameDetail
        game={formattedGame}
        similarGames={similarGames}
        ratePerGB={ratePerGB}
      />
    );
  }

  const allOtherGames = await safePrismaQuery(
    (db) =>
      db.game.findMany({
        where: { status: 'ACTIVE', id: { not: game.id } },
      }),
    [],
    1200
  );

  const genresArray: string[] = Array.isArray(game.genre)
    ? (game.genre as string[])
    : [];

  const similarGames: GameItem[] = allOtherGames
    .map((g: any) => {
      const gGenres: string[] = Array.isArray(g.genre) ? (g.genre as string[]) : [];
      const overlap = gGenres.filter((x) => genresArray.includes(x)).length;
      return {
        id: g.id,
        name: g.name,
        description: g.description,
        genre: gGenres,
        coverImage: g.coverImage,
        trailerUrl: g.trailerUrl,
        sizeGB: g.sizeGB,
        price: calculatePrice(g.sizeGB, ratePerGB),
        releaseYear: g.releaseYear,
        status: g.status,
        isFeatured: g.isFeatured,
        isOP: g.isOP,
        overlap,
      };
    })
    .sort((a: any, b: any) => b.overlap - a.overlap)
    .slice(0, 4);

  const ratings = ((game as any).reviews || []).map((r: any) => r.rating);
  const avgRating =
    ratings.length > 0
      ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
      : 4.9;

  const formattedGame = {
    id: game.id,
    name: game.name,
    description: game.description,
    genre: genresArray,
    coverImage: game.coverImage,
    trailerUrl: game.trailerUrl,
    sizeGB: game.sizeGB,
    price: calculatePrice(game.sizeGB, ratePerGB),
    releaseYear: game.releaseYear,
    status: game.status,
    isFeatured: game.isFeatured,
    isOP: game.isOP,
    avgRating,
    reviewsCount: ratings.length,
    reviews: (game as any).reviews || [],
  };

  return (
    <GameDetail
      game={formattedGame}
      similarGames={similarGames}
      ratePerGB={ratePerGB}
    />
  );
}
