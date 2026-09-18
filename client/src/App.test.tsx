import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sampleCompany } from "./domain/fixtures/sampleCompany";
import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the Clients page with chart and table after load", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sampleCompany,
      }),
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(
      screen.getByText("Book of business · Feb 2024–Jan 2025"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Acquisition over time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Detail by month" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Acquisition over time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Detail by month" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("figure", {
          name: /Client acquisition by channel/,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("Branch 1")).toBeInTheDocument();
      expect(screen.getByText(/^Updated /)).toBeInTheDocument();
    });
  });
});
