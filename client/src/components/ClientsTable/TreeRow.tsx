import type { CSSProperties } from "react";
import type { TableRow } from "../../domain/tableRows";
import { ExpandButton } from "./ExpandButton";
import { initialsFromName } from "./initialsFromName";
import styles from "./TreeRow.module.css";

export interface TreeRowProps {
  row: TableRow;
  expanded: boolean;
  onToggleExpand?: () => void;
}

export function TreeRow({ row, expanded, onToggleExpand }: TreeRowProps) {
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

      {row.values.map((value, monthIndex) => (
        <td key={`${row.id}-${monthIndex}`} className={styles.valueCell}>
          {value}
        </td>
      ))}
    </tr>
  );
}
