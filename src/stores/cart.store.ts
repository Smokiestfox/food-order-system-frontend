import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  addItem: (menuItem: MenuItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (menuItem, restaurantId, restaurantName) => {
        const state = get();

        // If cart has items from a different restaurant, clear it
        if (state.restaurantId && state.restaurantId !== restaurantId) {
          set({ items: [], restaurantId: null, restaurantName: null });
        }

        const existingItem = state.items.find(
          (item) => item.menuItem.id === menuItem.id
        );

        if (existingItem) {
          set({
            items: state.items.map((item) =>
              item.menuItem.id === menuItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            restaurantId,
            restaurantName,
          });
        } else {
          set({
            items: [...state.items, { menuItem, quantity: 1 }],
            restaurantId,
            restaurantName,
          });
        }
      },

      removeItem: (menuItemId) => {
        const newItems = get().items.filter(
          (item) => item.menuItem.id !== menuItemId
        );
        if (newItems.length === 0) {
          set({ items: [], restaurantId: null, restaurantName: null });
        } else {
          set({ items: newItems });
        }
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], restaurantId: null, restaurantName: null });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
