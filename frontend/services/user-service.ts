import { api } from '@/lib/api';
import type { User } from '@/types/user';

export const userService = {
  getAll(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  promoteToAdmin(id: string): Promise<User> {
    return api.patch<User>(`/usertype?id=${id}`, { newType: 'admin' });
  },
};
