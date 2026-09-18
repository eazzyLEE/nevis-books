import type { ChartSeries } from "../../domain/chartSeries";
import type { MonthLabel } from "@nevis-books/shared";
import type { ChartTheme } from "./chartTheme";
import { resolveChartTheme } from "./chartTheme";

export type RechartsRow = { month: MonthLabel } & Record<string, string | number>;

export function fillForSeriesIndex(
  seriesIndex: number,
  theme: ChartTheme = resolveChartTheme(),
): string {
  const palette = theme.seriesPalette;
  return palette[seriesIndex % palette.length]!;
}

export function toRechartsRows(series: ChartSeries): RechartsRow[] {
  return series.points.map((point) => ({
    month: point.month,
    ...point.valuesBySeriesKey,
  }));
}
