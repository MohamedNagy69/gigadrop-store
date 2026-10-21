'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, OrderSuccessData } from '@/types';
import { calculatePrice } from '@/lib/utils';

interface CartState {
  items: CartItem[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  ratePerGB: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  orderSuccess: OrderSuccessData | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  setWishlistIds: (ids: string[]) => void;
  addRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;
  setRatePerGB: (rate: number) => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setOrderSuccess: (data: OrderSuccessData | null) => void;
  getTotalGB: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlistIds: [],
      recentlyViewedIds: [],
      ratePerGB: 1.0,
      isCartOpen: false,
      isCheckoutOpen: false,
      orderSuccess: null,

      addItem: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (!exists) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      isInCart: (id) => {
        return get().items.some((i) => i.id === id);
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleWishlist: (id) => {
        const current = get().wishlistIds;
        if (current.includes(id)) {
          set({ wishlistIds: current.filter((w) => w !== id) });
        } else {
          set({ wishlistIds: [...current, id] });
        }
      },

      setWishlistIds: (ids) => {
        set({ wishlistIds: ids });
      },

      addRecentlyViewed: (id) => {
        const filtered = get().recentlyViewedIds.filter((r) => r !== id);
        set({ recentlyViewedIds: [id, ...filtered].slice(0, 10) });
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewedIds: [] });
      },

      setRatePerGB: (rate) => {
        set({ ratePerGB: rate > 0 ? rate : 1.0 });
      },

      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      setCheckoutOpen: (open) => {
        set({ isCheckoutOpen: open, isCartOpen: false });
      },

      setOrderSuccess: (data) => {
        set({ orderSuccess: data, isCheckoutOpen: false, isCartOpen: false });
      },

      getTotalGB: () => {
        const sum = get().items.reduce((acc, item) => acc + Number(item.sizeGB || 0), 0);
        return Number(sum.toFixed(2));
      },

      getTotalPrice: () => {
        const totalGB = get().getTotalGB();
        return calculatePrice(totalGB, get().ratePerGB);
      },
    }),
    {
      name: 'gigadrop-cart-storage',
      partialize: (state) => ({
        items: state.items,
        wishlistIds: state.wishlistIds,
        recentlyViewedIds: state.recentlyViewedIds,
        ratePerGB: state.ratePerGB,
      }),
    }
  )
);
