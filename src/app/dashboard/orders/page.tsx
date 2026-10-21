import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerOrdersClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || 'ahmed@gigadrop.eg';

  let orders: any[] = [];
  try {
    const user = await Promise.race([
      prisma.user.findUnique({
        where: { email: userEmail },
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    orders = (await Promise.race([
      prisma.order.findMany({
        where: user ? { userId: user.id } : {},
        include: {
          items: { include: { game: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2000)),
    ])) || [];
  } catch (err) {
    console.warn('CustomerOrders DB query fallback:', err);
  }

  return <CustomerOrdersClient orders={orders} />;
}
