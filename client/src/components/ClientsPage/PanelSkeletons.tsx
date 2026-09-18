import styles from "./PanelSkeletons.module.css";

const CHART_SKELETON_HEIGHTS = [42, 68, 55, 78, 48, 72, 61, 85, 53, 70, 64, 76];

export function ChartSkeleton() {
  return (
    <div
      className={styles.chartSkeleton}
      role="status"
      aria-label="Loading chart"
    >
      <div className={styles.chartSkeletonPlot} aria-hidden="true">
        {CHART_SKELETON_HEIGHTS.map((height, index) => (
          <span
            key={index}
            className={`${styles.bone} ${styles.chartSkeletonBar}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className={styles.chartSkeletonLegend} aria-hidden="true">
        <span className={`${styles.bone} ${styles.chartSkeletonLegendItem}`} />
        <span className={`${styles.bone} ${styles.chartSkeletonLegendItem}`} />
        <span className={`${styles.bone} ${styles.chartSkeletonLegendItem}`} />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div
      className={styles.tableSkeleton}
      role="status"
      aria-label="Loading table"
    >
      <div className={styles.tableSkeletonHeader} aria-hidden="true">
        <span className={`${styles.bone} ${styles.tableSkeletonName}`} />
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className={`${styles.bone} ${styles.tableSkeletonCell}`}
          />
        ))}
      </div>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.tableSkeletonRow}
          aria-hidden="true"
        >
          <span
            className={`${styles.bone} ${styles.tableSkeletonName}`}
            style={{ width: `${48 + ((rowIndex * 11) % 28)}%` }}
          />
          {Array.from({ length: 6 }, (_, cellIndex) => (
            <span
              key={cellIndex}
              className={`${styles.bone} ${styles.tableSkeletonCell}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
