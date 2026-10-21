'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  const user = session?.user as
    | {
        id: string;
        name: string;
        email: string;
        role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';
        referralCode?: string;
        phone?: string;
        address?: string;
      }
    | undefined;

  return {
    user,
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'SUPPORT',
    signIn,
    signOut,
  };
}
