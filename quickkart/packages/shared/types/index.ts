export type Role = "USER" | "ADMIN" | "RIDER";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  clerkId?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  unit: string;
  imageUrl: string;
  categoryId: string;
  category?: Partial<Category>;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}
