import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import GameDetail from '@/components/storefront/GameDetail';
import { GameItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await prisma.game.findUnique({
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
  });

  if (!game) {
    notFound();
  }

  const rateSetting = await prisma.siteSetting.findUnique({
    where: { key: 'ratePerGB' },
  });
  const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

  const genresArray: string[] = Array.isArray(game.genre)
    ? (game.genre as string[])
    : [];

  const allOtherGames = await prisma.game.findMany({
    where: { status: 'ACTIVE', id: { not: game.id } },
  });

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

  const ratings = game.reviews.map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
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
    reviews: game.reviews,
  };

  return (
    <GameDetail
      game={formattedGame}
      similarGames={similarGames}
      ratePerGB={ratePerGB}
    />
  );
}
