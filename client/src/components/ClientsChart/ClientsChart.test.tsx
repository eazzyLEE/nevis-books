import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildChartSeries } from "../../domain/chartSeries";
import {
  companyWithoutChannels,
  sampleCompany,
} from "../../domain/fixtures/sampleCompany";
import { ClientsChart } from "./ClientsChart";
import {
  fillForSeriesKey,
  formatMonthTick,
  toRechartsRows,
} from "./chartPresentation";
import { CHART_THEME_FALLBACKS } from "./chartTheme";

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

  it("maps known channel names to theme fills", () => {
    expect(fillForSeriesKey("Existing clients", 0, CHART_THEME_FALLBACKS)).toBe(
      CHART_THEME_FALLBACKS.channelExisting,
    );
    expect(fillForSeriesKey("New organic", 1, CHART_THEME_FALLBACKS)).toBe(
      CHART_THEME_FALLBACKS.channelOrganic,
    );
    expect(fillForSeriesKey("New paid", 2, CHART_THEME_FALLBACKS)).toBe(
      CHART_THEME_FALLBACKS.channelPaid,
    );
  });

  it("abbreviates month labels for narrow charts", () => {
    expect(formatMonthTick("Feb 2024")).toBe("Feb '24");
    expect(formatMonthTick("Jan 2025")).toBe("Jan '25");
  });
});

describe("ClientsChart", () => {
  it("shows an empty state when there are no channels", () => {
    const series = buildChartSeries(companyWithoutChannels);

    render(<ClientsChart series={series} />);

    expect(
      screen.getByText("No acquisition channel data to chart."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("clients-chart")).not.toBeInTheDocument();
  });

  it("renders the chart when series data is present", () => {
    const series = buildChartSeries(sampleCompany);

    render(<ClientsChart series={series} />);

    expect(screen.getByTestId("clients-chart")).toBeInTheDocument();
    expect(
      screen.queryByText("No acquisition channel data to chart."),
    ).not.toBeInTheDocument();
  });
});
