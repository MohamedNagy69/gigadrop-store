export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminGuard';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) {
      // Only allow unauthenticated seed if explicitly configured with ADMIN_SEED_SECRET or in local development
      const seedSecret = req.headers.get('x-seed-secret');
      const isAllowedSecret =
        process.env.ADMIN_SEED_SECRET && seedSecret === process.env.ADMIN_SEED_SECRET;
      const isDevBootstrap = process.env.NODE_ENV === 'development';

      if (!isAllowedSecret && !isDevBootstrap) {
        return auth.response;
      }
    }

    // Default Site Settings
    const defaultSettings = [
      { key: 'ratePerGB', value: '1.0' },
      { key: 'minOrderGB', value: '100' },
      { key: 'serviceFee', value: '50' },
      { key: 'currency', value: 'EGP' },
      { key: 'storeName', value: 'GIGADROP' },
    ];

    for (const setting of defaultSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        create: setting,
        update: {},
      }).catch((e) => console.warn(`Setting upsert ${setting.key}:`, e.message));
    }

    let syncedCount = 0;
    for (const game of FALLBACK_GAMES) {
      await prisma.game.upsert({
        where: { id: game.id },
        create: {
          id: game.id,
          name: game.name,
          description: game.description,
          genre: game.genre,
          coverImage: game.coverImage,
          trailerUrl: game.trailerUrl || null,
          sizeGB: game.sizeGB,
          price: game.price,
          releaseYear: game.releaseYear,
          status: (game.status as any) || 'ACTIVE',
          isFeatured: Boolean(game.isFeatured),
          isOP: Boolean(game.isOP),
        },
        update: {
          name: game.name,
          description: game.description,
          genre: game.genre,
          coverImage: game.coverImage,
          trailerUrl: game.trailerUrl || null,
          sizeGB: game.sizeGB,
          price: game.price,
          releaseYear: game.releaseYear,
          status: (game.status as any) || 'ACTIVE',
          isFeatured: Boolean(game.isFeatured),
          isOP: Boolean(game.isOP),
        },
      }).catch((e) => console.warn(`Game upsert ${game.name}:`, e.message));
      syncedCount++;
    }

    return NextResponse.json({
      success: true,
      count: syncedCount,
      totalCatalog: FALLBACK_GAMES.length,
      message: `Successfully synchronized ${syncedCount} games into database.`,
    });
  } catch (error: any) {
    console.error('POST /api/admin/seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed catalog' },
      { status: 500 }
    );
  }
}
