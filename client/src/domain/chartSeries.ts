import {
  MONTH_LABELS,
  type AcquisitionChannel,
  type Company,
  type MonthLabel,
} from "@nevis-books/shared";

export interface ChartMonthPoint {
  month: MonthLabel;
  valuesBySeriesKey: Readonly<Record<string, number>>;
}

export interface ChartSeries {
  points: ChartMonthPoint[];
  /** First-seen channel names; chart fills follow this index order. */
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

/**
 * Stacked chart series by summing channels with the same name.
 * Empty when the tree has no channel nodes.
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
      monthTotals = Array.from({ length: MONTH_LABELS.length }, () => 0);
      totalsBySeriesName.set(channel.name, monthTotals);
    }

    for (let monthIndex = 0; monthIndex < MONTH_LABELS.length; monthIndex += 1) {
      monthTotals[monthIndex]! += channel.values[monthIndex]!;
    }
  }

  const points = MONTH_LABELS.map((month, monthIndex) => {
    const valuesBySeriesKey: Record<string, number> = {};

    for (const seriesKey of seriesKeys) {
      valuesBySeriesKey[seriesKey] =
        totalsBySeriesName.get(seriesKey)![monthIndex]!;
    }

    return { month, valuesBySeriesKey };
  });

  return { points, seriesKeys };
}
