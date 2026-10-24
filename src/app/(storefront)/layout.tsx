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
    <div className="flex min-h-screen w-full flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden selection:bg-[#CCFF00] selection:text-black">
      <Navbar />
      <CartSidebar />
      <CheckoutModal />
      <OrderSuccessModal />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
