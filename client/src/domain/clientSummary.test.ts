import { describe, expect, it } from "vitest";
import {
  companyWithoutChannels,
  sampleCompany,
} from "./fixtures/sampleCompany";
import { buildClientSummary } from "./clientSummary";

describe("buildClientSummary", () => {
  it("derives latest clients, period change, and tree counts", () => {
    const summary = buildClientSummary(sampleCompany);

    expect(summary.latestClients).toBe(350);
    expect(summary.latestMonth).toBe("Jan 2025");
    expect(summary.periodChange).toBe(100);
    expect(summary.periodStart).toBe("Feb 2024");
    expect(summary.periodEnd).toBe("Jan 2025");
    expect(summary.branchCount).toBe(3);
    expect(summary.advisorCount).toBe(5);
  });

  it("counts advisors when channels are absent", () => {
    const summary = buildClientSummary(companyWithoutChannels);

    expect(summary.branchCount).toBe(1);
    expect(summary.advisorCount).toBe(1);
    expect(summary.latestClients).toBe(10);
    expect(summary.periodChange).toBe(0);
  });
});
