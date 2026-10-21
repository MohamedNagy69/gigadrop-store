export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateReferralCode } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, whatsapp, address, password, birthdate, referredBy } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let referralCode = generateReferralCode(name);

    // Ensure unique referralCode
    const codeExists = await prisma.user.findUnique({ where: { referralCode } });
    if (codeExists) {
      referralCode = `${referralCode}${Math.floor(Math.random() * 9)}`;
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone || null,
        whatsapp: whatsapp || phone || null,
        address: address || null,
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
