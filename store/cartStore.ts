import { DeliveryInfo } from "@/types/cart";
import { Food, Laundry } from "@/types/order-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
  items: (Food | Laundry)[];
  cartType: "food" | "laundry" | null;
  deliveryInfo: DeliveryInfo | null;

  // Actions
  addItem: (item: Food | Laundry, type: "food" | "laundry") => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  clearCart: () => void;

  // Getters
  getTotalAmount: () => number;
  getItemCount: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartType: null,
      deliveryInfo: null,

      addItem: (item, type) =>
        set((state) => {
          // If cart is empty, set the type
          if (state.items.length === 0) {
            return {
              cartType: type,
              items: [
                {
                  ...item,
                  price: Number(item.price),
                  quantity: Number(item.quantity),
                },
              ],
            };
          }

          // If trying to add different type, return current state
          if (state.cartType !== type) {
            return state;
          }

          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              ...state,
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + Number(item.quantity) }
                  : i
              ),
            };
          }

          return {
            ...state,
            items: [
              ...state.items,
              {
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity),
              },
            ],
          };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          // If removing last item, reset cart type
          return {
            ...state,
            items: newItems,
            cartType: newItems.length === 0 ? null : state.cartType,
          };
        }),

      updateQuantity: (itemId) =>
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      setDeliveryInfo: (info) => set({ deliveryInfo: info }),

      clearCart: () =>
        set({
          items: [],
          cartType: null,
          deliveryInfo: null,
        }),

      getTotalAmount: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        );
      },
    }),
    {
      name: "cart-storage",
      //   storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
