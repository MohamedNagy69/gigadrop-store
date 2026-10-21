import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      const allReferrals = await prisma.referral.findMany({
        include: { referrer: { select: { name: true, email: true, referralCode: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ referrals: allReferrals });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalReferrals = user.referrals.length;
    const successfulReferrals = user.referrals.filter((r) => r.isUsed).length;
    const totalEarned = Number(
      user.referrals
        .filter((r) => r.isUsed)
        .reduce((acc, r) => acc + r.discount, 0)
        .toFixed(2)
    );

    return NextResponse.json({
      referralCode: user.referralCode,
      totalReferrals,
      successfulReferrals,
      totalEarned,
      history: user.referrals,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}
