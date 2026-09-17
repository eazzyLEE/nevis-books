import type { ChartSeries } from "../../domain/chartSeries";
import { resolveChartTheme, type ChartTheme } from "./chartTheme";

/**
 * Picks a stack fill by series index so new channel names get a color
 * without hard-coding labels.
 */
export function fillForSeriesIndex(
  seriesIndex: number,
  theme: ChartTheme = resolveChartTheme(),
): string {
  const palette = theme.seriesPalette;

  return palette[seriesIndex % palette.length] ?? palette[0]!;
}

/** Flattens domain chart points into Recharts row objects. */
export function toRechartsRows(
  series: ChartSeries,
): Array<Record<string, string | number>> {
  return series.points.map((point) => ({
    month: point.month,
    ...point.valuesBySeriesKey,
  }));
}
