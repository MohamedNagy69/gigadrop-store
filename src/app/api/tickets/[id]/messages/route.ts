import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load ticket' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {
      senderId = 'system',
      message,
      isAdmin = false,
      status,
      replyToSender,
      replyToText,
    } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const formattedMessage =
      replyToText && replyToText.trim()
        ? `[[QUOTE:${replyToSender || 'Message'}|${replyToText.trim()}]]\n${message.trim()}`
        : message.trim();

    const msg = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        senderId,
        message: formattedMessage,
        isAdmin: Boolean(isAdmin),
      },
    });

    const ticket = await prisma.ticket.update({
      where: { id: params.id },
      data: {
        status: status || (isAdmin ? 'IN_PROGRESS' : 'OPEN'),
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (isAdmin) {
      await prisma.notification.create({
        data: {
          userId: ticket.userId,
          title: 'New Support Reply 💬',
          message: `Support replied to your ticket "${ticket.subject}".`,
          type: 'SYSTEM',
        },
      });
    }

    return NextResponse.json({ message: msg, ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get('messageId');

    if (messageId) {
      await prisma.ticketMessage.delete({
        where: { id: messageId },
      });

      const updatedTicket = await prisma.ticket.findUnique({
        where: { id: params.id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });

      return NextResponse.json({ success: true, ticket: updatedTicket });
    }

    // Delete entire ticket if no messageId specified
    await prisma.ticket.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, deletedTicket: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message or ticket' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, priority, assignedTo } = await req.json();
    const ticket = await prisma.ticket.update({
      where: { id: params.id },
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
