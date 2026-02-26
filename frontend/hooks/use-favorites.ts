import { useFavoritesStore } from "@/store/favorites-store";
import { useConferences } from "./use-conferences";

export function useFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { data: allConferences = [], isLoading } = useConferences();

  // Filter conferences by favorite IDs
  const favorites = allConferences.filter((conf) =>
    favoriteIds.includes(conf.id),
  );

  return { data: favorites, isLoading };
}

export function useIsFavorite(conferenceId: string) {
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(conferenceId),
  );
  return { data: { isFavorite }, isLoading: false };
}

export function useToggleFavorite() {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return {
    mutateAsync: async ({
      conferenceId,
    }: {
      conferenceId: string;
      isFavorite: boolean;
    }) => {
      toggleFavorite(conferenceId);
    },
    isPending: false,
  };
}
