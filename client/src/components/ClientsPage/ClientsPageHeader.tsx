import { MONTH_LABELS } from "@nevis-books/shared";
import styles from "./ClientsPageHeader.module.css";

const PERIOD_START = MONTH_LABELS[0];
const PERIOD_END = MONTH_LABELS[MONTH_LABELS.length - 1];

const updatedAtFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function ClientsPageHeader({ loadedAt }: { loadedAt: Date | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <img
          className={styles.mark}
          src="/favicon.svg"
          alt=""
          width={28}
          height={28}
          decoding="async"
        />
        <h1 className={styles.title}>Clients</h1>
      </div>
      <p className={styles.subtitle}>
        Book of business · {PERIOD_START}–{PERIOD_END}
      </p>
      {loadedAt ? (
        <p className={styles.meta}>
          Updated {updatedAtFormatter.format(loadedAt)}
        </p>
      ) : null}
    </header>
  );
}
