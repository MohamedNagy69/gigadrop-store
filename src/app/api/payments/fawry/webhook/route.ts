export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const webhookSecret =
      process.env.PAYMENT_WEBHOOK_SECRET || 'gigadrop-webhook-secret-cairo-2026';
    const authHeader =
      req.headers.get('x-webhook-secret') || req.headers.get('x-fawry-secret');

    if (authHeader !== webhookSecret) {
      return NextResponse.json(
        { error: 'Invalid or missing webhook signature' },
        { status: 401 }
      );
    }

    const { paymentRef, orderNumber, status = 'PAID' } = await req.json();

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(paymentRef ? [{ paymentRef }] : []),
          ...(orderNumber ? [{ orderNumber }] : []),
        ],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found for webhook' }, { status: 404 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: status === 'PAID' ? 'PAID' : 'FAILED',
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    await prisma.payment.updateMany({
      where: { orderId: order.id },
      data: { status: status === 'PAID' ? 'PAID' : 'FAILED' },
    });

    return NextResponse.json({ received: true, orderNumber: order.orderNumber });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
