export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getWhatsAppUrl } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { orderId, phone, template = 'custom', message } = await req.json();
    if (!phone || !message) {
      return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
    }

    const log = await prisma.whatsAppLog.create({
      data: {
        orderId: orderId || null,
        phone,
        template,
        message,
        status: 'SENT',
      },
    });

    const waUrl = getWhatsAppUrl(phone, message);

    return NextResponse.json({
      success: true,
      log,
      waUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send WhatsApp message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logs = await prisma.whatsAppLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch WhatsApp logs' }, { status: 500 });
  }
}
