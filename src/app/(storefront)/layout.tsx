import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartSidebar from '@/components/storefront/CartSidebar';
import CheckoutModal from '@/components/storefront/CheckoutModal';
import OrderSuccessModal from '@/components/storefront/OrderSuccessModal';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <CartSidebar />
      <CheckoutModal />
      <OrderSuccessModal />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
