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

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, whatsapp: true, avatar: true },
        },
        order: {
          select: { id: true, orderNumber: true, totalGB: true, totalPrice: true, status: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const isCustomer = sessionUser.role === 'CUSTOMER';
    const enrichedTickets = tickets.map((t) => {
      const unreadCount = t.messages.filter((m) =>
        isCustomer ? m.isAdmin && !m.isRead : !m.isAdmin && !m.isRead
      ).length;
      return {
        ...t,
        unreadCount,
      };
    });

    return NextResponse.json({ tickets: enrichedTickets });
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
      orderId,
      subject,
      priority = 'HIGH',
      message,
      mediaUrl,
      mediaType,
      replyToSender,
      replyToText,
    } = body;

    const trimmedMsg = (message || '').trim();
    if (!trimmedMsg && !mediaUrl) {
      return NextResponse.json(
        { error: 'Message or media attachment is required' },
        { status: 400 }
      );
    }

    const finalMessage = trimmedMsg || (mediaType === 'image' ? '[صورة]' : '[ملف]');

    const isCustomer = sessionUser.role === 'CUSTOMER';
    const targetUserId = isCustomer ? sessionUser.id : userId || sessionUser.id;

    const formattedMessage =
      replyToText && replyToText.trim()
        ? `[[QUOTE:${replyToSender || 'Message'}|${replyToText.trim()}]]\n${finalMessage}`
        : finalMessage;

    // If customer already has an open chat thread, append to it instead of creating duplicates
    const existingTicket = await prisma.ticket.findFirst({
      where: { userId: targetUserId },
      orderBy: { updatedAt: 'desc' },
    });

    if (existingTicket) {
      await prisma.ticketMessage.create({
        data: {
          ticketId: existingTicket.id,
          senderId: sessionUser.id,
          message: formattedMessage,
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || (mediaUrl ? 'image' : null),
          isAdmin: !isCustomer,
        },
      });

      const updatedTicket = await prisma.ticket.update({
        where: { id: existingTicket.id },
        data: {
          updatedAt: new Date(),
          ...(orderId && { orderId }),
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, whatsapp: true, avatar: true },
          },
          order: {
            select: { id: true, orderNumber: true, totalGB: true, totalPrice: true, status: true },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return NextResponse.json({ ticket: updatedTicket }, { status: 201 });
    }

    // Create new chat thread on first message
    const ticket = await prisma.ticket.create({
      data: {
        userId: targetUserId,
        orderId: orderId || null,
        subject: subject?.trim() || `${sessionUser.name || 'عميل'}`,
        priority,
        status: 'OPEN',
        messages: {
          create: {
            senderId: sessionUser.id,
            message: formattedMessage,
            mediaUrl: mediaUrl || null,
            mediaType: mediaType || (mediaUrl ? 'image' : null),
            isAdmin: !isCustomer,
          },
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, whatsapp: true, avatar: true },
        },
        order: {
          select: { id: true, orderNumber: true, totalGB: true, totalPrice: true, status: true },
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
