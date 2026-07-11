import api from './api';
import type { Order } from '../types';

export interface CreateOrderData {
  restaurant_id: string;
  delivery_address: string;
  payment_method?: string;
  note?: string;
  items: {
    menu_item_id: string;
    quantity: number;
  }[];
}

export const orderService = {
  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
