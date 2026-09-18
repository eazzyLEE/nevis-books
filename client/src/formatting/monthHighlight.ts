import { MONTH_LABELS, type MonthLabel } from "@nevis-books/shared";

/** Soft dim for non-highlighted chart stacks during month sync. */
export const DIMMED_BAR_OPACITY = 0.55;

export type MonthHighlightHandler = (month: MonthLabel | null) => void;

export function monthFromLabel(label: unknown): MonthLabel | null {
  return (MONTH_LABELS as readonly string[]).includes(String(label))
    ? (label as MonthLabel)
    : null;
}

export function barFillOpacity(
  month: MonthLabel,
  highlightedMonth: MonthLabel | null,
): number {
  return highlightedMonth != null && highlightedMonth !== month
    ? DIMMED_BAR_OPACITY
    : 1;
}
