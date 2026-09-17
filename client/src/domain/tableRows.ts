import type { Company, MonthlyValues } from "@nevis-books/shared";

export type TableRowKind = "company" | "branch" | "employee" | "channel";

/**
 * One visible table row after applying expand state.
 * Indent with `depth`; derive open/closed via `expandedIds.has(id)` —
 * expansion is not stored on the row.
 */
export interface TableRow {
  id: string;
  name: string;
  /** Nesting level for indentation (0 = company). */
  depth: number;
  values: MonthlyValues;
  hasChildren: boolean;
  kind: TableRowKind;
}

function hasItems<T>(items: readonly T[] | undefined): items is readonly T[] {
  return Array.isArray(items) && items.length > 0;
}

/**
 * Flattens the company tree into the rows currently visible in the table.
 * Children appear only when their parent id is present in `expandedIds`.
 * Expanded ids for nodes that are not currently reachable (e.g. a branch id
 * without the company expanded) are ignored.
 * Nodes without children get `hasChildren: false` (no expand control in the UI).
 */
export function buildVisibleRows(
  company: Company,
  expandedIds: ReadonlySet<string>,
): TableRow[] {
  const rows: TableRow[] = [
    {
      id: company.id,
      name: company.name,
      depth: 0,
      values: company.values,
      hasChildren: company.branches.length > 0,
      kind: "company",
    },
  ];

  if (!expandedIds.has(company.id) || company.branches.length === 0) {
    return rows;
  }

  for (const branch of company.branches) {
    const employees = branch.employees;
    const branchHasEmployees = hasItems(employees);

    rows.push({
      id: branch.id,
      name: branch.name,
      depth: 1,
      values: branch.values,
      hasChildren: branchHasEmployees,
      kind: "branch",
    });

    if (!expandedIds.has(branch.id) || !branchHasEmployees) {
      continue;
    }

    for (const employee of employees) {
      const channels = employee.channels;
      const employeeHasChannels = hasItems(channels);

      rows.push({
        id: employee.id,
        name: employee.name,
        depth: 2,
        values: employee.values,
        hasChildren: employeeHasChannels,
        kind: "employee",
      });

      if (!expandedIds.has(employee.id) || !employeeHasChannels) {
        continue;
      }

      for (const channel of channels) {
        rows.push({
          id: channel.id,
          name: channel.name,
          depth: 3,
          values: channel.values,
          hasChildren: false,
          kind: "channel",
        });
      }
    }
  }

  return rows;
}
