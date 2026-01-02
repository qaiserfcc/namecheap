import { UserRole } from '@prisma/client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  officialPrice: number;
  discountedPrice: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  brandId: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string | null;
  isEnabled: boolean;
}
