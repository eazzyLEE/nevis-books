import type { ReactNode } from "react";
import styles from "./ClientsPage.module.css";

export function DashboardPanel({
  titleId,
  title,
  description,
  busy = false,
  table = false,
  children,
}: {
  titleId: string;
  title: string;
  description: string;
  busy?: boolean;
  table?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={table ? `${styles.panel} ${styles.tablePanel}` : styles.panel}
      aria-labelledby={titleId}
      aria-busy={busy}
    >
      <div className={styles.panelHeader}>
        <h2 id={titleId} className={styles.panelTitle}>
          {title}
        </h2>
        <p className={styles.panelDescription}>{description}</p>
      </div>
      {children}
    </section>
  );
}
