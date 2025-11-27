import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Matching your ProductCard interface exactly
export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category?: string;
  available?: number;
  isActive: boolean;
}

interface CartStore {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => ({ cart: [...state.cart, product] })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'shopping-cart-storage',
    }
  )
);