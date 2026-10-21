export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ received: true, payload: body });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
