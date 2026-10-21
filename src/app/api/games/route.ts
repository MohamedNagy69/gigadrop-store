export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import { requireAdminSession } from '@/lib/adminGuard';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const genre = searchParams.get('genre')?.trim() || '';
    const sort = searchParams.get('sort') || 'featured';
    const status = searchParams.get('status') || 'ACTIVE';
    const includeAllStatuses = searchParams.get('all') === 'true';

    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

    const whereClause: any = {};
    if (!includeAllStatuses) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const games = await prisma.game.findMany({
      where: whereClause,
      include: {
        reviews: {
          where: { isVisible: true },
          select: { rating: true },
        },
      },
    });

    let formatted = games.map((g) => {
      const genresArray: string[] = Array.isArray(g.genre)
        ? (g.genre as string[])
        : typeof g.genre === 'string'
        ? JSON.parse(g.genre)
        : [];

      const ratings = g.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
          : 4.8;

      return {
        id: g.id,
        name: g.name,
        description: g.description,
        genre: genresArray,
        coverImage: g.coverImage,
        trailerUrl: g.trailerUrl,
        sizeGB: g.sizeGB,
        price: calculatePrice(g.sizeGB, ratePerGB),
        releaseYear: g.releaseYear,
        status: g.status,
        isFeatured: g.isFeatured,
        isOP: g.isOP,
        avgRating,
        reviewsCount: ratings.length,
        createdAt: g.createdAt,
      };
    });

    // Genre filter
    if (genre && genre.toLowerCase() !== 'all') {
      formatted = formatted.filter((g) =>
        g.genre.some((item) => item.toLowerCase() === genre.toLowerCase())
      );
    }

    // Search in genre as well if search query provided
    if (search) {
      const q = search.toLowerCase();
      formatted = formatted.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          g.genre.some((gen) => gen.toLowerCase().includes(q))
      );
    }

    // Sorting
    formatted.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'releaseDate':
          return b.releaseYear - a.releaseYear;
        case 'sizeAsc':
          return a.sizeGB - b.sizeGB;
        case 'sizeDesc':
          return b.sizeGB - a.sizeGB;
        case 'featured':
        default:
          if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
          if (a.isOP !== b.isOP) return a.isOP ? -1 : 1;
          return b.releaseYear - a.releaseYear;
      }
    });

    return NextResponse.json({
      games: formatted,
      total: formatted.length,
      ratePerGB,
    });
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json({
      games: FALLBACK_GAMES,
      total: FALLBACK_GAMES.length,
      ratePerGB: 1.0,
    });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const {
      name,
      description,
      genre,
      coverImage,
      trailerUrl,
      sizeGB,
      releaseYear,
      status,
      isFeatured,
      isOP,
    } = body;

    if (!name || !coverImage || !sizeGB) {
      return NextResponse.json(
        { error: 'Name, cover image, and size in GB are required' },
        { status: 400 }
      );
    }

    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;
    const parsedSize = parseFloat(String(sizeGB));

    const game = await prisma.game.create({
      data: {
        name: name.trim(),
        description: description || '',
        genre: Array.isArray(genre) ? genre : [genre || 'Action'],
        coverImage,
        trailerUrl: trailerUrl || null,
        sizeGB: parsedSize,
        price: calculatePrice(parsedSize, ratePerGB),
        releaseYear: parseInt(String(releaseYear || new Date().getFullYear()), 10),
        status: status || 'ACTIVE',
        isFeatured: Boolean(isFeatured),
        isOP: Boolean(isOP),
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
