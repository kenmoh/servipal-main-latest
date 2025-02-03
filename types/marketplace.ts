export interface Product {
  id: number;
  seller_id: string;
  wallet_id: string;
  name: string;
  seller: {
    username: string;
  };
  price: string;
  stock: number;
  rating: number;
  num_ratings: number;
  average_rating: string;
  colors: string[];
  sizes: string[];
  total_sold: number;
  description: string;
  image_urls: string[];
}

export interface CreateProduct {
  name: string;
  price: string;
  stock: number;
  description: string;
  colors?: string[];
  sizes?: string[];
  image_urls: string[];
}
