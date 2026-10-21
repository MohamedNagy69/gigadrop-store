export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateReferralCode } from '@/lib/utils';
import { requireAdminSession } from '@/lib/adminGuard';

export async function GET() {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN', 'SUPPORT'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const callerRole = (auth.session?.user as any)?.role;

    const { name, email, phone, role = 'ADMIN', password = 'Admin@123' } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Privilege Escalation Prevention: Only SUPER_ADMIN can create SUPER_ADMIN accounts
    if (role === 'SUPER_ADMIN' && callerRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only SUPER_ADMIN can create SUPER_ADMIN accounts' },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        password: hashedPassword,
        role,
        referralCode: generateReferralCode(name),
      },
    });

    return NextResponse.json(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAdminSession();
    if (!auth.authorized) return auth.response;

    const callerRole = (auth.session?.user as any)?.role;
    const { id, role, isActive } = await req.json();

    // Privilege Escalation Prevention: Only SUPER_ADMIN can promote to SUPER_ADMIN
    if (role === 'SUPER_ADMIN' && callerRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only SUPER_ADMIN can promote users to SUPER_ADMIN' },
        { status: 403 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });
    return NextResponse.json({ id: updated.id, role: updated.role, isActive: updated.isActive });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 });
  }
}
