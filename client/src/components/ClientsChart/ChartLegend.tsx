import type { LegendPayload } from "recharts";
import styles from "./ChartLegend.module.css";

export function ChartLegend({
  payload,
}: {
  payload?: ReadonlyArray<LegendPayload>;
}) {
  if (!payload?.length) {
    return null;
  }

  return (
    <ul className={styles.legend}>
      {payload.map((entry) => (
        <li key={String(entry.value)} className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className={styles.legendLabel}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}
