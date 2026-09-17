import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Company } from "@nevis-books/shared";
import { useClients } from "./useClients";

const sampleCompany: Company = {
  id: "company-1",
  name: "Company",
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  branches: [],
};

describe("useClients", () => {
  it("moves from loading to success when the loader resolves", async () => {
    const loadClients = vi.fn().mockResolvedValue(sampleCompany);

    const { result } = renderHook(() => useClients(loadClients));

    expect(result.current.status).toBe("loading");

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toEqual(sampleCompany);
    expect(result.current.error).toBeNull();
    expect(loadClients).toHaveBeenCalledTimes(1);
  });

  it("moves to error when the loader rejects", async () => {
    const loadClients = vi.fn().mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useClients(loadClients));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error("network down"));
  });

  it("retry reloads after an error", async () => {
    const loadClients = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce(sampleCompany);

    const { result } = renderHook(() => useClients(loadClients));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    act(() => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toEqual(sampleCompany);
    expect(loadClients).toHaveBeenCalledTimes(2);
  });
});
