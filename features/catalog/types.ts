export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  imageUrl: string;
  stock: number;
  tags: string[];
  isNew: boolean;
  isDiscounted: boolean;
  discountPrice?: number;
}

export interface FilterOptions {
  search: string;
  category: string;
  sortBy: string;
  minPrice: number;
  maxPrice: number;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";
