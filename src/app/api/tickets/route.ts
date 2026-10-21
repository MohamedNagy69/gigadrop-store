import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول للوصول إلى شات الدعم الفني (Unauthorized)' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: any = {};
    if (sessionUser.role === 'CUSTOMER') {
      where.userId = sessionUser.id;
    } else if (userId) {
      where.userId = userId;
    }
    if (status && status !== 'ALL') where.status = status;

    let tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Auto-initialize direct chat rooms if none exist
    if (tickets.length === 0) {
      if (sessionUser.role === 'CUSTOMER') {
        const created = await prisma.ticket.create({
          data: {
            userId: sessionUser.id,
            subject: `محادثة العميل — ${sessionUser.name || 'عميل'}`,
            priority: 'HIGH',
            status: 'OPEN',
            messages: {
              create: {
                senderId: 'admin',
                message:
                  'أهلاً بك في شات الدعم الفني المباشر لـ GIGADROP! 👋 اكتب رسالتك أو استفسارك هنا وسيقوم الأدمن بالرد عليك مباشرة.',
                isAdmin: true,
              },
            },
          },
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        });
        tickets = [created];
      } else {
        // For Admin: ensure at least the registered customers have an active chat room ready
        const customers = await prisma.user.findMany({
          where: { role: 'CUSTOMER' },
          take: 5,
        });
        for (const cust of customers) {
          await prisma.ticket.create({
            data: {
              userId: cust.id,
              subject: `محادثة الدعم مع ${cust.name}`,
              priority: 'MEDIUM',
              status: 'OPEN',
              messages: {
                create: {
                  senderId: 'admin',
                  message: `مرحباً ${cust.name}! أهلاً بك في شات الدعم الفني المباشر لـ GIGADROP.`,
                  isAdmin: true,
                },
              },
            },
          });
        }
        tickets = await prisma.ticket.findMany({
          where,
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { updatedAt: 'desc' },
        });
      }
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول أولاً (Please sign in first)' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      userId,
      subject = `شات الدعم الفني — ${sessionUser.name || 'عميل'}`,
      priority = 'HIGH',
      message,
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const targetUserId =
      sessionUser.role === 'CUSTOMER' ? sessionUser.id : userId || sessionUser.id;

    const ticket = await prisma.ticket.create({
      data: {
        userId: targetUserId,
        subject: subject.trim(),
        priority,
        status: 'OPEN',
        messages: {
          create: {
            senderId: targetUserId,
            message: message.trim(),
            isAdmin: sessionUser.role !== 'CUSTOMER',
          },
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
