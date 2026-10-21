import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateFawryRef } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const fawryRef = order.paymentRef || `FWR-${generateFawryRef()}`;
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: 'FAWRY',
        paymentStatus: 'AWAITING_PAYMENT',
        paymentRef: fawryRef,
      },
    });

    return NextResponse.json({
      fawryRef,
      amount: order.totalPrice,
      currency: 'EGP',
      expiresAt,
      qrData: `FAWRY:${fawryRef}:${order.totalPrice}`,
      instructions: 'Go to any Fawry outlet or Fawry App and pay using this reference code within 48 hours.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate Fawry code' }, { status: 500 });
  }
}
