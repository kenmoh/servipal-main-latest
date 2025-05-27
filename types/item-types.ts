type ItemType = "food" | "package" | "product" | "laundry";



export interface Review {
  item_id: string;
  rating: number;
  comment: string;
  created_at: string;
}


export interface ItemImage {
  id: string;
  item_id: string;
  url: string;
}

export interface CreateItem {
  name: string;
  description: string;
  price: number;
  itemType: ItemType;
  category_id?: string;
  images: ItemImage[];
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
}


export interface MenuItem {
  description: string;
  id: string;
  images: ItemImage[];
  item_type: string;
  name: string;
  price: string;
  reviews: Review[];
  user_id: string;
}