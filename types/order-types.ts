export type Coordinates = [number | null, number | null];
export type OrderType = "delivery" | "food" | "laundry";
export type OrderStatus = "pending" | "in-transit" | "delivered";
export type RequireDelivery = "pickup" | "delivery";

export interface ImageType {
  url: string;
  type: string;
  name: string;
}
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export interface SendItem {
  name: string;
  description: string;
  origin: string;
  destination: string;
  duration: string;
  pickup_coordinates: Coordinates;
  dropoff_coordinates: Coordinates;
  distance: number;
  imageUrl: string;
}

interface Delivery {
  id: string;
  delivery_type: OrderType;
  delivery_status: OrderStatus;
  sender_id: string;
  vendor_id: string;
  dispatch_id: string;
  rider_id: string;
  distance: string;
  origin?: string;
  duration?: string;
  destination?: string;
  delivery_fee: string;
  amount_due_dispatch: string;
  created_at: string;
}

export interface OrderItemResponse {
  id: string;
  user_id: string;
  name: string;
  price: string;
  description: string;
  quantity: 0;
  images: ImageType[];
}

export interface OrderResponse {
  id: string;
  user_id: string;
  vendor_id: string;
  order_type: string;
  order_number: string;
  total_price: string;
  order_payment_status: PaymentStatus;
  order_status: OrderStatus;
  amount_due_vendor: string;
  payment_link: string;
  order_items: OrderItemResponse[];
}

export interface DeliveryDetail {
  delivery: Delivery;
  order: OrderResponse;
}

interface OrderItem {
  vendor_id: string;
  item_id: string;
  quantity: 0;
}

export interface OrderFoodOLaundry {
  order_items: OrderItem[];
  pickup_coordinates: [null, null];
  dropoff_coordinates: [null, null];
  distance: 0;
  require_delivery: RequireDelivery;
  duration: string;
  additional_info: string;
}

export interface CreateReview {
  rating: number;
  comment: string;
}
// /api/orders/delivery-by-type -> GET(delivery-by-type)

// /api/orders/{order_id}/review
