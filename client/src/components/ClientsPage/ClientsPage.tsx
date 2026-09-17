import { lazy, Suspense, useEffect, useState } from "react";
import { buildChartSeries } from "../../domain/chartSeries";
import { buildVisibleRows } from "../../domain/tableRows";
import { useClients } from "../../hooks/useClients";
import { ClientsTable } from "../ClientsTable";
import styles from "./ClientsPage.module.css";

const ClientsChart = lazy(async () => {
  const module = await import("../ClientsChart");
  return { default: module.ClientsChart };
});

function ChartLoadingState() {
  return (
    <p className={styles.placeholder} role="status">
      Loading chart…
    </p>
  );
}

function toggleExpandedId(
  current: ReadonlySet<string>,
  rowId: string,
): Set<string> {
  const next = new Set(current);

  if (next.has(rowId)) {
    next.delete(rowId);
  } else {
    next.add(rowId);
  }

  return next;
}

export function ClientsPage() {
  const clients = useClients();
  const companyId = clients.status === "success" ? clients.data.id : null;
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string> | null>(
    null,
  );

  useEffect(() => {
    setExpandedIds(null);
  }, [companyId]);

  const activeExpandedIds =
    expandedIds ?? (companyId ? new Set([companyId]) : new Set());

  const visibleRows =
    clients.status === "success"
      ? buildVisibleRows(clients.data, activeExpandedIds)
      : [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.diamond} aria-hidden="true" />
        <h1 className={styles.title}>Clients</h1>
      </header>

      <section className={styles.panel} aria-label="Client acquisition over time">
        {clients.status === "loading" || clients.status === "idle" ? (
          <ChartLoadingState />
        ) : null}

        {clients.status === "error" ? (
          <div className={styles.placeholder} role="alert">
            <p>{clients.error.message}</p>
            <button type="button" onClick={clients.retry}>
              Retry
            </button>
          </div>
        ) : null}

        {clients.status === "success" ? (
          <Suspense fallback={<ChartLoadingState />}>
            <ClientsChart series={buildChartSeries(clients.data)} />
          </Suspense>
        ) : null}
      </section>

      <section
        className={`${styles.panel} ${styles.tablePanel}`}
        aria-label="Client detail by month"
      >
        {clients.status === "loading" || clients.status === "idle" ? (
          <p className={styles.placeholder} role="status">
            Loading table…
          </p>
        ) : null}

        {clients.status === "error" ? (
          <div className={styles.placeholder} role="alert">
            <p>{clients.error.message}</p>
            <button type="button" onClick={clients.retry}>
              Retry
            </button>
          </div>
        ) : null}

        {clients.status === "success" ? (
          <ClientsTable
            rows={visibleRows}
            expandedIds={activeExpandedIds}
            onToggleExpand={(rowId) => {
              setExpandedIds((current) =>
                toggleExpandedId(
                  current ?? (companyId ? new Set([companyId]) : new Set()),
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
