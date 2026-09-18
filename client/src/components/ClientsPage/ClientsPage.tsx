import { useEffect, useId, useState } from "react";
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
import { ClientsPageHeader } from "./ClientsPageHeader";
import { ChartSkeleton, TableSkeleton } from "./PanelSkeletons";
import { ClientsLoadError } from "./StatusMessage";
import { SummaryStrip } from "./SummaryStrip";

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
  const isError = clients.status === "error";

  return (
    <main className={styles.page}>
      <ClientsPageHeader loadedAt={loadedAt} />

      {isError ? (
        <ClientsLoadError
          detail={clients.error.message}
          onRetry={clients.retry}
        />
      ) : null}

      {!isError && clients.status === "success" ? (
        <SummaryStrip summary={buildClientSummary(clients.data)} />
      ) : null}

      {!isError ? (
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
          {isLoading ? <ChartSkeleton /> : null}
          {clients.status === "success" ? (
            <ClientsChart series={buildChartSeries(clients.data)} />
          ) : null}
        </section>
      ) : null}

      {!isError ? (
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
          {isLoading ? <TableSkeleton /> : null}
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
      ) : null}
    </main>
  );
}
