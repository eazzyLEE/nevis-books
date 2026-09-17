export interface ChartTheme {
  channelExisting: string;
  channelOrganic: string;
  channelPaid: string;
  grid: string;
  tick: string;
  axis: string;
  cursor: string;
  fallbackFills: readonly [string, string, string];
}

/** Fallbacks when CSS variables are unavailable (e.g. isolated unit tests). */
export const CHART_THEME_FALLBACKS: ChartTheme = {
  channelExisting: "#c9b8e8",
  channelOrganic: "#f0c4d8",
  channelPaid: "#b76e7e",
  grid: "rgba(20, 20, 19, 0.12)",
  tick: "rgba(20, 20, 19, 0.64)",
  axis: "rgba(20, 20, 19, 0.12)",
  cursor: "rgba(20, 20, 19, 0.04)",
  fallbackFills: ["#8e8e8e", "#b4b4b3", "#c8c8c8"],
};

function readCssVariable(name: string, fallback: string): string {
  if (typeof document === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

/** Resolves chart colors from CSS tokens with literal fallbacks. */
export function resolveChartTheme(): ChartTheme {
  return {
    channelExisting: readCssVariable(
      "--color-channel-existing",
      CHART_THEME_FALLBACKS.channelExisting,
    ),
    channelOrganic: readCssVariable(
      "--color-channel-organic",
      CHART_THEME_FALLBACKS.channelOrganic,
    ),
    channelPaid: readCssVariable(
      "--color-channel-paid",
      CHART_THEME_FALLBACKS.channelPaid,
    ),
    grid: readCssVariable("--color-chart-grid", CHART_THEME_FALLBACKS.grid),
    tick: readCssVariable("--color-chart-tick", CHART_THEME_FALLBACKS.tick),
    axis: readCssVariable("--color-chart-axis", CHART_THEME_FALLBACKS.axis),
    cursor: readCssVariable("--color-chart-cursor", CHART_THEME_FALLBACKS.cursor),
    fallbackFills: [
      readCssVariable(
        "--color-chart-fallback-1",
        CHART_THEME_FALLBACKS.fallbackFills[0],
      ),
      readCssVariable(
        "--color-chart-fallback-2",
        CHART_THEME_FALLBACKS.fallbackFills[1],
      ),
      readCssVariable(
        "--color-chart-fallback-3",
        CHART_THEME_FALLBACKS.fallbackFills[2],
      ),
    ],
  };
}
