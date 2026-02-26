import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];

  addFavorite: (conferenceId: string) => void;
  removeFavorite: (conferenceId: string) => void;
  toggleFavorite: (conferenceId: string) => void;
  isFavorite: (conferenceId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (conferenceId) => {
        const { favoriteIds } = get();
        if (!favoriteIds.includes(conferenceId)) {
          set({ favoriteIds: [...favoriteIds, conferenceId] });
        }
      },

      removeFavorite: (conferenceId) => {
        const { favoriteIds } = get();
        set({ favoriteIds: favoriteIds.filter((id) => id !== conferenceId) });
      },

      toggleFavorite: (conferenceId) => {
        const { favoriteIds, addFavorite, removeFavorite } = get();
        if (favoriteIds.includes(conferenceId)) {
          removeFavorite(conferenceId);
        } else {
          addFavorite(conferenceId);
        }
      },

      isFavorite: (conferenceId) => {
        return get().favoriteIds.includes(conferenceId);
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: "favorites-storage", // persisted key in localStorage
    },
  ),
);
