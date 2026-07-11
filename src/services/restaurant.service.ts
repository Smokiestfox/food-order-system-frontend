import api from './api';
import type { Restaurant, MenuItem, PaginatedResponse, Review } from '../types';

export interface RestaurantQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const restaurantService = {
  async getAll(params?: RestaurantQuery): Promise<PaginatedResponse<Restaurant>> {
    const response = await api.get<PaginatedResponse<Restaurant>>('/restaurants', { params });
    return response.data;
  },

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  async create(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.post<Restaurant>('/restaurants', data);
    return response.data;
  },

  async update(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.patch<Restaurant>(`/restaurants/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/restaurants/${id}`);
  },

  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu`);
    return response.data;
  },

  async getReviews(restaurantId: string): Promise<Review[]> {
    const response = await api.get<Review[]>(`/restaurants/${restaurantId}/reviews`);
    return response.data;
  },
};
