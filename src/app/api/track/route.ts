export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderNumber, phone } = await req.json();

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Please enter your Order Number' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      include: {
        items: {
          include: {
            game: {
              select: {
                id: true,
                name: true,
                coverImage: true,
                sizeGB: true,
                releaseYear: true,
              },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order found with this Order Number' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('POST /api/track error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
