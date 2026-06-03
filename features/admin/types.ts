export interface ProductDimensions {
  width?: number; // en cm
  height?: number; // en cm
  depth?: number; // en cm
}

export type ProductStatus = "active" | "draft" | "out_of_stock";
export type ProductCategory = "electronics" | "clothing" | "home" | "sports" | "books" | "other";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
  weight?: number; // en kg
  dimensions?: ProductDimensions;
  createdAt: string;
}

export interface ProductFormInput {
  name: string;
  sku: string;
  description: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
}
