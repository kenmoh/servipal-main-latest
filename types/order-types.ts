export interface Food {
  id: string;
  restaurant_id: string;
  name: string;
  price: string;
  quantity: number;
  side: string;
  ingredients: string;
  image_url: string;
}

export interface Laundry {
  id: string;
  laundry_id: string;
  name: string;
  price: string;
  quantity: number;
  image_url: string;
}

export type Coordinates = [number | null, number | null];
export type OrderType = "delivery" | "food" | "laundry";
export type OrderStatus = "pending" | "in-transit" | "delivered";

export interface Order {
  id: string;
  order_number: string;
  package_name: string;
  item_id: string;
  image_url: string;
  amount_due_vendor: string;
  amount_due_dispatch: string;
  commission_rate_item: string;
  commission_rate_delivery: string;
  delivery_fee: string;
  item_cost: string;
  total_cost: string;
  order_status: OrderStatus;
  item_status: string;
  payment_status: string;
  order_type: OrderType;
  payment_url: string;
  order_owner_username: string;
  dispatch_company_phone_number: string;
  vendor_phone_number: string;
  vendor_username: string;
  origin: string;
  destination: string;
  distance: string;
  duration: number;
  destination_coords: Coordinates;
  origin_coords: Coordinates;
  description: string;
  order_owner_phone_number: string;
  dispatch_company_name: string;
  rider_phone_number: string;
  rider_image_url: string;
  rider_name: string;
  rider_bike_plate_number: string;
  foods: Food[];
  laundries: Laundry[];
  created_at: string;
  updated_at: string;
}

export type ApiResponse = Order[];
