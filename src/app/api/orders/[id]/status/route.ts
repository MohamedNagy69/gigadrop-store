import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminGuard';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const { status, paymentStatus, note, changedBy = 'Admin', notes } = body;

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && {
          paymentStatus,
          ...(paymentStatus === 'PAID' && { paidAt: new Date() }),
        }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        items: { include: { game: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (status && status !== existing.status) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: existing.id,
          status,
          note: note || `Order status updated to ${status}`,
          changedBy,
        },
      });

      // Notify customer if linked
      if (existing.userId) {
        const statusMessages: Record<string, string> = {
          PROCESSING: `We have received your drive for order ${existing.orderNumber} and are loading your games.`,
          READY: `Your games for order ${existing.orderNumber} are loaded and verified! We'll contact you to arrange delivery.`,
          DELIVERED: `Order ${existing.orderNumber} has been delivered. Enjoy your games! 🎮`,
          CANCELLED: `Order ${existing.orderNumber} has been cancelled.`,
        };

        await prisma.notification.create({
          data: {
            userId: existing.userId,
            title: `Order ${existing.orderNumber}: ${status}`,
            message:
              statusMessages[status] ||
              `Your order ${existing.orderNumber} status is now ${status}.`,
            type: 'ORDER_UPDATE',
          },
        });
      }

      // Log automated WhatsApp status message
      await prisma.whatsAppLog.create({
        data: {
          orderId: existing.id,
          phone: existing.whatsapp || existing.phone,
          template: `status_${status.toLowerCase()}`,
          message: `GIGADROP Update: Order ${existing.orderNumber} is now ${status}. ${
            note || ''
          }`,
          status: 'SENT',
        },
      });
    }

    if (paymentStatus === 'PAID') {
      await prisma.payment.updateMany({
        where: { orderId: existing.id },
        data: { status: 'PAID' },
      });
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('PATCH /api/orders/[id]/status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
