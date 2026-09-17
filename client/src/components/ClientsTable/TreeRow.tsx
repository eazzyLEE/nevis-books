import type { CSSProperties } from "react";
import type { TableRow } from "../../domain/tableRows";
import { ExpandButton } from "./ExpandButton";
import { initialsFromName } from "./initialsFromName";
import styles from "./TreeRow.module.css";

export interface TreeRowProps {
  row: TableRow;
  expanded: boolean;
  /** Required when `row.hasChildren` is true; ignored for leaves. */
  onToggleExpand?: () => void;
}

/**
 * One hierarchical table row: expand control, label, and monthly values.
 * Presentational — parent supplies expand state and toggle handler.
 *
 * `aria-expanded` stays on the row for hierarchy semantics; the nested
 * ExpandButton also exposes it for the control itself.
 */
export function TreeRow({ row, expanded, onToggleExpand }: TreeRowProps) {
  const showAvatar = row.kind === "employee";
  const rowStyle = {
    "--row-depth": row.depth,
  } as CSSProperties;

  return (
    <tr
      className={styles.row}
      style={rowStyle}
      aria-level={row.depth + 1}
      aria-expanded={row.hasChildren ? expanded : undefined}
    >
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

      {row.values.map((value, monthIndex) => (
        <td key={`${row.id}-${monthIndex}`} className={styles.valueCell}>
          {value}
        </td>
      ))}
    </tr>
  );
}
