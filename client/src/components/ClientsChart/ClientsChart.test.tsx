import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildChartSeries } from "../../domain/chartSeries";
import {
  companyWithoutChannels,
  sampleCompany,
} from "../../domain/fixtures/sampleCompany";
import { ClientsChart } from "./ClientsChart";
import { fillForSeriesIndex, toRechartsRows } from "./chartPresentation";
import { CHART_THEME_FALLBACKS } from "./chartTheme";
import { formatMonthTick } from "../../formatting/formatMonthTick";

describe("chartPresentation", () => {
  it("flattens domain points for Recharts", () => {
    const series = buildChartSeries(sampleCompany);
    const rows = toRechartsRows(series);

    expect(rows[0]).toEqual({
      month: "Feb 2024",
      "Existing clients": 25,
      "New organic": 0,
      "New paid": 0,
    });
  });

  it("cycles palette fills by series index", () => {
    const palette = CHART_THEME_FALLBACKS.seriesPalette;

    expect(fillForSeriesIndex(0, CHART_THEME_FALLBACKS)).toBe(palette[0]);
    expect(fillForSeriesIndex(1, CHART_THEME_FALLBACKS)).toBe(palette[1]);
    expect(fillForSeriesIndex(2, CHART_THEME_FALLBACKS)).toBe(palette[2]);
    expect(fillForSeriesIndex(palette.length, CHART_THEME_FALLBACKS)).toBe(
      palette[0],
    );
  });

  it("abbreviates month labels for narrow charts", () => {
    expect(formatMonthTick("Feb 2024")).toBe("Feb '24");
    expect(formatMonthTick("Jan 2025")).toBe("Jan '25");
  });
});

describe("resolveChartTheme", () => {
  it("loads the series palette from CSS tokens when present", async () => {
    const { resolveChartTheme } = await import("./chartTheme");
    const theme = resolveChartTheme();

    expect(theme.seriesPalette.length).toBeGreaterThanOrEqual(3);
    expect(theme.seriesPalette[0]).toBe("#c9b8e8");
  });
});

describe("ClientsChart", () => {
  it("shows an empty state when there are no channels", () => {
    const series = buildChartSeries(companyWithoutChannels);

    render(<ClientsChart series={series} />);

    expect(
      screen.getByText("No acquisition channel data to chart."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  });

  it("renders the chart when series data is present", () => {
    const series = buildChartSeries(sampleCompany);

    render(<ClientsChart series={series} />);

    expect(
      screen.getByRole("figure", {
        name: /Client acquisition by channel.*Feb 2024.*Jan 2025/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: "Monthly acquisition values by channel",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Existing clients" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Feb 2024" })).toBeInTheDocument();
    expect(
      screen.queryByText("No acquisition channel data to chart."),
    ).not.toBeInTheDocument();
  });
});
