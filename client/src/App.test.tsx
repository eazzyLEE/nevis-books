import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sampleCompany } from "./domain/fixtures/sampleCompany";
import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a single page-level error with retry when the API fails", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => sampleCompany,
      });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Couldn’t load clients");
    expect(screen.getByText(/Failed to load clients \(500\)/)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Acquisition over time" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(screen.getByText("Company")).toBeInTheDocument();
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
      expect(
        screen.getByRole("list", { name: "Book of business summary" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Clients · Jan 2025")).toBeInTheDocument();
      expect(screen.getByText("+100")).toBeInTheDocument();
      expect(screen.getByText(/3 branches · 5 advisors/)).toBeInTheDocument();
    });
  });
});
