import { MONTH_LABELS } from "@nevis-books/shared";
import type { TableRow } from "../../domain/tableRows";
import { formatMonthTick } from "../../formatting/formatMonthTick";
import { TreeRow } from "./TreeRow";
import styles from "./ClientsTable.module.css";

export interface ClientsTableProps {
  rows: readonly TableRow[];
  expandedIds: ReadonlySet<string>;
  onToggleExpand: (rowId: string) => void;
}

export function ClientsTable({
  rows,
  expandedIds,
  onToggleExpand,
}: ClientsTableProps) {
  if (rows.length === 0) {
    return (
      <p className={styles.empty} role="status">
        No client rows to display.
      </p>
    );
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <caption className="visuallyHidden">
          Client hierarchy with monthly acquisition values
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.cornerHeader}>
              <span className="visuallyHidden">Name</span>
            </th>
            {MONTH_LABELS.map((month) => (
              <th
                key={month}
                scope="col"
                className={styles.monthHeader}
                aria-label={month}
              >
                <span className={styles.monthFull} aria-hidden="true">
                  {month}
                </span>
                <span className={styles.monthShort} aria-hidden="true">
                  {formatMonthTick(month)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TreeRow
              key={row.id}
              row={row}
              expanded={expandedIds.has(row.id)}
              onToggleExpand={() => {
                onToggleExpand(row.id);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
