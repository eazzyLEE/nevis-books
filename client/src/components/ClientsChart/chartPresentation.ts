import type { ChartSeries } from "../../domain/chartSeries";
import type { ChartTheme } from "./chartTheme";
import { resolveChartTheme } from "./chartTheme";

export function fillForSeriesIndex(
  seriesIndex: number,
  theme: ChartTheme = resolveChartTheme(),
): string {
  const palette = theme.seriesPalette;
  return palette[seriesIndex % palette.length]!;
}

export function toRechartsRows(
  series: ChartSeries,
): Array<Record<string, string | number>> {
  return series.points.map((point) => ({
    month: point.month,
    ...point.valuesBySeriesKey,
  }));
}
