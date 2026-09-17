export interface ChartTheme {
  grid: string;
  tick: string;
  axis: string;
  cursor: string;
  /**
   * Fills cycled by series index. Index aligns with `seriesKeys` order
   * (first-seen channel names while walking the tree), not with name strings.
   */
  seriesPalette: readonly string[];
}

/** Fallbacks when CSS variables are unavailable (e.g. isolated unit tests). */
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

const MAX_SERIES_PALETTE_SLOTS = 24;

function readCssVariable(name: string, fallback: string): string {
  if (typeof document === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

function readOptionalCssVariable(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || null;
}

/**
 * Reads `--color-chart-series-1`, `-2`, … until a gap.
 * Add more tokens in CSS without changing this loop.
 */
function resolveSeriesPalette(): readonly string[] {
  const fromCss: string[] = [];

  for (let slot = 1; slot <= MAX_SERIES_PALETTE_SLOTS; slot += 1) {
    const value = readOptionalCssVariable(`--color-chart-series-${slot}`);

    if (!value) {
      break;
    }

    fromCss.push(value);
  }

  return fromCss.length > 0 ? fromCss : CHART_THEME_FALLBACKS.seriesPalette;
}

/** Resolves chart colors from CSS tokens with literal fallbacks. */
export function resolveChartTheme(): ChartTheme {
  return {
    grid: readCssVariable("--color-chart-grid", CHART_THEME_FALLBACKS.grid),
    tick: readCssVariable("--color-chart-tick", CHART_THEME_FALLBACKS.tick),
    axis: readCssVariable("--color-chart-axis", CHART_THEME_FALLBACKS.axis),
    cursor: readCssVariable("--color-chart-cursor", CHART_THEME_FALLBACKS.cursor),
    seriesPalette: resolveSeriesPalette(),
  };
}
