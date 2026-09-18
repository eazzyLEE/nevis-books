import { useEffect, useState } from "react";
import type { Company } from "@nevis-books/shared";
import { fetchClients } from "../api/clientsApi";

export type ClientsState =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: Company; error: null }
  | { status: "error"; data: null; error: Error };

export type UseClientsResult = ClientsState & {
  retry: () => void;
};

function toError(caught: unknown): Error {
  return caught instanceof Error ? caught : new Error(String(caught));
}

export function useClients(
  loadClients: () => Promise<Company> = fetchClients,
): UseClientsResult {
  const [requestId, setRequestId] = useState(0);
  const [state, setState] = useState<ClientsState>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    let requestCancelled = false;

    setState({ status: "loading", data: null, error: null });

    void loadClients()
      .then((data) => {
        if (!requestCancelled) {
          setState({ status: "success", data, error: null });
        }
      })
      .catch((caught: unknown) => {
        if (!requestCancelled) {
          setState({ status: "error", data: null, error: toError(caught) });
        }
      });

    return () => {
      requestCancelled = true;
    };
  }, [loadClients, requestId]);

  return {
    ...state,
    retry: () => {
      setRequestId((current) => current + 1);
    },
  };
}
