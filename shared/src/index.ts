/**
 * Shared domain types for the clients book-of-business tree.
 * Matches the take-home payload shape exactly.
 */

export type MonthlyValues = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface AcquisitionChannel {
  id: string;
  name: string;
  values: MonthlyValues;
}

export interface Employee {
  id: string;
  name: string;
  values: MonthlyValues;
  channels?: AcquisitionChannel[];
}

export interface Branch {
  id: string;
  name: string;
  values: MonthlyValues;
  employees?: Employee[];
}

export interface Company {
  id: string;
  name: string;
  values: MonthlyValues;
  branches: Branch[];
}

/** Month labels for Feb 2024 – Jan 2025, matching the design. */
export const MONTH_LABELS = [
  "Feb 2024",
  "Mar 2024",
  "Apr 2024",
  "May 2024",
  "Jun 2024",
  "Jul 2024",
  "Aug 2024",
  "Sep 2024",
  "Oct 2024",
  "Nov 2024",
  "Dec 2024",
  "Jan 2025",
] as const;

export type MonthLabel = (typeof MONTH_LABELS)[number];
