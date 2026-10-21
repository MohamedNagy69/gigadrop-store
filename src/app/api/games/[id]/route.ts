export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import { requireAdminSession } from '@/lib/adminGuard';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { safePrismaQuery } from '@/lib/safePrisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rateSetting = await safePrismaQuery(
      (db) => db.siteSetting.findUnique({ where: { key: 'ratePerGB' } }),
      null,
      1200
    );
    const ratePerGB = rateSetting ? parseFloat((rateSetting as any).value) || 1.0 : 1.0;

    let game: any = await safePrismaQuery(
      (db) =>
        db.game.findUnique({
          where: { id: params.id },
          include: {
            reviews: {
              where: { isVisible: true },
              include: {
                user: {
                  select: { id: true, name: true, avatar: true },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        }),
      null,
      1500
    );

    if (!game) {
      const fallback = FALLBACK_GAMES.find(
        (g) =>
          g.id === params.id ||
          g.name.toLowerCase() === decodeURIComponent(params.id).toLowerCase()
      );
      if (fallback) {
        const similarGames = FALLBACK_GAMES
          .filter((g) => g.id !== fallback.id)
          .map((g) => {
            const overlap = g.genre.filter((x) => fallback.genre.includes(x)).length;
            return {
              ...g,
              overlap,
            };
          })
          .sort(
            (a, b) =>
              b.overlap - a.overlap ||
              (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
          )
          .slice(0, 4);

        return NextResponse.json({
          game: {
            ...fallback,
            price: calculatePrice(fallback.sizeGB, ratePerGB),
          },
          similarGames,
          ratePerGB,
        });
      }
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const genresArray: string[] = Array.isArray(game.genre)
      ? (game.genre as string[])
      : typeof game.genre === 'string'
      ? JSON.parse(game.genre)
      : [];

    // Find Similar Games sharing primary genre
    const allActive = await safePrismaQuery(
      (db) =>
        db.game.findMany({
          where: {
            status: 'ACTIVE',
            id: { not: game.id },
          },
        }),
      [],
      1200
    );

    const similarSource =
      allActive && allActive.length > 0
        ? allActive
        : FALLBACK_GAMES.filter((g) => g.id !== game.id);

    const similarGames = similarSource
      .map((g: any) => {
        const gGenres: string[] = Array.isArray(g.genre)
          ? (g.genre as string[])
          : typeof g.genre === 'string'
          ? JSON.parse(g.genre)
          : [];
        const overlap = gGenres.filter((x: string) => genresArray.includes(x)).length;
        return {
          ...g,
          genre: gGenres,
          price: calculatePrice(g.sizeGB, ratePerGB),
          overlap,
        };
      })
      .sort(
        (a: any, b: any) =>
          b.overlap - a.overlap || (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      )
      .slice(0, 4);

    const ratings = (game.reviews || []).map((r: any) => r.rating);
    const avgRating =
      ratings.length > 0
        ? Number((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1))
        : 4.8;

    return NextResponse.json({
      game: {
        ...game,
        genre: genresArray,
        price: calculatePrice(game.sizeGB, ratePerGB),
        avgRating,
        reviewsCount: ratings.length,
      },
      similarGames,
      ratePerGB,
    });
  } catch (error) {
    console.error('GET /api/games/[id] error:', error);
    const fallback = FALLBACK_GAMES.find((g) => g.id === params.id);
    if (fallback) {
      return NextResponse.json({
        game: fallback,
        similarGames: FALLBACK_GAMES.slice(0, 4),
        ratePerGB: 1.0,
      });
    }
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

    const sizeGB = body.sizeGB !== undefined ? parseFloat(String(body.sizeGB)) : undefined;

    const updated = await prisma.game.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.genre !== undefined && { genre: body.genre }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.trailerUrl !== undefined && { trailerUrl: body.trailerUrl }),
        ...(sizeGB !== undefined && {
          sizeGB,
          price: calculatePrice(sizeGB, ratePerGB),
        }),
        ...(body.releaseYear !== undefined && {
          releaseYear: parseInt(String(body.releaseYear), 10),
        }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.isOP !== undefined && { isOP: Boolean(body.isOP) }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/games/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    await prisma.game.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/games/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}
