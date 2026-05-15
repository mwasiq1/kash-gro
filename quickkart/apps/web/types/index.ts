export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  description: string;
  mrp: number;
  sellingPrice: number;
  price: number; // Normalized field
  unit: string;
  imageUrl: string;
  images: string[]; // Normalized field
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
}
