import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerOrdersClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || 'ahmed@gigadrop.eg';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  const orders = await prisma.order.findMany({
    where: user ? { userId: user.id } : {},
    include: {
      items: { include: { game: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <CustomerOrdersClient orders={orders} />;
}
