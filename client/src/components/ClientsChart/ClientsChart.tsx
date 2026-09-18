import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useId } from "react";
import type { ChartSeries } from "../../domain/chartSeries";
import { fillForSeriesIndex, toRechartsRows } from "./chartPresentation";
import { resolveChartTheme } from "./chartTheme";
import { formatMonthTick } from "../../formatting/formatMonthTick";
import styles from "./ClientsChart.module.css";

export interface ClientsChartProps {
  series: ChartSeries;
}

export function ClientsChart({ series }: ClientsChartProps) {
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
    <figure className={styles.chart} aria-labelledby={captionId}>
      <figcaption id={captionId} className="visuallyHidden">
        Client acquisition by channel, stacked bar chart from{" "}
        {series.points[0]!.month} to{" "}
        {series.points[series.points.length - 1]!.month}. Series:{" "}
        {series.seriesKeys.join(", ")}.
      </figcaption>

      <div className="visuallyHidden">
        <table>
          <caption>Monthly acquisition values by channel</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              {series.seriesKeys.map((seriesKey) => (
                <th key={seriesKey} scope="col">
                  {seriesKey}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.points.map((point) => (
              <tr key={point.month}>
                <th scope="row">{point.month}</th>
                {series.seriesKeys.map((seriesKey) => (
                  <td key={seriesKey}>
                    {point.valuesBySeriesKey[seriesKey] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.plot} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            tabIndex={-1}
            style={{ outline: "none" }}
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
              iconType="circle"
              wrapperStyle={{ paddingTop: 12 }}
              formatter={(value) => (
                <span className={styles.legendLabel}>{value}</span>
              )}
            />
            {series.seriesKeys.map((seriesKey, seriesIndex) => (
              <Bar
                key={seriesKey}
                dataKey={seriesKey}
                stackId="acquisition"
                fill={fillForSeriesIndex(seriesIndex, theme)}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
