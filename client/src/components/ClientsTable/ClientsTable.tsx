import { MONTH_LABELS, type MonthLabel } from "@nevis-books/shared";
import type { MonthHighlightHandler } from "../../formatting/monthHighlight";
import type { TableRow } from "../../domain/tableRows";
import { formatMonthTick } from "../../formatting/formatMonthTick";
import { TreeRow } from "./TreeRow";
import styles from "./ClientsTable.module.css";

export interface ClientsTableProps {
  rows: readonly TableRow[];
  expandedIds: ReadonlySet<string>;
  onToggleExpand: (rowId: string) => void;
  highlightedMonth?: MonthLabel | null;
  onHighlightMonth?: MonthHighlightHandler;
}

export function ClientsTable({
  rows,
  expandedIds,
  onToggleExpand,
  highlightedMonth = null,
  onHighlightMonth,
}: ClientsTableProps) {
  if (rows.length === 0) {
    return (
      <p className={styles.empty} role="status">
        No client rows to display.
      </p>
    );
  }

  const clearHighlight = () => {
    onHighlightMonth?.(null);
  };

  return (
    <div
      className={styles.scroll}
      onMouseLeave={clearHighlight}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          clearHighlight();
        }
      }}
    >
      <table className={styles.table}>
        <caption className="visuallyHidden">
          Client hierarchy with monthly acquisition values
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.cornerHeader}>
              <span className="visuallyHidden">Name</span>
            </th>
            {MONTH_LABELS.map((month) => {
              const isActive = highlightedMonth === month;

              return (
                <th
                  key={month}
                  scope="col"
                  className={styles.monthHeader}
                  aria-label={month}
                  tabIndex={0}
                  data-month-active={isActive ? "true" : undefined}
                  onMouseEnter={() => {
                    onHighlightMonth?.(month);
                  }}
                  onFocus={() => {
                    onHighlightMonth?.(month);
                  }}
                >
                  <span className={styles.monthFull} aria-hidden="true">
                    {month}
                  </span>
                  <span className={styles.monthShort} aria-hidden="true">
                    {formatMonthTick(month)}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TreeRow
              key={row.id}
              row={row}
              expanded={expandedIds.has(row.id)}
              highlightedMonth={highlightedMonth}
              {...(onHighlightMonth ? { onHighlightMonth } : {})}
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
