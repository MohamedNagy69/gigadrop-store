import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CustomerLibraryClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function CustomerLibraryPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || 'ahmed@gigadrop.eg';

  let user: any = null;
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
        },
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
  } catch (err) {
    console.warn('CustomerLibrary DB query fallback:', err);
  }

  const purchasedMap = new Map<string, { game: any; purchasedAt: Date }>();
  (user?.orders || []).forEach((o: any) => {
    (o.items || []).forEach((item: any) => {
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
