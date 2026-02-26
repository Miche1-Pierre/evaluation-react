import { api } from '@/lib/api';
import type { Conference } from '@/types/conference';

export const favoriteService = {
  // Get all favorites for current user
  getAll(): Promise<Conference[]> {
    return api.get<Conference[]>('/favorites');
  },

  // Add a conference to favorites
  add(conferenceId: string): Promise<void> {
    return api.post<void>('/favorite', { conferenceId });
  },

  // Remove a conference from favorites
  remove(conferenceId: string): Promise<void> {
    return api.delete<void>(`/favorite/${conferenceId}`);
  },

  // Check if a conference is favorited
  isFavorite(conferenceId: string): Promise<{ isFavorite: boolean }> {
    return api.get<{ isFavorite: boolean }>(`/favorite/${conferenceId}`);
  },
};
