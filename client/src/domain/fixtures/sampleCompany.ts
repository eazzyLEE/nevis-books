import type { Company } from "@nevis-books/shared";

export { companyClients as sampleCompany } from "@nevis-books/shared";

/** Minimal company with no acquisition channels (chart empty-series case). */
export const companyWithoutChannels: Company = {
  id: "company-empty-channels",
  name: "Company",
  values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  branches: [
    {
      id: "branch-1",
      name: "Branch 1",
      values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      employees: [
        {
          id: "employee-1",
          name: "Alex Example",
          values: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        },
      ],
    },
  ],
};
