export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ wishlist: [] });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ wishlist });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, gameId } = await req.json();
    if (!userId || !gameId) {
      return NextResponse.json({ error: 'Missing userId or gameId' }, { status: 400 });
    }

    const item = await prisma.wishlist.upsert({
      where: {
        userId_gameId: { userId, gameId },
      },
      update: {},
      create: { userId, gameId },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}
