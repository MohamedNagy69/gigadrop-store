export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const includeHidden = searchParams.get('all') === 'true';

    const where: any = {};
    if (gameId) where.gameId = gameId;

    if (includeHidden) {
      const session = await getServerSession(authOptions);
      const role = (session?.user as any)?.role;
      const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPPORT';
      if (!isAdmin) {
        where.isVisible = true;
      }
    } else {
      where.isVisible = true;
    }

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
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول لكتابة تقييم (Please sign in to post a review)' },
        { status: 401 }
      );
    }

    const rateCheck = checkRateLimit(`review:${sessionUser.id}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'عدد التقييمات كبير جداً، يرجى الانتظار قليلاً' },
        { status: 429 }
      );
    }

    const { gameId, rating, comment } = await req.json();
    if (!gameId || rating === undefined) {
      return NextResponse.json({ error: 'Game ID and rating are required' }, { status: 400 });
    }

    const numericRating = Math.min(5, Math.max(1, Math.round(Number(rating))));

    const review = await prisma.review.create({
      data: {
        userId: sessionUser.id,
        gameId,
        rating: numericRating,
        comment: comment ? String(comment).trim().slice(0, 1000) : '',
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
