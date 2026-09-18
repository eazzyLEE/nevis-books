import { useId } from "react";
import { useClientsDashboard } from "../../hooks/useClientsDashboard";
import { ClientsChart } from "../ClientsChart";
import { ClientsTable } from "../ClientsTable";
import { ClientsPageHeader } from "./ClientsPageHeader";
import { DashboardPanel } from "./DashboardPanel";
import { ChartSkeleton, TableSkeleton } from "./PanelSkeletons";
import { ClientsLoadError } from "./StatusMessage";
import { SummaryStrip } from "./SummaryStrip";
import styles from "./ClientsPage.module.css";

export function ClientsPage() {
  const chartHeadingId = useId();
  const tableHeadingId = useId();
  const dashboard = useClientsDashboard();
  const isLoading = dashboard.status === "loading";

  return (
    <main className={styles.page}>
      <ClientsPageHeader loadedAt={dashboard.loadedAt} />

      {dashboard.status === "error" ? (
        <ClientsLoadError
          detail={dashboard.errorMessage}
          onRetry={dashboard.retry}
        />
      ) : null}

      {dashboard.status === "success" ? (
        <SummaryStrip summary={dashboard.summary} />
      ) : null}

      {dashboard.status !== "error" ? (
        <DashboardPanel
          titleId={chartHeadingId}
          title="Acquisition over time"
          description="Stacked clients by acquisition channel"
          busy={isLoading}
        >
          {isLoading ? <ChartSkeleton /> : null}
          {dashboard.status === "success" ? (
            <ClientsChart
              series={dashboard.chartSeries}
              highlightedMonth={dashboard.highlightedMonth}
              onHighlightMonth={dashboard.onHighlightMonth}
            />
          ) : null}
        </DashboardPanel>
      ) : null}

      {dashboard.status !== "error" ? (
        <DashboardPanel
          titleId={tableHeadingId}
          title="Detail by month"
          description="Expand the hierarchy to inspect branches, employees, and channels"
          busy={isLoading}
          table
        >
          {isLoading ? <TableSkeleton /> : null}
          {dashboard.status === "success" ? (
            <ClientsTable
              rows={dashboard.tableRows}
              expandedIds={dashboard.expandedIds}
              highlightedMonth={dashboard.highlightedMonth}
              onHighlightMonth={dashboard.onHighlightMonth}
              onToggleExpand={dashboard.onToggleExpand}
            />
          ) : null}
        </DashboardPanel>
      ) : null}
    </main>
  );
}
