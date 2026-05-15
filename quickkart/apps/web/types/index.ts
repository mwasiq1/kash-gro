export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  imageUrl: string;
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
