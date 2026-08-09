// hooks/useFavorites.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  hasFavorite,
  removeFavorite,
  subscribeToFavorites,
} from "@/lib/store/favorites";
import type { FavoriteTrip } from "@/lib/types";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteTrip[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsHydrated(true);
    return subscribeToFavorites(setFavorites);
  }, []);

  const add = useCallback((trip: Omit<FavoriteTrip, "savedAt">) => {
    addFavorite(trip);
  }, []);

  const remove = useCallback((placeId: string) => {
    removeFavorite(placeId);
  }, []);

  const toggle = useCallback((trip: Omit<FavoriteTrip, "savedAt">) => {
    if (hasFavorite(trip.placeId)) {
      removeFavorite(trip.placeId);
    } else {
      addFavorite(trip);
    }
  }, []);

  const has = useCallback((placeId: string) => hasFavorite(placeId), []);

  return {
    favorites,
    isHydrated,
    add,
    remove,
    toggle,
    has,
    count: favorites.length,
  };
}

export default useFavorites;