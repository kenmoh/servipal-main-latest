export interface Food {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  quantity: number;
  side: string;
  ingredients: string;
  image_url: string;
}

export interface DeliveryOrder {
  foods: Food[];
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  origin_coords: [number | null, number | null];
  destination_coords: [number | null, number | null];
  additional_info: string;
}

export interface Laundry {
  id: string;
  laundry_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface LaundryOrder {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  additional_info: string;
  origin_coords: [number | null, number | null];
  destination_coords: [number | null, number | null];
  laundries: Laundry[];
}

export interface DeliveryInfo {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  origin_coords: [number | null, number | null];
  destination_coords: [number | null, number | null];
  additional_info: string;
}
