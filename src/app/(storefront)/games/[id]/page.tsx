import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import GameDetail from '@/components/storefront/GameDetail';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let game: any = null;
  let ratePerGB = 1.0;
  let allOtherGames: any[] = [];

  try {
    const rateSetting = await Promise.race([
      prisma.siteSetting.findUnique({ where: { key: 'ratePerGB' } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);
    if (rateSetting && 'value' in rateSetting) {
      ratePerGB = parseFloat((rateSetting as any).value) || 1.0;
    }

    game = await Promise.race([
      prisma.game.findUnique({
        where: { id: params.id },
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
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);

    if (game) {
      allOtherGames = (await Promise.race([
        prisma.game.findMany({
          where: { status: 'ACTIVE', id: { not: game.id } },
        }),
        new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2000)),
      ])) || [];
    }
  } catch (err) {
    console.warn('Database query failed in GameDetailPage, checking fallback catalog:', err);
  }

  // If not found in database, check fallback catalog
  if (!game) {
    const fallbackMatch = FALLBACK_GAMES.find(
      (g) => g.id === params.id || g.name.toLowerCase() === decodeURIComponent(params.id).toLowerCase()
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

  const genresArray: string[] = Array.isArray(game.genre)
    ? (game.genre as string[])
    : [];

  const similarGames: GameItem[] = allOtherGames
    .map((g) => {
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
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 4);

  const ratings = (game.reviews || []).map((r: any) => r.rating);
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
    reviews: game.reviews || [],
  };

  return (
    <GameDetail
      game={formattedGame}
      similarGames={similarGames}
      ratePerGB={ratePerGB}
    />
  );
}
