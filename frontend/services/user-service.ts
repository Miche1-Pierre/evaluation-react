import { api } from '@/lib/api';
import type { User } from '@/types/user';

export const userService = {
  getAll(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  promoteToAdmin(id: string): Promise<User> {
    return api.patch<User>(`/usertype/${id}`, { newType: 'admin' });
  },

  changeType(id: string, newType: 'admin' | 'user'): Promise<User> {
    return api.patch<User>(`/usertype/${id}`, { newType });
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/user/${id}`);
  },
};
