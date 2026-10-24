export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // IDOR Protection: Customers can only read their own tickets
    if (!isAdmin && ticket.userId !== sessionUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load ticket' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // IDOR Protection: Non-admins can only reply to their own tickets
    if (!isAdmin && ticket.userId !== sessionUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      message,
      status,
      replyToSender,
      replyToText,
    } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Anti-Spoofing: Derive sender identity and admin status strictly from session
    const senderId = sessionUser.id;
    const senderIsAdmin = isAdmin;

    const formattedMessage =
      replyToText && replyToText.trim()
        ? `[[QUOTE:${replyToSender || 'Message'}|${replyToText.trim()}]]\n${message.trim()}`
        : message.trim();

    const msg = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        senderId,
        message: formattedMessage,
        isAdmin: senderIsAdmin,
      },
    });

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: status || (senderIsAdmin ? 'IN_PROGRESS' : 'OPEN'),
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (senderIsAdmin) {
      await prisma.notification.create({
        data: {
          userId: updatedTicket.userId,
          title: 'رد جديد من الدعم الفني 💬',
          message: `قام فريق الدعم الفني بالرد على محادثتك.`,
          type: 'SYSTEM',
        },
      });
    }

    return NextResponse.json({ message: msg, ticket: updatedTicket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, priority, assignedTo } = await req.json();
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
      },
    });
    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');

    if (messageId) {
      await prisma.ticketMessage.delete({
        where: { id: messageId },
      });

      const updatedTicket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });

      return NextResponse.json({ success: true, ticket: updatedTicket });
    }

    // Delete entire chat thread if no messageId specified
    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedTicket: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message or ticket' }, { status: 500 });
  }
}
