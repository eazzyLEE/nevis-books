import { MONTH_LABELS, type Company, type MonthLabel } from "@nevis-books/shared";

export interface ClientSummary {
  latestClients: number;
  latestMonth: MonthLabel;
  periodChange: number;
  periodStart: MonthLabel;
  periodEnd: MonthLabel;
  branchCount: number;
  advisorCount: number;
}

/**
 * Headline metrics from the company tree for the page summary strip.
 * Uses company-level monthly values (same basis as the table root row).
 */
export function buildClientSummary(company: Company): ClientSummary {
  const lastIndex = company.values.length - 1;
  const first = company.values[0] ?? 0;
  const latest = company.values[lastIndex] ?? 0;

  let advisorCount = 0;
  for (const branch of company.branches) {
    advisorCount += branch.employees?.length ?? 0;
  }

  return {
    latestClients: latest,
    latestMonth: MONTH_LABELS[lastIndex] ?? MONTH_LABELS[0]!,
    periodChange: latest - first,
    periodStart: MONTH_LABELS[0]!,
    periodEnd: MONTH_LABELS[lastIndex] ?? MONTH_LABELS[0]!,
    branchCount: company.branches.length,
    advisorCount,
  };
}
