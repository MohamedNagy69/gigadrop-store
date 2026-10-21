export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateReferralCode } from '@/lib/utils';
import { checkRateLimit, getClientIp, isValidEmail, sanitizePhone } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 5 registration attempts per IP every 15 minutes
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`register:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'عدد محاولات التسجيل كبير جداً. يرجى المحاولة بعد قليل (Too many registration attempts)' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, whatsapp, address, password, birthdate, referredBy } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صالحة (Invalid email format)' },
        { status: 400 }
      );
    }

    // Enforce minimum password length
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل (Password must be at least 8 characters)' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let referralCode = generateReferralCode(name);

    // Cryptographically resilient referralCode generation
    let attempts = 0;
    while (attempts < 5) {
      const codeExists = await prisma.user.findUnique({ where: { referralCode } });
      if (!codeExists) break;
      referralCode = `${generateReferralCode(name)}${Math.floor(1000 + Math.random() * 9000)}`;
      attempts++;
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim().slice(0, 100),
        email: cleanEmail,
        phone: phone ? sanitizePhone(phone) : null,
        whatsapp: whatsapp ? sanitizePhone(whatsapp) : (phone ? sanitizePhone(phone) : null),
        address: address ? address.trim().slice(0, 255) : null,
        birthdate: birthdate ? new Date(birthdate) : null,
        password: hashedPassword,
        referralCode,
        referredBy: referredBy ? referredBy.trim().toUpperCase() : null,
        role: 'CUSTOMER',
      },
    });

    // If referredBy a valid user, log a Referral record and notify referrer
    if (referredBy) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referredBy.trim().toUpperCase() },
      });
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredEmail: cleanEmail,
            discount: 25,
            isUsed: false,
          },
        });
        await prisma.notification.create({
          data: {
            userId: referrer.id,
            title: 'New Friend Joined via Your Code! 🎉',
            message: `${name} signed up using your code ${referrer.referralCode}.`,
            type: 'REFERRAL',
          },
        });
      }
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to GIGADROP! 🎮',
        message: `Your personal referral code is ${user.referralCode}. Share it with friends to earn discounts!`,
        type: 'SYSTEM',
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
