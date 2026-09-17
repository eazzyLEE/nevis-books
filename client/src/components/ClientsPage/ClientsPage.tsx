import { lazy, Suspense } from "react";
import { buildChartSeries } from "../../domain/chartSeries";
import { useClients } from "../../hooks/useClients";
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

export function ClientsPage() {
  const clients = useClients();

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

      <section className={styles.panel} aria-label="Client detail by month">
        <div className={styles.placeholder}>Table</div>
      </section>
    </main>
  );
}
