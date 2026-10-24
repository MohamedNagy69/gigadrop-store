export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Allow anonymous or customer helpful increments
    if (body.incrementHelpful) {
      const updated = await prisma.review.update({
        where: { id },
        data: { helpfulCount: { increment: 1 } },
      });
      return NextResponse.json({ review: updated });
    }

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';
    const isAuthor = review.userId === sessionUser.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};
    if (isAuthor && body.rating !== undefined) {
      updateData.rating = Math.min(5, Math.max(1, Math.round(Number(body.rating))));
    }
    if (isAuthor && body.comment !== undefined) {
      updateData.comment = String(body.comment).trim().slice(0, 1000);
    }
    if (isAdmin && body.isVisible !== undefined) {
      updateData.isVisible = Boolean(body.isVisible);
    }

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ review: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;
    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';
    const isAuthor = review.userId === sessionUser.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
