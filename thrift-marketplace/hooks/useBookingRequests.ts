// hooks/useBookingRequests.ts
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  BookingRequest,
  BookingRequestAction,
  fetchBookingRequests,
  updateBookingRequest,
  deriveRequestStatus,
} from "@/utils/bookingRequests";

export function useBookingRequests() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState<{ requests: BookingRequest[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // Live ticking clock for countdown timers
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadRequests = useCallback(async () => {
    if (!user) {
      setLoaded({ requests: [] });
      setLoading(false);
      return;
    }

    try {
      const allRequests = await fetchBookingRequests(user.id);
      setLoaded({ requests: allRequests });
    } catch (err) {
      console.error("Failed to load booking requests:", err);
      setLoaded({ requests: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 10000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const requests = useMemo(
    () =>
      user && loaded
        ? loaded.requests.map((r) => ({ ...r, status: deriveRequestStatus(r, now) }))
        : [],
    [user, loaded, now]
  );

  const incoming = useMemo(
    () => (user ? requests.filter((r) => r.ownerId === user.id) : []),
    [requests, user]
  );
  
  const outgoing = useMemo(
    () => (user ? requests.filter((r) => r.renterId === user.id) : []),
    [requests, user]
  );

  const act = async (requestId: string, action: BookingRequestAction) => {
    if (!user) return;

    const updated = await updateBookingRequest(requestId, user.id, action);
    if (updated) {
      await loadRequests();
    }
  };

  const actionableCount = incoming.filter(
    (r) => deriveRequestStatus(r, now) === "pending"
  ).length;

  return {
    incoming,
    outgoing,
    loading,
    actionableCount,
    act,
    refresh: loadRequests,
    now,
  };
}