import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conferenceService } from "@/services/conference-service";
import type {
  ConferenceCreatePayload,
  ConferenceUpdatePayload,
} from "@/types/conference";

export const conferenceKeys = {
  all: ["conferences"] as const,
  detail: (id: string) => ["conferences", id] as const,
};

export function useConferences() {
  return useQuery({
    queryKey: conferenceKeys.all,
    queryFn: conferenceService.getAll,
  });
}

export function useConference(id: string) {
  return useQuery({
    queryKey: conferenceKeys.detail(id),
    queryFn: () => conferenceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateConference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConferenceCreatePayload) =>
      conferenceService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: conferenceKeys.all }),
  });
}

export function useUpdateConference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ConferenceUpdatePayload;
    }) => conferenceService.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: conferenceKeys.all });
      qc.invalidateQueries({ queryKey: conferenceKeys.detail(id) });
    },
  });
}

export function useDeleteConference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => conferenceService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: conferenceKeys.all }),
  });
}
