import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartItem = {
  vendorId: string;
  itemId: string;
  quantity: number;
};

type CartType = {
  orderItems: CartItem[];
  pickupCoordinates: [number | null, number | null];
  dropOffCoordinates: [number | null, number | null];
  distance: number;
  requireDelivery: 'pickup' | 'delivery';
  duration: number;
  additionalInfo: string;
};

type CartState = {
  cart: CartType;
  addItem: (vendorId: string, itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  setPickupCoordinates: (lat: number | null, lng: number | null) => void;
  setDropOffCoordinates: (lat: number | null, lng: number | null) => void;
  setDeliveryOption: (option: 'pickup' | 'delivery') => void;
  updateDistance: (distance: number) => void;
  updateDuration: (duration: number) => void;
  setAdditionalInfo: (info: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: {
    orderItems: [],
    pickupCoordinates: [null, null],
    dropOffCoordinates: [null, null],
    distance: 0,
    requireDelivery: 'pickup',
    duration: 0,
    additionalInfo: '',
  },
  addItem: (vendorId, item_id, quantity) =>
    set((state) => {
      const existingItem = state.cart.orderItems.find(
        (item) => item.itemId === item_id && item.vendorId === vendorId
      );
      if (existingItem) {
        return {
          cart: {
            ...state.cart,
            order_items: state.cart.orderItems.map((item) =>
              item.itemId === item_id && item.vendorId === vendorId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          },
        };
      }
      return {
        cart: {
          ...state.cart,
          order_items: [
            ...state.cart.orderItems,
            { vendorId, item_id, quantity },
          ],
        },
      };
    }),
  removeItem: (itemId) =>
    set((state) => ({
      cart: {
        ...state.cart,
        order_items: state.cart.orderItems.filter(
          (item) => item.itemId !== itemId
        ),
      },
    })),
  updateItemQuantity: (item_id, quantity) =>
    set((state) => ({
      cart: {
        ...state.cart,
        order_items: state.cart.orderItems.map((item) =>
          item.itemId === item_id ? { ...item, quantity } : item
        ),
      },
    })),
  setPickupCoordinates: (lat, lng) =>
    set((state) => ({
      cart: {
        ...state.cart,
        pickupCoordinates: [lat, lng],
      },
    })),
  setDropOffCoordinates: (lat, lng) =>
    set((state) => ({
      cart: {
        ...state.cart,
        dropOffCoordinates: [lat, lng],
      },
    })),
  setDeliveryOption: (option) =>
    set((state) => ({
      cart: {
        ...state.cart,
        require_delivery: option,
      },
    })),
  updateDistance: (distance) =>
    set((state) => ({
      cart: {
        ...state.cart,
        distance,
      },
    })),
  updateDuration: (duration) =>
    set((state) => ({
      cart: {
        ...state.cart,
        duration,
      },
    })),
  setAdditionalInfo: (info) =>
    set((state) => ({
      cart: {
        ...state.cart,
        additionalInfo: info,
      },
    })),
  clearCart: () =>
    set(() => ({
        cart: {
            orderItems: [],
            pickupCoordinates: [null, null],
            dropOffCoordinates: [null, null],
            distance: 0,
            requireDelivery: 'pickup',
            duration: 0,
            additionalInfo: '',
        },
    })),
}));
