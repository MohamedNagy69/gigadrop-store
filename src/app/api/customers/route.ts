import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();

    const where: any = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { referralCode: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            totalGB: true,
            status: true,
          },
        },
        referrals: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const customers = users.map((u) => {
      const totalOrders = u.orders.length;
      const totalSpent = Number(
        u.orders
          .filter((o) => o.status !== 'CANCELLED')
          .reduce((acc, o) => acc + o.totalPrice, 0)
          .toFixed(2)
      );
      const totalGB = Number(
        u.orders
          .filter((o) => o.status !== 'CANCELLED')
          .reduce((acc, o) => acc + o.totalGB, 0)
          .toFixed(2)
      );

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        whatsapp: u.whatsapp,
        address: u.address,
        referralCode: u.referralCode,
        isActive: u.isActive,
        createdAt: u.createdAt,
        totalOrders,
        totalSpent,
        totalGB,
        referralsCount: u.referrals.length,
      };
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
