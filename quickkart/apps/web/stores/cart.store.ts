import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  sellingPrice: number;
  unit: string;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Derived
  cartTotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        } else {
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      // Derived getters (called as functions)
      cartTotal: () =>
        get().items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "kashgro-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
