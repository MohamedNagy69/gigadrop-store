export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminGuard';

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const { orderId, verified = true, transactionId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: verified ? 'PAID' : 'FAILED',
        paidAt: verified ? new Date() : null,
        ...(transactionId && { paymentRef: transactionId }),
      },
    });

    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: verified ? 'PAID' : 'FAILED' },
    });

    return NextResponse.json({ order: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify InstaPay payment' }, { status: 500 });
  }
}
