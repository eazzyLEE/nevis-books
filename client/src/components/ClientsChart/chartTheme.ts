export interface ChartTheme {
  grid: string;
  tick: string;
  axis: string;
  cursor: string;
  /** Fills cycled by series index (order of first-seen channel names). */
  seriesPalette: readonly string[];
}

export const CHART_THEME_FALLBACKS: ChartTheme = {
  grid: "rgba(20, 20, 19, 0.12)",
  tick: "rgba(20, 20, 19, 0.64)",
  axis: "rgba(20, 20, 19, 0.12)",
  cursor: "rgba(20, 20, 19, 0.04)",
  seriesPalette: [
    "#c9b8e8",
    "#f0c4d8",
    "#b76e7e",
    "#8e8e8e",
    "#b4b4b3",
    "#c8c8c8",
  ],
};

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

export function resolveChartTheme(): ChartTheme {
  const seriesPalette = CHART_THEME_FALLBACKS.seriesPalette.map(
    (fallback, index) => cssVar(`--color-chart-series-${index + 1}`, fallback),
  );

  return {
    grid: cssVar("--color-chart-grid", CHART_THEME_FALLBACKS.grid),
    tick: cssVar("--color-chart-tick", CHART_THEME_FALLBACKS.tick),
    axis: cssVar("--color-chart-axis", CHART_THEME_FALLBACKS.axis),
    cursor: cssVar("--color-chart-cursor", CHART_THEME_FALLBACKS.cursor),
    seriesPalette,
  };
}
