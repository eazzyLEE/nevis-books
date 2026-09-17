import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { TableRow } from "../../domain/tableRows";
import { ClientsTable } from "./ClientsTable";

const rows: TableRow[] = [
  {
    id: "company-1",
    name: "Company",
    depth: 0,
    values: [250, 267, 284, 301, 317, 334, 350, 250, 250, 250, 250, 350],
    hasChildren: true,
    kind: "company",
  },
  {
    id: "branch-1",
    name: "Branch 1",
    depth: 1,
    values: [147, 157, 166, 156, 188, 201, 214, 147, 147, 147, 147, 214],
    hasChildren: false,
    kind: "branch",
  },
];

describe("ClientsTable", () => {
  it("renders month headers and visible rows", () => {
    render(
      <ClientsTable
        rows={rows}
        expandedIds={new Set(["company-1"])}
        onToggleExpand={() => undefined}
      />,
    );

    expect(screen.getByRole("columnheader", { name: "Feb 2024" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Jan 2025" })).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Branch 1")).toBeInTheDocument();
  });

  it("notifies when an expandable row is toggled", async () => {
    const user = userEvent.setup();
    const onToggleExpand = vi.fn();

    render(
      <ClientsTable
        rows={rows}
        expandedIds={new Set(["company-1"])}
        onToggleExpand={onToggleExpand}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Collapse Company" }));
    expect(onToggleExpand).toHaveBeenCalledWith("company-1");
  });

  it("shows an empty state when there are no rows", () => {
    render(
      <ClientsTable
        rows={[]}
        expandedIds={new Set()}
        onToggleExpand={() => undefined}
      />,
    );

    expect(screen.getByText("No client rows to display.")).toBeInTheDocument();
  });
});
