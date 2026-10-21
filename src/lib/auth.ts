import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }
        const normalizedEmail = credentials.email.toLowerCase().trim();
        let user: any = null;
        try {
          user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });
        } catch {
          // Fallback if production DB is not connected yet
          if (normalizedEmail === 'admin@gigadrop.eg' && credentials.password === 'Admin@123') {
            return {
              id: 'admin-fallback-id',
              name: 'GIGADROP Admin',
              email: 'admin@gigadrop.eg',
              role: 'SUPER_ADMIN',
              referralCode: 'GIGA-ADMIN',
              phone: '+20 100 999 8877',
              address: 'Cairo, Egypt',
            };
          }
          if (normalizedEmail === 'ahmed@gigadrop.eg' && credentials.password === 'Customer@123') {
            return {
              id: 'customer-fallback-id',
              name: 'Ahmed Hassan',
              email: 'ahmed@gigadrop.eg',
              role: 'CUSTOMER',
              referralCode: 'GIGA-AHMED24',
              phone: '+20 101 234 5678',
              address: 'Nasr City, Cairo',
            };
          }
        }
        if (!user || !user.isActive) {
          throw new Error('Invalid email or account disabled');
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          referralCode: user.referralCode,
          phone: user.phone,
          address: user.address,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'CUSTOMER';
        token.referralCode = (user as any).referralCode || '';
        token.phone = (user as any).phone || '';
        token.address = (user as any).address || '';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).referralCode = token.referralCode;
        (session.user as any).phone = token.phone;
        (session.user as any).address = token.address;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'gigadrop-super-secret-jwt-key-2026-cairo-egypt',
};
