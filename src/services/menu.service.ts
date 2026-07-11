import api from './api';
import type { MenuItem } from '../types';

export const menuService = {
  async create(restaurantId: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await api.post<MenuItem>(`/restaurants/${restaurantId}/menu`, data);
    return response.data;
  },

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await api.patch<MenuItem>(`/menu/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/menu/${id}`);
  },
};
