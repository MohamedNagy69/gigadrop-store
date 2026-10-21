export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePrice } from '@/lib/utils';
import { requireAdminSession } from '@/lib/adminGuard';

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    rows.forEach((r) => {
      settings[r.key] = r.value;
    });
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({
      settings: {
        siteName: 'GIGADROP',
        ratePerGB: '1.00',
        referralProgramEnabled: 'true',
        referralDiscountPercent: '15',
      },
    });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const body = await req.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    // If ratePerGB changed, auto-update all game prices
    if (body.ratePerGB !== undefined) {
      const newRate = parseFloat(String(body.ratePerGB)) || 1.0;
      const allGames = await prisma.game.findMany({ select: { id: true, sizeGB: true } });
      await Promise.all(
        allGames.map((g) =>
          prisma.game.update({
            where: { id: g.id },
            data: { price: calculatePrice(g.sizeGB, newRate) },
          })
        )
      );
    }

    const rows = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    rows.forEach((r) => {
      settings[r.key] = r.value;
    });

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
