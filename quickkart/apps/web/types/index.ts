export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  description: string;
  mrp: number;
  price: number;
  unit: string;
  images: string[];
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
