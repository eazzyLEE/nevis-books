import type { ChartSeries } from "../../domain/chartSeries";
import { resolveChartTheme, type ChartTheme } from "./chartTheme";

/**
 * Shortens month labels for narrow viewports ("Feb 2024" → "Feb '24").
 */
export function formatMonthTick(month: string): string {
  const match = /^([A-Za-z]+)\s+(\d{4})$/.exec(month);

  if (!match?.[1] || !match[2]) {
    return month;
  }

  return `${match[1]} '${match[2].slice(2)}`;
}

export function fillForSeriesKey(
  seriesKey: string,
  seriesIndex: number,
  theme: ChartTheme = resolveChartTheme(),
): string {
  const fillByName: Record<string, string> = {
    "Existing clients": theme.channelExisting,
    "New organic": theme.channelOrganic,
    "New paid": theme.channelPaid,
  };

  return (
    fillByName[seriesKey] ??
    theme.fallbackFills[seriesIndex % theme.fallbackFills.length] ??
    theme.fallbackFills[0]
  );
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
