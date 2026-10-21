import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CustomerOrderDetailClient } from '@/components/dashboard/DashboardClientViews';

export const dynamic = 'force-dynamic';

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
    },
    include: {
      items: { include: { game: true } },
      statusHistory: { orderBy: { createdAt: 'asc' } },
      payments: true,
    },
  });

  if (!order) notFound();

  return <CustomerOrderDetailClient order={order} />;
}
