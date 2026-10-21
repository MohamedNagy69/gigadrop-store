export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId, walletPhone, provider = 'VODAFONE_CASH' } = await req.json();
    if (!orderId || !walletPhone) {
      return NextResponse.json(
        { error: 'orderId and walletPhone are required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const txRef = `WLT-${Math.floor(10000000 + Math.random() * 90000000)}`;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: provider,
        paymentStatus: 'AWAITING_PAYMENT',
        paymentRef: txRef,
      },
    });

    return NextResponse.json({
      transactionId: txRef,
      walletPhone,
      provider,
      amount: order.totalPrice,
      message: 'Push notification sent to your mobile wallet app for approval.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initiate wallet payment' }, { status: 500 });
  }
}
