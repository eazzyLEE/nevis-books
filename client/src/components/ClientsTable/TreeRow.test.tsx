import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import type { TableRow } from "../../domain/tableRows";
import { initialsFromName } from "./initialsFromName";
import { TreeRow } from "./TreeRow";

const companyRow: TableRow = {
  id: "company-1",
  name: "Company",
  depth: 0,
  values: [250, 267, 284, 301, 317, 334, 350, 250, 250, 250, 250, 350],
  hasChildren: true,
  kind: "company",
};

const employeeRow: TableRow = {
  id: "employee-1",
  name: "Anna Blackwood",
  depth: 2,
  values: [25, 26, 28, 31, 32, 34, 38, 27, 27, 27, 27, 38],
  hasChildren: true,
  kind: "employee",
};

const leafBranchRow: TableRow = {
  id: "branch-2",
  name: "Branch 2",
  depth: 1,
  values: [76, 80, 84, 87, 90, 92, 94, 75, 75, 75, 75, 91],
  hasChildren: false,
  kind: "branch",
};

function renderInTable(ui: ReactElement) {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
  );
}

describe("initialsFromName", () => {
  it("builds initials from first and last name parts", () => {
    expect(initialsFromName("Anna Blackwood")).toBe("AB");
    expect(initialsFromName("Madonna")).toBe("M");
  });
});

describe("TreeRow", () => {
  it("renders the name, monthly values, and expand control when expandable", async () => {
    const user = userEvent.setup();
    const onToggleExpand = vi.fn();

    renderInTable(
      <TreeRow
        row={companyRow}
        expanded={false}
        onToggleExpand={onToggleExpand}
      />,
    );

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getAllByRole("cell")).toHaveLength(12);
    expect(screen.getAllByRole("cell")[0]).toHaveTextContent("250");
    expect(screen.getAllByRole("cell")[11]).toHaveTextContent("350");

    await user.click(screen.getByRole("button", { name: "Expand Company" }));
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it("shows an initials avatar for employee rows", () => {
    renderInTable(
      <TreeRow
        row={employeeRow}
        expanded={false}
        onToggleExpand={() => undefined}
      />,
    );

    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(screen.getByText("Anna Blackwood")).toBeInTheDocument();
  });

  it("omits the expand control for leaf rows", () => {
    renderInTable(
      <TreeRow row={leafBranchRow} expanded={false} />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Branch 2")).toBeInTheDocument();
  });

  it("exposes hierarchy depth on the row and expand state on the control", () => {
    renderInTable(
      <TreeRow
        row={employeeRow}
        expanded
        onToggleExpand={() => undefined}
      />,
    );

    const row = screen.getByText("Anna Blackwood").closest("tr");
    expect(row).toHaveAttribute("aria-level", "3");
    expect(row).not.toHaveAttribute("aria-expanded");
    expect(
      screen.getByRole("button", { name: "Collapse Anna Blackwood" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
