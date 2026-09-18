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

/** Ids of every node nested under `nodeId` (not including `nodeId` itself). */
export function collectDescendantIds(
  company: Company,
  nodeId: string,
): string[] {
  if (company.id === nodeId) {
    const ids: string[] = [];

    for (const branch of company.branches) {
      ids.push(branch.id);

      for (const employee of branch.employees ?? []) {
        ids.push(employee.id);

        for (const channel of employee.channels ?? []) {
          ids.push(channel.id);
        }
      }
    }

    return ids;
  }

  for (const branch of company.branches) {
    if (branch.id === nodeId) {
      const ids: string[] = [];

      for (const employee of branch.employees ?? []) {
        ids.push(employee.id);

        for (const channel of employee.channels ?? []) {
          ids.push(channel.id);
        }
      }

      return ids;
    }

    for (const employee of branch.employees ?? []) {
      if (employee.id === nodeId) {
        return (employee.channels ?? []).map((channel) => channel.id);
      }
    }
  }

  return [];
}

/**
 * Expand adds `rowId`; collapse removes it and every descendant so
 * re-expanding shows children collapsed again.
 */
export function toggleExpandedIds(
  company: Company,
  current: ReadonlySet<string>,
  rowId: string,
): Set<string> {
  const next = new Set(current);

  if (next.has(rowId)) {
    next.delete(rowId);

    for (const descendantId of collectDescendantIds(company, rowId)) {
      next.delete(descendantId);
    }
  } else {
    next.add(rowId);
  }

  return next;
}

/** Flatten the company tree to rows visible under `expandedIds`. */
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
