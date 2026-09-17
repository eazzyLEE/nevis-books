import styles from "./ClientsPage.module.css";

export function ClientsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.diamond} aria-hidden="true" />
        <h1 className={styles.title}>Clients</h1>
      </header>

      <section className={styles.panel} aria-label="Client acquisition over time">
        <div className={styles.placeholder}>Chart</div>
      </section>

      <section className={styles.panel} aria-label="Client detail by month">
        <div className={styles.placeholder}>Table</div>
      </section>
    </main>
  );
}
