"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  BookingRequest,
  BookingRequestAction,
  fetchBookingRequests,
  updateBookingRequest,
} from "@/utils/bookingRequests";

interface RequestsState {
  userId: string;
  requests: BookingRequest[];
}

/** Booking requests where the signed-in user is either the owner or the renter. */
export function useBookingRequests() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState<RequestsState | null>(null);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    fetchBookingRequests({ userId: user.id })
      .then((requests) => {
        if (!cancelled) setLoaded({ userId: user.id, requests });
      })
      .catch((err) => console.error("Failed to load booking requests", err));

    return () => {
      cancelled = true;
    };
  }, [user, reloadToken]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const isCurrent = Boolean(user && loaded?.userId === user.id);
  const requests = useMemo(
    () => (isCurrent && loaded ? loaded.requests : []),
    [isCurrent, loaded]
  );

  const incoming = useMemo(
    () => requests.filter((item) => item.ownerId === user?.id),
    [requests, user]
  );
  const outgoing = useMemo(
    () => requests.filter((item) => item.renterId === user?.id),
    [requests, user]
  );

  // Anything the user still has to act on: decide as owner, pay as renter
  const actionableCount =
    incoming.filter((item) => item.status === "pending").length +
    outgoing.filter((item) => item.status === "approved").length;

  const act = useCallback(
    async (id: string, action: BookingRequestAction) => {
      if (!user) return null;

      const updated = await updateBookingRequest(id, user.id, action);
      refresh();
      return updated;
    },
    [user, refresh]
  );

  return {
    requests,
    incoming,
    outgoing,
    actionableCount,
    isLoading: Boolean(user) && !isCurrent,
    act,
    refresh,
  };
}
