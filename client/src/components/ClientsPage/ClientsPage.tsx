import { useEffect, useState, type ReactNode } from "react";
import { buildChartSeries } from "../../domain/chartSeries";
import { buildVisibleRows } from "../../domain/tableRows";
import { useClients } from "../../hooks/useClients";
import { ClientsChart } from "../ClientsChart";
import { ClientsTable } from "../ClientsTable";
import styles from "./ClientsPage.module.css";

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
        <span className={styles.diamond} aria-hidden="true" />
        <h1 className={styles.title}>Clients</h1>
      </header>

      <section
        className={styles.panel}
        aria-label="Client acquisition over time"
        aria-busy={isLoading}
      >
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
        aria-label="Client detail by month"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <StatusMessage>Loading table…</StatusMessage>
        ) : null}
        {errorBlock}
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
