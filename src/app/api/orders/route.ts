export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  calculatePrice,
  generateFawryRef,
  generateOrderNumber,
} from '@/lib/utils';
import { checkRateLimit, getClientIp, isValidEmail, sanitizePhone } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as any;

    if (!sessionUser?.id) {
      return NextResponse.json(
        { error: 'يرجى تسجيل الدخول لعرض الطلبات (Unauthorized)' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.trim();

    const isAdmin =
      sessionUser.role === 'ADMIN' ||
      sessionUser.role === 'SUPER_ADMIN' ||
      sessionUser.role === 'SUPPORT';

    const where: any = {};

    // IDOR Protection: Customers can ONLY view their own orders
    if (!isAdmin) {
      where.userId = sessionUser.id;
    } else if (userId) {
      where.userId = userId;
    }

    if (status && status !== 'ALL') where.status = status;
    if (search && isAdmin) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    } else if (search && !isAdmin) {
      where.orderNumber = { contains: search };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            game: {
              select: { id: true, name: true, coverImage: true, sizeGB: true, genre: true },
            },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`order_create:${clientIp}`, 10, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'عدد الطلبات كبير جداً، يرجى الانتظار قليلاً (Rate limit exceeded)' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as any)?.id;

    const body = await req.json();
    const {
      userId,
      customerName,
      phone,
      email,
      whatsapp,
      address,
      birthdate,
      promoCode,
      referralCode,
      paymentMethod = 'COD',
      walletPhone,
      instapayRef,
      notes,
      hardDriveOption = 'OWN_DRIVE', // 'OWN_DRIVE' | 'BUY_NEW'
      hardDriveCapacity,
      items, // array of { gameId, sizeGB }
    } = body;

    if (!customerName || !phone || !email || !address || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required delivery details or empty game cart' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صالحة (Invalid email)' },
        { status: 400 }
      );
    }

    // Force authenticated user's ID if logged in to prevent account spoofing
    const verifiedUserId = sessionUserId || userId || null;

    const rateSetting = await prisma.siteSetting.findUnique({
      where: { key: 'ratePerGB' },
    });
    const ratePerGB = rateSetting ? parseFloat(rateSetting.value) || 1.0 : 1.0;

    // Fetch games from DB to ensure accurate size and price
    const gameIds = items.map((i: any) => i.gameId || i.id);
    const dbGames = await prisma.game.findMany({
      where: { id: { in: gameIds } },
    });

    if (dbGames.length === 0) {
      return NextResponse.json({ error: 'Selected games not found' }, { status: 400 });
    }

    const totalGB = Number(dbGames.reduce((acc, g) => acc + g.sizeGB, 0).toFixed(2));
    const subtotal = calculatePrice(totalGB, ratePerGB);

    let discount = 0;

    // Check Promo Code
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.trim().toUpperCase() },
      });
      if (promo && promo.isActive && (!promo.maxUses || promo.usedCount < promo.maxUses)) {
        if (promo.discountType === 'PERCENTAGE') {
          discount += Number(((subtotal * promo.value) / 100).toFixed(2));
        } else {
          discount += promo.value;
        }
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    // Check Referral Code (Only if Admin enabled referralProgramEnabled)
    if (referralCode) {
      const refSettings = await prisma.siteSetting.findMany({
        where: { key: { in: ['referralProgramEnabled', 'referralDiscountPercent'] } },
      });
      const refMap: Record<string, string> = {};
      refSettings.forEach((r) => {
        refMap[r.key] = r.value;
      });

      const isReferralEnabled = refMap.referralProgramEnabled !== 'false';
      const refPercent = parseFloat(refMap.referralDiscountPercent || '15') || 15;

      if (isReferralEnabled) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: referralCode.trim().toUpperCase() },
        });
        if (referrer) {
          const refDiscount = Number(((subtotal * refPercent) / 100).toFixed(2));
          discount += refDiscount;
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredEmail: email.toLowerCase().trim(),
              discount: refDiscount,
              isUsed: true,
            },
          });
          await prisma.notification.create({
            data: {
              userId: referrer.id,
              title: 'Referral Code Used! 🎁',
              message: `${customerName} placed an order using your referral link/code ${referrer.referralCode} (-${refPercent}%)!`,
              type: 'REFERRAL',
            },
          });
        }
      }
    }

    // Bulk Pricing Rule (Orders >= 250 GB get extra 10% off if no promo applied)
    if (discount === 0 && totalGB >= 250) {
      discount = Number((subtotal * 0.1).toFixed(2));
    }

    const totalPrice = Math.max(0, Number((subtotal - discount).toFixed(2)));

    // Generate sequential Order Number
    const count = await prisma.order.count();
    const orderNumber = generateOrderNumber(count + 1);

    // Determine Payment Ref & Status
    let paymentStatus: 'PENDING' | 'AWAITING_PAYMENT' | 'PAID' = 'PENDING';
    let paymentRef: string | null = null;

    if (paymentMethod === 'FAWRY') {
      paymentStatus = 'AWAITING_PAYMENT';
      paymentRef = `FWR-${generateFawryRef()}`;
    } else if (
      ['VODAFONE_CASH', 'ORANGE_MONEY', 'ETISALAT_CASH', 'WE_PAY'].includes(paymentMethod)
    ) {
      paymentStatus = 'PAID';
      paymentRef = `WLT-${Math.floor(10000000 + Math.random() * 90000000)}`;
    } else if (paymentMethod === 'INSTAPAY') {
      paymentStatus = 'AWAITING_PAYMENT';
      paymentRef = instapayRef || `INSTA-${Math.floor(100000 + Math.random() * 900000)}`;
    } else {
      paymentStatus = 'PENDING';
      paymentRef = `COD-${orderNumber}`;
    }

    // Link to existing user by verifiedUserId or email if present
    let linkedUserId = verifiedUserId || null;
    if (!linkedUserId) {
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingUser) linkedUserId = existingUser.id;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: linkedUserId,
        totalGB,
        totalPrice,
        discount,
        status: 'PENDING',
        paymentMethod,
        paymentStatus,
        paymentRef,
        paidAt: paymentStatus === 'PAID' ? new Date() : null,
        customerName: customerName.trim().slice(0, 100),
        phone: sanitizePhone(phone),
        email: cleanEmail,
        whatsapp: whatsapp ? sanitizePhone(whatsapp) : sanitizePhone(phone),
        address: address.trim().slice(0, 255),
        birthdate: birthdate ? new Date(birthdate) : null,
        promoCode: promoCode ? promoCode.trim().toUpperCase() : null,
        referralCodeUsed: referralCode ? referralCode.trim().toUpperCase() : null,
        notes: (() => {
          const isBuyingHardDrive = hardDriveOption === 'BUY_NEW';
          const hdNote = isBuyingHardDrive
            ? `[طلب شراء هارد جديد: نعم | السعة المفضلة: ${hardDriveCapacity || 'يتم التنسيق في الشات'} | يجب الاتفاق ودفع ثمن الهارد أولاً في شات الداش بورد]`
            : `[خيار الهارد: التحميل على هارد العميل الشخصي]`;
          return [hdNote, notes].filter(Boolean).join('\n').slice(0, 500);
        })(),
        items: {
          create: dbGames.map((g) => ({
            gameId: g.id,
            sizeGB: g.sizeGB,
            price: calculatePrice(g.sizeGB, ratePerGB),
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            note: hardDriveOption === 'BUY_NEW'
              ? `Order submitted with Hard Drive purchase request via ${paymentMethod}`
              : `Order submitted via ${paymentMethod}`,
            changedBy: customerName.trim(),
          },
        },
        payments: {
          create: {
            method: paymentMethod,
            amount: totalPrice,
            transactionId: paymentRef,
            status: paymentStatus,
            metadata: {
              walletPhone: walletPhone || null,
              instapayRef: instapayRef || null,
              hardDriveOption,
              hardDriveCapacity: hardDriveCapacity || null,
            },
          },
        },
      },
      include: {
        items: { include: { game: true } },
      },
    });

    const isBuyingHardDrive = hardDriveOption === 'BUY_NEW';
    let createdTicketId: string | null = null;

    // If customer selected to buy a hard drive, open a live support chat in customer dashboard
    if (isBuyingHardDrive && linkedUserId) {
      try {
        const ticket = await prisma.ticket.create({
          data: {
            userId: linkedUserId,
            subject: `🛒 شراء هارد ديسك جديد - أوردر #${orderNumber}`,
            priority: 'URGENT',
            status: 'OPEN',
            messages: {
              create: [
                {
                  senderId: linkedUserId,
                  isAdmin: false,
                  message: `مرحباً فريق الدعم! 👋 لقد قمت باختيار (شراء هارد ديسك جديد) مع طلبي رقم #${orderNumber} (${dbGames.length} ألعاب · ${totalGB} جيجابايت).\nالسعة المقترحة: ${hardDriveCapacity || 'سأحدد معكم في الشات'}.\nأرجو تزويدي بالأنواع المتاحة وأسعارها وطريقة دفع ثمن الهارد أولاً.`,
                },
                {
                  senderId: 'SYSTEM',
                  isAdmin: true,
                  message: `أهلاً بك يا ${customerName}! 🎉 تم استلام طلبك رقم #${orderNumber} بنجاح.\n\nيسعدنا مساعدتك في اختيار أفضل هارد ديسك أصلي ومضمون (SSD فائق السرعة أو HDD سعة ضخمة) بأفضل سعر.\n\n📌 خطوات إتمام الطلب:\n1. سنتفق هنا في الشات على نوع وموديل وسعة الهارد الأنسب لاحتياجاتك.\n2. يتم دفع ثمن الهارد مسبقاً (عبر إنستاباي، فودافون كاش، أو المحافظ الإلكترونية).\n3. فور تأكيد التحويل نبدأ فوراً بتحميل ألعابك وفحصها وتوصيل الهارد لباب بيتك!`,
                },
              ],
            },
          },
        });
        createdTicketId = ticket.id;

        await prisma.notification.create({
          data: {
            userId: linkedUserId,
            title: `شات شراء الهارد مفتوح لطلب #${orderNumber} 🛒`,
            message: `تم فتح محادثة مباشرة في الدعم الفني للاتفاق على مواصفات ودفع ثمن الهارد الجديد.`,
            type: 'ORDER_UPDATE',
          },
        });
      } catch (ticketErr) {
        console.error('Failed to auto-create hard drive ticket:', ticketErr);
      }
    }

    // Create Notification for Customer
    if (linkedUserId) {
      await prisma.notification.create({
        data: {
          userId: linkedUserId,
          title: `Order ${orderNumber} Queued! 🎮`,
          message: isBuyingHardDrive
            ? `We received your order with Hard Drive purchase. Please coordinate in support chat to confirm drive details.`
            : `We received your order of ${dbGames.length} games (${totalGB} GB). Our courier will contact you within 24 hours.`,
          type: 'ORDER_UPDATE',
        },
      });
    }

    // Log Automated WhatsApp Confirmation
    await prisma.whatsAppLog.create({
      data: {
        orderId: order.id,
        phone: whatsapp || phone,
        template: 'order_confirmation',
        message: isBuyingHardDrive
          ? `Hello ${customerName}! Your GIGADROP order ${orderNumber} with HARD DRIVE PURCHASE request is queued. Chat with us in /dashboard/support to confirm drive specs and upfront payment.`
          : `Hello ${customerName}! Your GIGADROP order ${orderNumber} (${dbGames.length} games · ${totalGB} GB · ${totalPrice.toFixed(2)} EGP) is queued. Track at /track`,
        status: 'SENT',
      },
    });

    return NextResponse.json(
      {
        order,
        summary: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalGB: order.totalGB,
          totalPrice: order.totalPrice,
          discount: order.discount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          paymentRef: order.paymentRef,
          gamesCount: dbGames.length,
          customerName: order.customerName,
          withHardDrive: isBuyingHardDrive,
          hardDriveCapacity: hardDriveCapacity || null,
          ticketId: createdTicketId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
