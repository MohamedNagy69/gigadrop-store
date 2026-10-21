import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerLibraryClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function CustomerLibraryPage() {
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
    },
  });

  const purchasedMap = new Map<string, { game: any; purchasedAt: Date }>();
  user?.orders.forEach((o) => {
    o.items.forEach((item) => {
      if (item.game && !purchasedMap.has(item.gameId)) {
        purchasedMap.set(item.gameId, {
          game: item.game,
          purchasedAt: o.createdAt,
        });
      }
    });
  });

  const purchasedList = Array.from(purchasedMap.values());

  return <CustomerLibraryClient purchasedList={purchasedList} />;
}
