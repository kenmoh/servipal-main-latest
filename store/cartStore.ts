import { create } from "zustand";

export type CartItem = {
  vendor_id: string;
  item_id: string;
  quantity: number;

  // Display-only fields
  name?: string;
  price?: number;
  image?: string;
};

type CartType = {
  order_items: CartItem[];
  // pickup_coordinates: [number | null, number | null];
  // dropoff_coordinates: [number | null, number | null];
  distance: number;
  require_delivery: "pickup" | "delivery";
  duration: number;
  additional_info: string;
};

type CartState = {
  cart: CartType;
  addItem: (vendor_id: string, item_id: string, quantity: number) => void;
  removeItem: (item_id: string) => void;
  updateItemQuantity: (item_id: string, quantity: number) => void;
  // setPickupCoordinates: (lat: number | null, lng: number | null) => void;
  // setDropOffCoordinates: (lat: number | null, lng: number | null) => void;
  setDeliveryOption: (option: "pickup" | "delivery") => void;
  updateDistance: (distance: number) => void;
  updateDuration: (duration: number) => void;
  setAdditionalInfo: (info: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: {
    order_items: [],
    // pickup_coordinates: [null, null],
    // dropoff_coordinates: [null, null],
    distance: 0,
    require_delivery: "pickup",
    duration: 0,
    additional_info: "",
  },

  addItem: (
    vendorId: string,
    itemId: string,
    quantity: number,
    itemDetails: { name: string; price: number; image: string }
  ) =>
    set((state) => {
      const existingItemIndex = state.cart.order_items.findIndex(
        (item) => item.item_id === itemId && item.vendor_id === vendorId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.cart.order_items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };

        return {
          cart: {
            ...state.cart,
            order_items: updatedItems,
          },
        };
      }

      return {
        cart: {
          ...state.cart,
          order_items: [
            ...state.cart.order_items,
            {
              vendor_id: vendorId,
              item_id: itemId,
              quantity,
              name: itemDetails.name,
              price: itemDetails.price,
              image: itemDetails.image,
            },
          ],
        },
      };
    }),
  removeItem: (item_id) =>
    set((state) => ({
      cart: {
        ...state.cart,
        order_items: state.cart.order_items.filter(
          (item) => item.item_id !== item_id
        ),
      },
    })),
  updateItemQuantity: (item_id, quantity) =>
    set((state) => ({
      cart: {
        ...state.cart,
        order_items: state.cart.order_items.map((item) =>
          item.item_id === item_id ? { ...item, quantity } : item
        ),
      },
    })),
  // setPickupCoordinates: (lat, lng) =>
  //   set((state) => ({
  //     cart: {
  //       ...state.cart,
  //       pickupCoordinates: [lat, lng],
  //     },
  //   })),
  // setDropOffCoordinates: (lat, lng) =>
  //   set((state) => ({
  //     cart: {
  //       ...state.cart,
  //       dropOffCoordinates: [lat, lng],
  //     },
  //   })),
  setDeliveryOption: (option) =>
    set((state) => ({
      cart: {
        ...state.cart,
        requireDelivery: option,
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
        additional_info: info,
      },
    })),
  clearCart: () =>
    set(() => ({
      cart: {
        order_items: [],
        // pickup_coordinates: [null, null],
        // dropoff_coordinates: [null, null],
        distance: 0,
        require_delivery: "pickup",
        duration: 0,
        additional_info: "",
      },
    })),
}));
