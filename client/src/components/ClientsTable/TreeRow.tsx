import type { CSSProperties } from "react";
import { MONTH_LABELS, type MonthLabel } from "@nevis-books/shared";
import type { MonthHighlightHandler } from "../../formatting/monthHighlight";
import type { TableRow } from "../../domain/tableRows";
import { ExpandButton } from "./ExpandButton";
import { initialsFromName } from "./initialsFromName";
import styles from "./TreeRow.module.css";

export interface TreeRowProps {
  row: TableRow;
  expanded: boolean;
  onToggleExpand?: () => void;
  highlightedMonth?: MonthLabel | null;
  onHighlightMonth?: MonthHighlightHandler;
}

export function TreeRow({
  row,
  expanded,
  onToggleExpand,
  highlightedMonth = null,
  onHighlightMonth,
}: TreeRowProps) {
  const showAvatar = row.kind === "employee";
  const rowStyle = {
    "--row-depth": row.depth,
  } as CSSProperties;

  return (
    <tr className={styles.row} style={rowStyle} aria-level={row.depth + 1}>
      <th scope="row" className={styles.nameCell}>
        <div className={styles.nameContent}>
          <span className={styles.expandSlot}>
            {row.hasChildren && onToggleExpand ? (
              <ExpandButton
                expanded={expanded}
                label={row.name}
                onToggle={onToggleExpand}
              />
            ) : null}
          </span>

          {showAvatar ? (
            <span className={styles.avatar} aria-hidden="true">
              {initialsFromName(row.name)}
            </span>
          ) : null}

          <span className={styles.name}>{row.name}</span>
        </div>
      </th>

      {row.values.map((value, monthIndex) => {
        const month = MONTH_LABELS[monthIndex]!;
        const isActive = highlightedMonth === month;

        return (
          <td
            key={`${row.id}-${month}`}
            className={styles.valueCell}
            data-month-active={isActive ? "true" : undefined}
            onMouseEnter={() => {
              onHighlightMonth?.(month);
            }}
          >
            {value}
          </td>
        );
      })}
    </tr>
  );
}
