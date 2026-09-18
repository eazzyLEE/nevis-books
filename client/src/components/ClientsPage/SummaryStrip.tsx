import type { ClientSummary } from "../../domain/clientSummary";
import styles from "./SummaryStrip.module.css";

export interface SummaryStripProps {
  summary: ClientSummary;
}

const numberFormatter = new Intl.NumberFormat(undefined);

function formatSigned(value: number): string {
  const absolute = numberFormatter.format(Math.abs(value));
  if (value > 0) {
    return `+${absolute}`;
  }
  if (value < 0) {
    return `−${absolute}`;
  }
  return absolute;
}

export function SummaryStrip({ summary }: SummaryStripProps) {
  return (
    <ul className={styles.strip} aria-label="Book of business summary">
      <li className={styles.item}>
        <span className={styles.label}>Clients · {summary.latestMonth}</span>
        <span className={styles.value}>
          {numberFormatter.format(summary.latestClients)}
        </span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>
          Change · {summary.periodStart}–{summary.periodEnd}
        </span>
        <span
          className={styles.value}
          data-tone={
            summary.periodChange > 0
              ? "up"
              : summary.periodChange < 0
                ? "down"
                : "flat"
          }
        >
          {formatSigned(summary.periodChange)}
        </span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>Coverage</span>
        <span className={styles.value}>
          {numberFormatter.format(summary.branchCount)} branches ·{" "}
          {numberFormatter.format(summary.advisorCount)} advisors
        </span>
      </li>
    </ul>
  );
}
