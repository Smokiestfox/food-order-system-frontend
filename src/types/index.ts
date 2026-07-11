// ==========================================
// Type Definitions — Order System
// ==========================================

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  image_url?: string;
  address: string;
  phone: string;
  rating: number;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  menu_items?: MenuItem[];
  review_count?: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  status: OrderStatus;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  note?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  restaurant?: Restaurant;
  customer?: User;
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  order_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

// Cart types (client-side only)
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
