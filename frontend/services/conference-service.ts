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
    return api.get<Conference>(`/conference/${id}`);
  },

  create(payload: ConferenceCreatePayload): Promise<Conference> {
    return api.post<Conference>('/conference', payload);
  },

  update(id: string, payload: ConferenceUpdatePayload): Promise<Conference> {
    return api.patch<Conference>(`/conference/${id}`, payload);
  },

  delete(id: string): Promise<void> {
    return api.delete<void>(`/conference/${id}`);
  },
};
