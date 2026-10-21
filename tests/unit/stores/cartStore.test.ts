import { useCartStore } from '@/stores/cartStore';

describe('GIGADROP Cart & Wishlist Zustand Store', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      wishlistIds: [],
      recentlyViewedIds: [],
      ratePerGB: 1.0,
      isCartOpen: false,
      isCheckoutOpen: false,
      orderSuccess: null,
    });
  });

  test('adds and removes games from cart and calculates total GB & price', () => {
    const store = useCartStore.getState();
    store.addItem({
      id: 'game-1',
      name: 'Cyberpunk 2077',
      coverImage: 'https://example.com/cp.jpg',
      sizeGB: 112.5,
      price: 112.5,
      releaseYear: 2023,
      genre: ['RPG'],
    });
    store.addItem({
      id: 'game-2',
      name: 'Elden Ring',
      coverImage: 'https://example.com/er.jpg',
      sizeGB: 68.4,
      price: 68.4,
      releaseYear: 2024,
      genre: ['RPG'],
    });

    expect(useCartStore.getState().items.length).toBe(2);
    expect(useCartStore.getState().getTotalGB()).toBe(180.9);
    expect(useCartStore.getState().getTotalPrice()).toBe(180.9);

    useCartStore.getState().removeItem('game-1');
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().getTotalGB()).toBe(68.4);
  });

  test('toggles wishlist items properly', () => {
    useCartStore.getState().toggleWishlist('game-99');
    expect(useCartStore.getState().wishlistIds).toContain('game-99');

    useCartStore.getState().toggleWishlist('game-99');
    expect(useCartStore.getState().wishlistIds).not.toContain('game-99');
  });
});
