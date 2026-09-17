import { describe, expect, it, vi } from "vitest";
import { ClientsApiError, fetchClients } from "./clientsApi";

describe("fetchClients", () => {
  it("returns the company payload on success", async () => {
    const company = {
      id: "company-1",
      name: "Company",
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      branches: [],
    };

    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => company,
    });

    await expect(fetchClients(fetchImpl)).resolves.toEqual(company);
    expect(fetchImpl).toHaveBeenCalledWith("/api/clients");
  });

  it("throws ClientsApiError when the response is not OK", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const error = await fetchClients(fetchImpl).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ClientsApiError);
    expect(error).toMatchObject({
      status: 500,
      message: "Failed to load clients (500)",
    });
  });
});
