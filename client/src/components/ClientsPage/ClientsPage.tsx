import { useEffect, useId, useState, type ReactNode } from "react";
import { MONTH_LABELS } from "@nevis-books/shared";
import { buildChartSeries } from "../../domain/chartSeries";
import { buildClientSummary } from "../../domain/clientSummary";
import {
  buildVisibleRows,
  toggleExpandedIds,
} from "../../domain/tableRows";
import { useClients } from "../../hooks/useClients";
import { ClientsChart } from "../ClientsChart";
import { ClientsTable } from "../ClientsTable";
import styles from "./ClientsPage.module.css";
import { SummaryStrip } from "./SummaryStrip";

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

function StatusMessage({
  children,
  role = "status",
}: {
  children: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <div className={styles.placeholder} role={role}>
      {children}
    </div>
  );
}

export function ClientsPage() {
  const chartHeadingId = useId();
  const tableHeadingId = useId();
  const clients = useClients();
  const companyId = clients.status === "success" ? clients.data.id : null;
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string> | null>(
    null,
  );
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  useEffect(() => {
    setExpandedIds(null);
  }, [companyId]);

  useEffect(() => {
    if (clients.status === "success") {
      setLoadedAt(new Date());
    }
  }, [clients.status, companyId]);

  const activeExpandedIds =
    expandedIds ?? (companyId ? new Set([companyId]) : new Set());

  const visibleRows =
    clients.status === "success"
      ? buildVisibleRows(clients.data, activeExpandedIds)
      : [];

  const isLoading = clients.status === "loading";

  const errorBlock =
    clients.status === "error" ? (
      <StatusMessage role="alert">
        <p>{clients.error.message}</p>
        <button type="button" onClick={clients.retry}>
          Retry
        </button>
      </StatusMessage>
    ) : null;

  return (
    <main className={styles.page}>
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

      {clients.status === "success" ? (
        <SummaryStrip summary={buildClientSummary(clients.data)} />
      ) : null}

      <section
        className={styles.panel}
        aria-labelledby={chartHeadingId}
        aria-busy={isLoading}
      >
        <div className={styles.panelHeader}>
          <h2 id={chartHeadingId} className={styles.panelTitle}>
            Acquisition over time
          </h2>
          <p className={styles.panelDescription}>
            Stacked clients by acquisition channel
          </p>
        </div>
        {isLoading ? (
          <StatusMessage>Loading chart…</StatusMessage>
        ) : null}
        {errorBlock}
        {clients.status === "success" ? (
          <ClientsChart series={buildChartSeries(clients.data)} />
        ) : null}
      </section>

      <section
        className={`${styles.panel} ${styles.tablePanel}`}
        aria-labelledby={tableHeadingId}
        aria-busy={isLoading}
      >
        <div className={styles.panelHeader}>
          <h2 id={tableHeadingId} className={styles.panelTitle}>
            Detail by month
          </h2>
          <p className={styles.panelDescription}>
            Expand the hierarchy to inspect branches, employees, and channels
          </p>
        </div>
        {isLoading ? (
          <StatusMessage>Loading table…</StatusMessage>
        ) : null}
        {errorBlock}
        {clients.status === "success" ? (
          <ClientsTable
            rows={visibleRows}
            expandedIds={activeExpandedIds}
            onToggleExpand={(rowId) => {
              const company = clients.data;
              setExpandedIds((current) =>
                toggleExpandedIds(
                  company,
                  current ?? new Set([company.id]),
                  rowId,
                ),
              );
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
