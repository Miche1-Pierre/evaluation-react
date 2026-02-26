import { api } from '@/lib/api';
import type {
  Conference,
  ConferenceCreatePayload,
  ConferenceUpdatePayload,
} from '@/types/conference';

export const conferenceService = {
  getAll(): Promise<Conference[]> {
    return api.get<Conference[]>('/conferences');
  },

  getById(id: string): Promise<Conference> {
    return api.get<Conference>(`/conferences/${id}`);
  },

  create(payload: ConferenceCreatePayload): Promise<Conference> {
    return api.post<Conference>('/conferences', payload);
  },

  update(id: string, payload: ConferenceUpdatePayload): Promise<Conference> {
    return api.put<Conference>(`/conferences/${id}`, payload);
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/conferences/${id}`);
  },
};
