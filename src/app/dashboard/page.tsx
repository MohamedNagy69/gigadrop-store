import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardOverviewClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || 'ahmed@gigadrop.eg';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      orders: {
        include: {
          items: { include: { game: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      referrals: true,
    },
  });

  const orders = user?.orders || [];
  const totalOrders = orders.length;
  const totalGames = orders.reduce((acc, o) => acc + o.items.length, 0);
  const totalGB = Number(
    orders.reduce((acc, o) => acc + o.totalGB, 0).toFixed(2)
  );
  const referralEarnings = Number(
    (user?.referrals || [])
      .filter((r) => r.isUsed)
      .reduce((acc, r) => acc + r.discount, 0)
      .toFixed(2)
  );

  const recommendedGames = await prisma.game.findMany({
    where: { status: 'ACTIVE', isFeatured: true },
    take: 4,
  });

  return (
    <DashboardOverviewClient
      user={user}
      orders={orders}
      totalOrders={totalOrders}
      totalGames={totalGames}
      totalGB={totalGB}
      referralEarnings={referralEarnings}
      recommendedGames={recommendedGames}
    />
  );
}
