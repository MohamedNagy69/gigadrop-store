import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const includeHidden = searchParams.get('all') === 'true';

    const where: any = {};
    if (gameId) where.gameId = gameId;
    if (!includeHidden) where.isVisible = true;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        game: { select: { id: true, name: true, coverImage: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, gameId, rating, comment } = await req.json();
    if (!gameId || !rating) {
      return NextResponse.json({ error: 'Game ID and rating are required' }, { status: 400 });
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const demoUser = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
      if (!demoUser) {
        return NextResponse.json({ error: 'Please sign in to post a review' }, { status: 401 });
      }
      targetUserId = demoUser.id;
    }

    const review = await prisma.review.create({
      data: {
        userId: targetUserId,
        gameId,
        rating: Number(rating),
        comment: comment || '',
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
