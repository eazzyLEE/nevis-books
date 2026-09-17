import {
  MONTH_LABELS,
  type AcquisitionChannel,
  type Company,
  type MonthLabel,
} from "@nevis-books/shared";

export interface ChartMonthPoint {
  month: MonthLabel;
  /** Totals for each series key in this month. */
  valuesBySeriesKey: Readonly<Record<string, number>>;
}

export interface ChartSeries {
  points: ChartMonthPoint[];
  /** Stack order: first-seen channel names (drives chart fill index). */
  seriesKeys: readonly string[];
}

function listAcquisitionChannels(company: Company): AcquisitionChannel[] {
  const channels: AcquisitionChannel[] = [];

  for (const branch of company.branches) {
    for (const employee of branch.employees ?? []) {
      for (const channel of employee.channels ?? []) {
        channels.push(channel);
      }
    }
  }

  return channels;
}

function createEmptyMonthTotals(): number[] {
  return Array.from({ length: MONTH_LABELS.length }, () => 0);
}

/**
 * Builds stacked chart series by summing acquisition channels with the same
 * name across the company tree.
 *
 * Only channel nodes carry acquisition breakdowns. If the tree has no
 * channels, returns an empty series.
 *
 * `seriesKeys` order is first-seen while walking the tree. Chart fills are
 * assigned by that index, so reordering discovery can change colors for a
 * given channel name.
 */
export function buildChartSeries(company: Company): ChartSeries {
  const channels = listAcquisitionChannels(company);

  if (channels.length === 0) {
    return { points: [], seriesKeys: [] };
  }

  const seriesKeys: string[] = [];
  const totalsBySeriesName = new Map<string, number[]>();

  for (const channel of channels) {
    let monthTotals = totalsBySeriesName.get(channel.name);

    if (!monthTotals) {
      seriesKeys.push(channel.name);
      monthTotals = createEmptyMonthTotals();
      totalsBySeriesName.set(channel.name, monthTotals);
    }

    for (let monthIndex = 0; monthIndex < MONTH_LABELS.length; monthIndex += 1) {
      monthTotals[monthIndex] =
        (monthTotals[monthIndex] ?? 0) + (channel.values[monthIndex] ?? 0);
    }
  }

  const points = MONTH_LABELS.map((month, monthIndex) => {
    const valuesBySeriesKey: Record<string, number> = {};

    for (const seriesKey of seriesKeys) {
      const monthTotals = totalsBySeriesName.get(seriesKey);
      valuesBySeriesKey[seriesKey] = monthTotals?.[monthIndex] ?? 0;
    }

    return { month, valuesBySeriesKey };
  });

  return { points, seriesKeys };
}
