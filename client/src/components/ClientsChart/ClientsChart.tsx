import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useId } from "react";
import type { MonthLabel } from "@nevis-books/shared";
import type { ChartSeries } from "../../domain/chartSeries";
import {
  barFillOpacity,
  monthFromLabel,
  type MonthHighlightHandler,
} from "../../formatting/monthHighlight";
import { formatMonthTick } from "../../formatting/formatMonthTick";
import { ChartDataTable } from "./ChartDataTable";
import { ChartLegend } from "./ChartLegend";
import { fillForSeriesIndex, toRechartsRows } from "./chartPresentation";
import { resolveChartTheme } from "./chartTheme";
import styles from "./ClientsChart.module.css";

export interface ClientsChartProps {
  series: ChartSeries;
  highlightedMonth?: MonthLabel | null;
  onHighlightMonth?: MonthHighlightHandler;
}

export function ClientsChart({
  series,
  highlightedMonth = null,
  onHighlightMonth,
}: ClientsChartProps) {
  const captionId = useId();

  if (series.seriesKeys.length === 0 || series.points.length === 0) {
    return (
      <p className={styles.empty} role="status">
        No acquisition channel data to chart.
      </p>
    );
  }

  const theme = resolveChartTheme();
  const rows = toRechartsRows(series);

  return (
    <figure
      className={styles.chart}
      aria-labelledby={captionId}
      data-highlighted-month={highlightedMonth ?? undefined}
    >
      <figcaption id={captionId} className="visuallyHidden">
        Client acquisition by channel, stacked bar chart from{" "}
        {series.points[0]!.month} to{" "}
        {series.points[series.points.length - 1]!.month}. Series:{" "}
        {series.seriesKeys.join(", ")}.
      </figcaption>

      <ChartDataTable series={series} />

      <div className={styles.plot} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            tabIndex={-1}
            style={{ outline: "none" }}
            onMouseMove={(state) => {
              const month = monthFromLabel(state?.activeLabel);
              if (month) {
                onHighlightMonth?.(month);
              }
            }}
            onMouseLeave={() => {
              onHighlightMonth?.(null);
            }}
          >
            <CartesianGrid
              vertical={false}
              stroke={theme.grid}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: theme.tick, fontSize: 12 }}
              tickFormatter={formatMonthTick}
              tickLine={false}
              axisLine={{ stroke: theme.axis }}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              tick={{ fill: theme.tick, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: theme.cursor }}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.axis}`,
                fontSize: 12,
              }}
            />
            <Legend
              verticalAlign="bottom"
              content={({ payload }) =>
                payload ? <ChartLegend payload={payload} /> : null
              }
            />
            {series.seriesKeys.map((seriesKey, seriesIndex) => (
              <Bar
                key={seriesKey}
                dataKey={seriesKey}
                stackId="acquisition"
                fill={fillForSeriesIndex(seriesIndex, theme)}
                maxBarSize={48}
              >
                {rows.map((row) => (
                  <Cell
                    key={`${seriesKey}-${row.month}`}
                    fillOpacity={barFillOpacity(row.month, highlightedMonth)}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
