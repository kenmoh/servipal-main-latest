type ItemType = "food" | "package" | "product" | "laundry";

export interface Review {
  item_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    profile_image: string;
  };
}

export interface ItemImage {
  id: string;
  item_id: string;
  url: string;
}

export interface CreateItem {
  name: string;
  description?: string;
  price: number;
  itemType: ItemType;
  category_id?: string;
  images: ItemImage[];
  colors?: string[];
  sizes?: string;
  stock?: number;
}
export interface ItemResponse extends CreateItem {
  id: string;
  user_id: string;
  reviews: Review[];
}

export interface CreateCategory {
  name: string;
}
export interface CategoryResponse extends CreateCategory {
  id: string;
  category_type: "food" | "product";
}

interface MenuBase {
  id: string;
  name: string;
  item_type: string;
  price: string;
  images: ItemImage[];

}

export interface MenuItem extends MenuBase {
  
  restaurant_id: string;
  description: string;
  
}


export interface LaundryMenuItem extends MenuBase {
  
  laundry_id: string;
  
}