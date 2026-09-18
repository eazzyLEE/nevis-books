import type { ChartSeries } from "../../domain/chartSeries";

/** Visually hidden month × series table for assistive tech. */
export function ChartDataTable({ series }: { series: ChartSeries }) {
  return (
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
  );
}
