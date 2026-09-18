import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

export function StatusMessage({
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

export function ClientsLoadError({
  detail,
  onRetry,
}: {
  detail: string;
  onRetry: () => void;
}) {
  return (
    <StatusMessage role="alert">
      <p className={styles.title}>Couldn’t load clients</p>
      <p className={styles.detail}>{detail}</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Retry
      </button>
    </StatusMessage>
  );
}
