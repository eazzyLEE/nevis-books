import { describe, expect, it } from "vitest";
import {
  barFillOpacity,
  DIMMED_BAR_OPACITY,
  monthFromLabel,
} from "./monthHighlight";

describe("monthHighlight", () => {
  it("parses known month labels and rejects unknowns", () => {
    expect(monthFromLabel("Aug 2024")).toBe("Aug 2024");
    expect(monthFromLabel("not-a-month")).toBeNull();
    expect(monthFromLabel(12)).toBeNull();
  });

  it("dims bars that are not the highlighted month", () => {
    expect(barFillOpacity("Aug 2024", null)).toBe(1);
    expect(barFillOpacity("Aug 2024", "Aug 2024")).toBe(1);
    expect(barFillOpacity("Feb 2024", "Aug 2024")).toBe(DIMMED_BAR_OPACITY);
  });
});
