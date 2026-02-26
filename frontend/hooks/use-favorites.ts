import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '@/services/favorite-service';

export const favoriteKeys = {
  all: ['favorites'] as const,
  detail: (id: string) => ['favorite', id] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.all,
    queryFn: favoriteService.getAll,
  });
}

export function useIsFavorite(conferenceId: string) {
  return useQuery({
    queryKey: favoriteKeys.detail(conferenceId),
    queryFn: () => favoriteService.isFavorite(conferenceId),
    enabled: !!conferenceId,
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conferenceId: string) => favoriteService.add(conferenceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conferenceId: string) => favoriteService.remove(conferenceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });
}

export function useToggleFavorite() {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ conferenceId, isFavorite }: { conferenceId: string; isFavorite: boolean }) => {
      if (isFavorite) {
        await removeFavorite.mutateAsync(conferenceId);
      } else {
        await addFavorite.mutateAsync(conferenceId);
      }
    },
    onSuccess: (_, { conferenceId }) => {
      qc.invalidateQueries({ queryKey: favoriteKeys.all });
      qc.invalidateQueries({ queryKey: favoriteKeys.detail(conferenceId) });
    },
  });
}
