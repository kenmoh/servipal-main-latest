import { CreateItem } from "./item-types";
// export interface Product {
//   id: number;
//   seller_id: string;
//   wallet_id: string;
//   name: string;
//   seller: {
//     username: string;
//   };
//   price: string;
//   stock: number;
//   rating: number;
//   num_ratings: number;
//   average_rating: string;
//   colors: string[];
//   sizes: string[];
//   total_sold: number;
//   description: string;
//   image_urls: string[];
// }

// export interface CreateProduct {
//   name: string;
//   price: string;
//   stock: number;
//   description: string;
//   colors?: string[];
//   sizes?: string[];
//   image_urls: string[];
// }

export interface CreateProduct extends CreateItem {
  stock: number;
  sizes: string;
  colors?: string[];
}
export interface CreateProductResponse extends CreateProduct {
  id: string;
  user_id: string;
  total_sold: number;
  created_at: string;
  updated_at: string;
}

export interface BuyItem {
  quantity: number;
  colors?: string[];
  sizes?: string;
  additional_info: string;
}

interface Image {
  id: string;
  url: string;
  item_id: string;
}
interface OrderItem {
  id: string;
  user_id: string;
  name: string;
  price: string;
  images: Image[];
}
export interface BuyItemResponse {
  id: string;
  user_id: string;
  vendor_id: string;
  order_type: string;
  total_price: string;
  order_payment_status: string;
  amount_due_vendor: string;
  payment_link: string;
  description: string;
  quantity: number;
  order_items: OrderItem[];
}

export type ItemOrderStatus =
  | "pending"
  | "received"
  | "rejected"
  | "delivered"
  | "cancelled";
