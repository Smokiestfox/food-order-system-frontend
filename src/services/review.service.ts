import api from './api';
import type { Review } from '../types';

export const reviewService = {
  async create(data: { restaurant_id: string; order_id?: string; rating: number; comment?: string }): Promise<Review> {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },
};
