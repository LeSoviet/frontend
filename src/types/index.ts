export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id?: number;
  category?: Category | string;
  activeIngredient?: string;
  strength?: string;
  form?: string;
  manufacturer?: string;
  requiresPrescription?: boolean;
  image?: string;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number | string;
  name: string;
  description: string;
  productCount?: number;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalValue: number;
  recentProducts: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
}