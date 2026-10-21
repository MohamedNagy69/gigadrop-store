export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import { requireAdminSession } from '@/lib/adminGuard';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
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
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

    const genresArray: string[] = Array.isArray(game.genre)
      ? (game.genre as string[])
      : typeof game.genre === 'string'
      ? JSON.parse(game.genre)
      : [];

    // Find Similar Games sharing primary genre
    const allActive = await prisma.game.findMany({
      where: {
        status: 'ACTIVE',
        id: { not: game.id },
      },
    });

    const similarGames = allActive
      .map((g) => {
        const gGenres: string[] = Array.isArray(g.genre)
          ? (g.genre as string[])
          : [];
        const overlap = gGenres.filter((x) => genresArray.includes(x)).length;
        return {
          ...g,
          genre: gGenres,
          price: calculatePrice(g.sizeGB, ratePerGB),
          overlap,
        };
      })
      .sort((a, b) => b.overlap - a.overlap || (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      .slice(0, 4);

    const ratings = game.reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
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
