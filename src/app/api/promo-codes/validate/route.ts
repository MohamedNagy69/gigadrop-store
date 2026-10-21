import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal = 0 } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 404 });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json(
        { error: 'This promo code has reached its usage limit' },
        { status: 400 }
      );
    }

    const discountAmount =
      promo.discountType === 'PERCENTAGE'
        ? Number(((subtotal * promo.value) / 100).toFixed(2))
        : promo.value;

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      value: promo.value,
      discountAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
  }
}
