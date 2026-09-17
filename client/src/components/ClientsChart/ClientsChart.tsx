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
import type { ChartSeries } from "../../domain/chartSeries";
import {
  fillForSeriesIndex,
  toRechartsRows,
} from "./chartPresentation";
import { resolveChartTheme } from "./chartTheme";
import { formatMonthTick } from "../../formatting/formatMonthTick";
import styles from "./ClientsChart.module.css";

export interface ClientsChartProps {
  series: ChartSeries;
}

export function ClientsChart({ series }: ClientsChartProps) {
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
    <div className={styles.chart} data-testid="clients-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            labelFormatter={(label) =>
              typeof label === "string" ? label : String(label)
            }
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
  );
}
