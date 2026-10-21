export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
      },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentRef: order.paymentRef,
      paidAt: order.paidAt,
      payments: order.payments,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check payment status' }, { status: 500 });
  }
}
