export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`track:${clientIp}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'عدد طلبات التتبع كبير جداً، يرجى الانتظار قليلاً' },
        { status: 429 }
      );
    }

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

    // Mask PII data for public order tracker to prevent information harvesting
    const maskedPhone = order.phone
      ? order.phone.replace(/(\d{3})\d+(\d{3})$/, '$1****$2')
      : '';
    const maskedEmail = order.email
      ? order.email.replace(/^(.)(.*)(@.*)$/, (_, first, rest, domain) => `${first}***${domain}`)
      : '';

    const safeOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: maskedPhone,
      email: maskedEmail,
      totalGB: order.totalGB,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.items,
      statusHistory: order.statusHistory,
    };

    return NextResponse.json({ order: safeOrder });
  } catch (error) {
    console.error('POST /api/track error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
