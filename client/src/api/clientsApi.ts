import type { Company } from "@nevis-books/shared";

const CLIENTS_ENDPOINT = "/api/clients";

export class ClientsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ClientsApiError";
    this.status = status;
  }
}

/**
 * Fetches the company clients tree from the REST API.
 * Throws ClientsApiError when the response is not OK.
 */
export async function fetchClients(
  fetchImpl: typeof fetch = fetch,
): Promise<Company> {
  const response = await fetchImpl(CLIENTS_ENDPOINT);

  if (!response.ok) {
    throw new ClientsApiError(
      response.status,
      `Failed to load clients (${response.status})`,
    );
  }

  return (await response.json()) as Company;
}
