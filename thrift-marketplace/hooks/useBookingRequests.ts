// hooks/useBookingRequests.ts

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  BookingRequest,
  BookingRequestAction,
  fetchBookingRequests,
  updateBookingRequest,
} from "@/utils/bookingRequests";

export function useBookingRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = useCallback(async () => {
    if (!user) {
      setRequests([]);
      return;
    }
    setLoading(true);
    const data = await fetchBookingRequests(user.id);
    setRequests(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const act = async (requestId: string, action: BookingRequestAction) => {
    if (!user) return;
    const updated = await updateBookingRequest(requestId, user.id, action);
    if (updated) {
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? updated : req))
      );
    }
  };

  const incoming = useMemo(
    () => requests.filter((r) => user && r.ownerId === user.id),
    [requests, user]
  );

  const outgoing = useMemo(
    () => requests.filter((r) => user && r.renterId === user.id),
    [requests, user]
  );

  const actionableCount = useMemo(
    () =>
      incoming.filter((r) => r.status === "pending").length +
      outgoing.filter((r) => r.status === "approved").length,
    [incoming, outgoing]
  );

  return {
    requests,
    incoming,
    outgoing,
    actionableCount,
    loading,
    refresh: loadRequests,
    act,
  };
}