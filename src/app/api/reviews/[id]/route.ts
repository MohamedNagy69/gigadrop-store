export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.comment !== undefined && { comment: body.comment }),
        ...(body.isVisible !== undefined && { isVisible: Boolean(body.isVisible) }),
        ...(body.incrementHelpful && { helpfulCount: { increment: 1 } }),
      },
    });
    return NextResponse.json({ review: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
