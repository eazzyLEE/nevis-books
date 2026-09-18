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
