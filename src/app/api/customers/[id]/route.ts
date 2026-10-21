import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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
    const body = await req.json();
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.whatsapp !== undefined && { whatsapp: body.whatsapp }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.birthdate !== undefined && {
          birthdate: body.birthdate ? new Date(body.birthdate) : null,
        }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    const { password, ...safeUser } = updated;
    return NextResponse.json({ customer: safeUser });
  } catch (error) {
    console.error('PATCH /api/customers/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
