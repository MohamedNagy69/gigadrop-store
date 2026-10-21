export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.orderId }, { orderNumber: params.orderId }],
      },
      include: {
        items: {
          include: { game: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const invoiceNumber = order.orderNumber.replace('GD-', 'INV-');
    const subtotal = Number((order.totalPrice + order.discount).toFixed(2));
    const trackUrl = `http://localhost:3000/track?order=${encodeURIComponent(order.orderNumber)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
      trackUrl
    )}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoiceNumber} — GIGADROP</title>
  <style>
    * { box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; }
    body { background: #0a0a0a; color: #ffffff; margin: 0; padding: 40px 20px; }
    .invoice-card { max-width: 820px; margin: 0 auto; background: #111111; border: 1px solid #222222; border-radius: 16px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #222222; padding-bottom: 24px; margin-bottom: 28px; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; }
    .logo span { color: #CCFF00; }
    .badge { display: inline-block; background: #CCFF00; color: #000000; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .label { color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; font-weight: 600; }
    .val { font-size: 14px; color: #ffffff; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #CCFF00; border-bottom: 1px solid #222222; padding: 12px 8px; }
    td { padding: 14px 8px; border-bottom: 1px solid #1a1a1a; font-size: 14px; }
    .totals { width: 300px; margin-left: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #cccccc; }
    .totals-final { display: flex; justify-content: space-between; padding: 14px 0; border-top: 1px solid #333333; font-size: 20px; font-weight: 800; color: #CCFF00; }
    .footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #222222; padding-top: 24px; margin-top: 24px; font-size: 12px; color: #777777; }
    .print-btn { background: #CCFF00; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
    @media print {
      body { background: #ffffff; color: #000000; padding: 0; }
      .invoice-card { background: #ffffff; color: #000000; border: 1px solid #cccccc; }
      .val, td { color: #000000; }
      .totals-final { color: #000000; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div style="max-width: 820px; margin: 0 auto;" class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save Invoice as PDF</button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">GIGA<span>DROP</span></div>
        <div style="color: #888; font-size: 13px; margin-top: 4px;">Games by the Gigabyte · Cairo, Egypt</div>
      </div>
      <div style="text-align: right;">
        <div class="badge">${order.status}</div>
        <div style="font-size: 20px; font-weight: 800; margin-top: 8px;">${invoiceNumber}</div>
        <div style="font-size: 12px; color: #888;">Order: ${order.orderNumber}</div>
        <div style="font-size: 12px; color: #888;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="label">Billed & Delivered To</div>
        <div class="val">
          <strong>${order.customerName}</strong><br/>
          Phone: ${order.phone}<br/>
          Email: ${order.email}<br/>
          Address: ${order.address}
        </div>
      </div>
      <div>
        <div class="label">Payment & Data Summary</div>
        <div class="val">
          Payment Method: <strong>${order.paymentMethod}</strong><br/>
          Payment Status: <strong>${order.paymentStatus}</strong><br/>
          Reference: ${order.paymentRef || 'N/A'}<br/>
          Total Data Size: <strong>${order.totalGB.toFixed(2)} GB</strong>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>PC Game Title</th>
          <th>Storage Size</th>
          <th style="text-align: right;">Price (EGP)</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item, idx) => `
          <tr>
            <td>${String(idx + 1).padStart(2, '0')}</td>
            <td><strong>${item.game?.name || 'PC Game'}</strong></td>
            <td>${item.sizeGB.toFixed(2)} GB</td>
            <td style="text-align: right;">${item.price.toFixed(2)} EGP</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Total Data (${order.items.length} Games)</span>
        <span>${order.totalGB.toFixed(2)} GB</span>
      </div>
      <div class="totals-row">
        <span>Subtotal (1.00 EGP / GB)</span>
        <span>${subtotal.toFixed(2)} EGP</span>
      </div>
      <div class="totals-row">
        <span>Discount ${order.promoCode ? `(${order.promoCode})` : ''}</span>
        <span>-${order.discount.toFixed(2)} EGP</span>
      </div>
      <div class="totals-final">
        <span>Total Due</span>
        <span>${order.totalPrice.toFixed(2)} EGP</span>
      </div>
    </div>

    <div class="footer">
      <div>
        <strong>GIGADROP CAIRO</strong><br/>
        All game data is SHA-256 verified before drive return.<br/>
        Support: drop@gigadrop.eg · +20 100 999 8877
      </div>
      <div style="text-align: center;">
        <img src="${qrApiUrl}" alt="Order Tracking QR" width="84" height="84" style="border-radius: 8px; background: #fff; padding: 4px;" />
        <div style="font-size: 10px; margin-top: 4px;">Scan to Track Order</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
