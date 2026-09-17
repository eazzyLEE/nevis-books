import { describe, expect, it } from "vitest";
import type { Company } from "@nevis-books/shared";
import { buildChartSeries } from "./chartSeries";
import {
  companyWithoutChannels,
  sampleCompany,
} from "./fixtures/sampleCompany";

describe("buildChartSeries", () => {
  it("returns an empty series when the tree has no channels", () => {
    expect(buildChartSeries(companyWithoutChannels)).toEqual({
      points: [],
      seriesKeys: [],
    });
  });

  it("aggregates channel values by name into month points", () => {
    const series = buildChartSeries(sampleCompany);

    expect(series.seriesKeys).toEqual([
      "Existing clients",
      "New organic",
      "New paid",
    ]);
    expect(series.points).toHaveLength(12);
    expect(series.points[0]).toEqual({
      month: "Feb 2024",
      valuesBySeriesKey: {
        "Existing clients": 25,
        "New organic": 0,
        "New paid": 0,
      },
    });
    expect(series.points[1]).toEqual({
      month: "Mar 2024",
      valuesBySeriesKey: {
        "Existing clients": 25,
        "New organic": 1,
        "New paid": 0,
      },
    });
    expect(series.points[6]).toEqual({
      month: "Aug 2024",
      valuesBySeriesKey: {
        "Existing clients": 34,
        "New organic": 2,
        "New paid": 0,
      },
    });
  });

  it("sums channels that share a name across employees", () => {
    const companyWithDuplicateChannelNames: Company = {
      ...sampleCompany,
      branches: [
        {
          id: "branch-1",
          name: "Branch 1",
          values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          employees: [
            {
              id: "employee-a",
              name: "Advisor A",
              values: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
              channels: [
                {
                  id: "a-existing",
                  name: "Existing clients",
                  values: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                },
              ],
            },
            {
              id: "employee-b",
              name: "Advisor B",
              values: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
              channels: [
                {
                  id: "b-existing",
                  name: "Existing clients",
                  values: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                },
              ],
            },
          ],
        },
      ],
    };

    const series = buildChartSeries(companyWithDuplicateChannelNames);

    expect(series.seriesKeys).toEqual(["Existing clients"]);
    expect(series.points[0]).toEqual({
      month: "Feb 2024",
      valuesBySeriesKey: {
        "Existing clients": 8,
      },
    });
  });
});
