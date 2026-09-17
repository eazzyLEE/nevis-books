import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the Clients page shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(screen.getByLabelText("Client acquisition over time")).toBeInTheDocument();
    expect(screen.getByLabelText("Client detail by month")).toBeInTheDocument();
  });
});
