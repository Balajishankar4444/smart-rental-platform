"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface FavoritesState {
  userId: string;
  ids: string[];
}

/** Per-user favorites ("hearted" listings), persisted by /api/auth/favorites. */
export function useFavorites() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState<FavoritesState | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    fetch(`/api/auth/favorites?userId=${encodeURIComponent(user.id)}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return;
        setLoaded({ userId: user.id, ids: Array.isArray(result?.data) ? result.data : [] });
      })
      .catch((err) => console.error("Failed to load favorites", err));

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isCurrent = Boolean(user && loaded?.userId === user.id);
  const favoriteIds = useMemo(
    () => (isCurrent && loaded ? loaded.ids : []),
    [isCurrent, loaded]
  );
  const isLoading = Boolean(user) && !isCurrent;

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) return false;

      try {
        const response = await fetch("/api/auth/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId }),
        });

        const result = await response.json();
        if (!response.ok || !result?.success) throw new Error(result?.error);

        setLoaded({ userId: user.id, ids: result.data as string[] });
        return Boolean(result.favorited);
      } catch (err) {
        console.error("Failed to update favorites", err);
        return isFavorite(productId);
      }
    },
    [user, isFavorite]
  );

  return { favoriteIds, isFavorite, toggleFavorite, isLoading, isSignedIn: Boolean(user) };
}
