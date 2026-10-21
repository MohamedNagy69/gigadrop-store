import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  const isAdmin =
    role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'SUPPORT';

  if (!session || !isAdmin) {
    return {
      authorized: false as const,
      session: null,
      response: NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true as const,
    session,
    response: null,
  };
}

export async function requireAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      authorized: false as const,
      session: null,
      response: NextResponse.json(
        { error: 'Unauthorized: Please sign in' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true as const,
    session,
    response: null,
  };
}
