import type { Company, MonthlyValues } from "@nevis-books/shared";

export type TableRowKind = "company" | "branch" | "employee" | "channel";

export interface TableRow {
  id: string;
  name: string;
  /** Nesting level for indentation (0 = company). */
  depth: number;
  values: MonthlyValues;
  hasChildren: boolean;
  kind: TableRowKind;
}

/**
 * Flatten the company tree to rows visible under `expandedIds`.
 * Expanded ids that aren't reachable (parent collapsed) are ignored.
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
    const branchHasEmployees = (employees?.length ?? 0) > 0;

    rows.push({
      id: branch.id,
      name: branch.name,
      depth: 1,
      values: branch.values,
      hasChildren: branchHasEmployees,
      kind: "branch",
    });

    if (!expandedIds.has(branch.id) || !employees || !branchHasEmployees) {
      continue;
    }

    for (const employee of employees) {
      const channels = employee.channels;
      const employeeHasChannels = (channels?.length ?? 0) > 0;

      rows.push({
        id: employee.id,
        name: employee.name,
        depth: 2,
        values: employee.values,
        hasChildren: employeeHasChannels,
        kind: "employee",
      });

      if (!expandedIds.has(employee.id) || !channels || !employeeHasChannels) {
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
