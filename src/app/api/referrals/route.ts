export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // IDOR Protection: Non-admins can only see their own referral stats
    const targetUserId = isAdmin ? requestedUserId || null : sessionUser.id;

    if (!targetUserId) {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const allReferrals = await prisma.referral.findMany({
        include: { referrer: { select: { name: true, email: true, referralCode: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ referrals: allReferrals });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
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
