import styles from "./ExpandButton.module.css";

export interface ExpandButtonProps {
  expanded: boolean;
  /** Visible row name used in the accessible label. */
  label: string;
  onToggle: () => void;
}

/**
 * Chevron control for expanding or collapsing a tree row.
 * Owns no tree state — parent passes `expanded` and handles `onToggle`.
 */
export function ExpandButton({ expanded, label, onToggle }: ExpandButtonProps) {
  const action = expanded ? "Collapse" : "Expand";

  return (
    <button
      type="button"
      className={styles.button}
      aria-expanded={expanded}
      aria-label={`${action} ${label}`}
      onClick={onToggle}
    >
      <span
        className={styles.chevron}
        data-expanded={expanded ? "true" : "false"}
        aria-hidden="true"
      />
    </button>
  );
}
