import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FALLBACK_GAMES } from '@/lib/fallbackCatalog';
import { DashboardOverviewClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || 'ahmed@gigadrop.eg';

  let user: any = null;
  let recommendedGames: any[] = [];

  try {
    user = await Promise.race([
      prisma.user.findUnique({
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
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);

    recommendedGames = (await Promise.race([
      prisma.game.findMany({
        where: { status: 'ACTIVE', isFeatured: true },
        take: 4,
      }),
      new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 2000)),
    ])) || [];
  } catch (err) {
    console.warn('Dashboard DB query fallback:', err);
  }

  if (recommendedGames.length === 0) {
    recommendedGames = FALLBACK_GAMES.slice(0, 4) as any;
  }

  const orders = user?.orders || [];
  const totalOrders = orders.length;
  const totalGames = orders.reduce((acc: number, o: any) => acc + (o.items?.length || 0), 0);
  const totalGB = Number(
    orders.reduce((acc: number, o: any) => acc + (o.totalGB || 0), 0).toFixed(2)
  );
  const referralEarnings = Number(
    (user?.referrals || [])
      .filter((r: any) => r.isUsed)
      .reduce((acc: number, r: any) => acc + (r.discount || 0), 0)
      .toFixed(2)
  );

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
