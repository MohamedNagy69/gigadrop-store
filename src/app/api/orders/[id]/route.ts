export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, referralCode: true },
        },
        items: {
          include: {
            game: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isAdmin =
      sessionUser?.role === 'ADMIN' ||
      sessionUser?.role === 'SUPER_ADMIN' ||
      sessionUser?.role === 'SUPPORT';

    // IDOR Authorization Check:
    // If not admin, the user must either be the owner of the order,
    // or provide the phone verification for guest orders.
    const isOwner = sessionUser?.id && order.userId === sessionUser.id;
    const { searchParams } = new URL(req.url);
    const phoneParam = searchParams.get('phone')?.trim();
    const isGuestVerified =
      !order.userId &&
      phoneParam &&
      (order.phone === phoneParam || order.phone.endsWith(phoneParam));

    if (!isAdmin && !isOwner && !isGuestVerified) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول إلى بيانات هذا الطلب (Unauthorized order access)' },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
