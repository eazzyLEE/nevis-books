import type { Company } from "@nevis-books/shared";

const CLIENTS_ENDPOINT = "/api/clients";

export async function fetchClients(
  fetchImpl: typeof fetch = fetch,
): Promise<Company> {
  const response = await fetchImpl(CLIENTS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to load clients (${response.status})`);
  }

  return (await response.json()) as Company;
}
