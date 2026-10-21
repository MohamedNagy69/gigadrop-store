export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal = 0 } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    const settingsRows = await prisma.siteSetting.findMany({
      where: {
        key: { in: ['referralProgramEnabled', 'referralDiscountPercent'] },
      },
    });
    const settingsMap: Record<string, string> = {};
    settingsRows.forEach((r) => {
      settingsMap[r.key] = r.value;
    });

    if (settingsMap.referralProgramEnabled === 'false') {
      return NextResponse.json(
        {
          error:
            'نظام أكواد ولينكات الإحالة متوقف حالياً من قِبل الإدارة (Referral program is currently disabled by Admin)',
        },
        { status: 403 }
      );
    }

    const discountPercent = parseFloat(settingsMap.referralDiscountPercent || '15') || 15;

    const referrer = await prisma.user.findUnique({
      where: { referralCode: code.trim().toUpperCase() },
      select: { id: true, name: true, referralCode: true },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: 'كود الإحالة غير صحيح (Invalid friend referral code)' },
        { status: 404 }
      );
    }

    const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));

    return NextResponse.json({
      valid: true,
      referrerName: referrer.name,
      referralCode: referrer.referralCode,
      discountPercent,
      discountAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate referral code' }, { status: 500 });
  }
}
