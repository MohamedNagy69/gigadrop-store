export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizePhone } from '@/lib/security';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Users can only view their own account unless admin
    if (!isAdmin && sessionUser.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          include: {
            items: { include: { game: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        referrals: true,
        tickets: {
          orderBy: { createdAt: 'desc' },
        },
        wishlist: {
          include: { game: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const { password, ...safeCustomer } = customer;
    return NextResponse.json({ customer: safeCustomer });
  } catch (error) {
    console.error('GET /api/customers/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer detail' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Users can only update their own account unless admin
    if (!isAdmin && sessionUser.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = String(body.name).trim().slice(0, 100);
    if (body.phone !== undefined) updateData.phone = sanitizePhone(body.phone);
    if (body.whatsapp !== undefined) updateData.whatsapp = sanitizePhone(body.whatsapp);
    if (body.address !== undefined) updateData.address = String(body.address).trim().slice(0, 255);
    if (body.birthdate !== undefined) {
      updateData.birthdate = body.birthdate ? new Date(body.birthdate) : null;
    }

    // Only admins can toggle account active status
    if (isAdmin && body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    const { password, ...safeUser } = updated;
    return NextResponse.json({ customer: safeUser });
  } catch (error) {
    console.error('PATCH /api/customers/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
