import axios, { AxiosResponse } from 'axios';
import {
  Product,
  Category,
  Admin,
  DashboardStats,
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await axios.post(
      `${this.baseURL}/auth/login`,
      credentials
    );
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<Admin>> {
    const response: AxiosResponse<ApiResponse<Admin>> = await axios.get(
      `${this.baseURL}/auth/profile`
    );
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await axios.get(
      `${this.baseURL}/dashboard/stats`
    );
    return response.data;
  }

  // Product endpoints
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await axios.get(
      `${this.baseURL}/products`
    );
    return response.data;
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await axios.get(
      `${this.baseURL}/products/${id}`
    );
    return response.data;
  }

  async createProduct(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await axios.post(
      `${this.baseURL}/products`,
      product
    );
    return response.data;
  }

  async updateProduct(id: number, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await axios.put(
      `${this.baseURL}/products/${id}`,
      product
    );
    return response.data;
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await axios.delete(
      `${this.baseURL}/products/${id}`
    );
    return response.data;
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await axios.get(
      `${this.baseURL}/categories`
    );
    return response.data;
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await axios.get(
      `${this.baseURL}/categories/${id}`
    );
    return response.data;
  }

  async createCategory(category: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await axios.post(
      `${this.baseURL}/categories`,
      category
    );
    return response.data;
  }

  async updateCategory(id: number, category: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await axios.put(
      `${this.baseURL}/categories/${id}`,
      category
    );
    return response.data;
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = await axios.delete(
      `${this.baseURL}/categories/${id}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;