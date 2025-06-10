export type Coordinates = [number | null, number | null];
export type OrderType = "delivery" | "food" | "laundry";
export type OrderStatus = "pending" | "in-transit" | "delivered";
export type RequireDelivery = "pickup" | "delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type RiderDeliveryStatus = "in transit" | "delivered" | "canceled";
export type SenderDeliveryStatus = "received";
export type LaundryDeliveryStatus = "laundry received";
export type DeliveryStatus =
  | "accept"
  | "pending"
  | "delivered"
  | "received"
  | "laundry_received"
  | "canceled";

export interface ImageType {
  url: string;
  type: string;
  name: string;
}
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
  delivery_status: DeliveryStatus;
  sender_id: string;
  vendor_id: string;
  rider_id: string;
  sender_phone_number: string;
  rider_phone_number: string;
  dispatch_id: string;
  distance: string;
  origin?: string;
  duration?: string;
  destination?: string;
  delivery_fee: string;
  amount_due_dispatch: string;
  created_at: string;
  pickup_coordinates?: Coordinates;
  dropoff_coordinates?: Coordinates;
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
  delivery?: Delivery;
  order: OrderResponse;
}

interface OrderItem {
  vendor_id: string;
  item_id: string;
  quantity: number;
}

export interface OrderFoodOLaundry {
  order_items: OrderItem[];
  pickup_coordinates?: [number, number] | [null, null];
  dropoff_coordinates?: [number, number] | [null, null];
  distance?: number;
  require_delivery: RequireDelivery;
  duration?: string;
  origin?: string;
  destination?: string;
  additional_info?: string;
}

export interface CreateReview {
  rating: number;
  comment: string;
}
// /api/orders/delivery-by-type -> GET(delivery-by-type)

// /api/orders/{order_id}/review
