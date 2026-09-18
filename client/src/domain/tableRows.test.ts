import { describe, expect, it } from "vitest";
import { sampleCompany } from "./fixtures/sampleCompany";
import {
  buildVisibleRows,
  collectDescendantIds,
  toggleExpandedIds,
} from "./tableRows";

const companyId = sampleCompany.id;
const branch1Id = sampleCompany.branches[0]!.id;
const branch2Id = sampleCompany.branches[1]!.id;
const annaId = sampleCompany.branches[0]!.employees![0]!.id;
const jamesId = sampleCompany.branches[0]!.employees![1]!.id;

function rowSummary(rows: ReturnType<typeof buildVisibleRows>) {
  return rows.map((row) => ({
    name: row.name,
    depth: row.depth,
    kind: row.kind,
    hasChildren: row.hasChildren,
  }));
}

describe("buildVisibleRows", () => {
  it("returns only the company row when nothing is expanded", () => {
    const rows = buildVisibleRows(sampleCompany, new Set());

    expect(rowSummary(rows)).toEqual([
      {
        name: "Company",
        depth: 0,
        kind: "company",
        hasChildren: true,
      },
    ]);
  });

  it("includes branches when the company is expanded", () => {
    const rows = buildVisibleRows(sampleCompany, new Set([companyId]));

    expect(rowSummary(rows)).toEqual([
      { name: "Company", depth: 0, kind: "company", hasChildren: true },
      { name: "Branch 1", depth: 1, kind: "branch", hasChildren: true },
      { name: "Branch 2", depth: 1, kind: "branch", hasChildren: false },
      { name: "Branch 3", depth: 1, kind: "branch", hasChildren: false },
    ]);
  });

  it("includes employees when Branch 1 is expanded", () => {
    const rows = buildVisibleRows(
      sampleCompany,
      new Set([companyId, branch1Id]),
    );

    expect(rowSummary(rows)).toEqual([
      { name: "Company", depth: 0, kind: "company", hasChildren: true },
      { name: "Branch 1", depth: 1, kind: "branch", hasChildren: true },
      { name: "Anna Blackwood", depth: 2, kind: "employee", hasChildren: true },
      { name: "James Walker", depth: 2, kind: "employee", hasChildren: false },
      { name: "Maria Gutierrez", depth: 2, kind: "employee", hasChildren: false },
      { name: "Robert Chen", depth: 2, kind: "employee", hasChildren: false },
      { name: "Sarah Smith", depth: 2, kind: "employee", hasChildren: false },
      { name: "Branch 2", depth: 1, kind: "branch", hasChildren: false },
      { name: "Branch 3", depth: 1, kind: "branch", hasChildren: false },
    ]);
  });

  it("includes channels when Anna is expanded", () => {
    const rows = buildVisibleRows(
      sampleCompany,
      new Set([companyId, branch1Id, annaId]),
    );

    expect(rowSummary(rows)).toEqual([
      { name: "Company", depth: 0, kind: "company", hasChildren: true },
      { name: "Branch 1", depth: 1, kind: "branch", hasChildren: true },
      { name: "Anna Blackwood", depth: 2, kind: "employee", hasChildren: true },
      { name: "Existing clients", depth: 3, kind: "channel", hasChildren: false },
      { name: "New organic", depth: 3, kind: "channel", hasChildren: false },
      { name: "New paid", depth: 3, kind: "channel", hasChildren: false },
      { name: "James Walker", depth: 2, kind: "employee", hasChildren: false },
      { name: "Maria Gutierrez", depth: 2, kind: "employee", hasChildren: false },
      { name: "Robert Chen", depth: 2, kind: "employee", hasChildren: false },
      { name: "Sarah Smith", depth: 2, kind: "employee", hasChildren: false },
      { name: "Branch 2", depth: 1, kind: "branch", hasChildren: false },
      { name: "Branch 3", depth: 1, kind: "branch", hasChildren: false },
    ]);
  });

  it("keeps Branch 2 as a leaf even when its id is in expandedIds", () => {
    const rows = buildVisibleRows(
      sampleCompany,
      new Set([companyId, branch2Id]),
    );

    expect(rowSummary(rows)).toEqual([
      { name: "Company", depth: 0, kind: "company", hasChildren: true },
      { name: "Branch 1", depth: 1, kind: "branch", hasChildren: true },
      { name: "Branch 2", depth: 1, kind: "branch", hasChildren: false },
      { name: "Branch 3", depth: 1, kind: "branch", hasChildren: false },
    ]);
  });

  it("ignores expanded child ids when an ancestor is collapsed", () => {
    const rows = buildVisibleRows(
      sampleCompany,
      new Set([branch1Id, annaId]),
    );

    expect(rowSummary(rows)).toEqual([
      {
        name: "Company",
        depth: 0,
        kind: "company",
        hasChildren: true,
      },
    ]);
  });

  it("does not reveal channels for employees without children", () => {
    const rows = buildVisibleRows(
      sampleCompany,
      new Set([companyId, branch1Id, jamesId]),
    );

    const names = rows.map((row) => row.name);
    expect(names).not.toContain("Existing clients");
    expect(names).toContain("James Walker");
  });

  it("preserves monthly values on visible rows", () => {
    const rows = buildVisibleRows(sampleCompany, new Set([companyId]));
    const branch1 = rows.find((row) => row.id === branch1Id);

    expect(branch1?.values[0]).toBe(147);
    expect(branch1?.values[11]).toBe(214);
  });
});

describe("toggleExpandedIds", () => {
  it("adds a collapsed id when expanding", () => {
    const next = toggleExpandedIds(
      sampleCompany,
      new Set([companyId]),
      branch1Id,
    );

    expect([...next].sort()).toEqual([branch1Id, companyId].sort());
  });

  it("removes the id and all descendants when collapsing", () => {
    const open = new Set([companyId, branch1Id, annaId]);
    const next = toggleExpandedIds(sampleCompany, open, branch1Id);

    expect(next.has(branch1Id)).toBe(false);
    expect(next.has(annaId)).toBe(false);
    expect(next.has(companyId)).toBe(true);
  });

  it("collapsing the company clears every nested expanded id", () => {
    const open = new Set([companyId, branch1Id, annaId]);
    const next = toggleExpandedIds(sampleCompany, open, companyId);

    expect(next.size).toBe(0);
  });

  it("re-expanding a parent does not restore cleared children", () => {
    const afterCollapse = toggleExpandedIds(
      sampleCompany,
      new Set([companyId, branch1Id, annaId]),
      companyId,
    );
    const afterExpand = toggleExpandedIds(
      sampleCompany,
      afterCollapse,
      companyId,
    );

    expect([...afterExpand]).toEqual([companyId]);
    expect(
      buildVisibleRows(sampleCompany, afterExpand).map((row) => row.name),
    ).toEqual(["Company", "Branch 1", "Branch 2", "Branch 3"]);
  });
});

describe("collectDescendantIds", () => {
  it("lists nested ids under Branch 1", () => {
    const ids = collectDescendantIds(sampleCompany, branch1Id);

    expect(ids).toContain(annaId);
    expect(ids).toContain(jamesId);
    expect(ids).toContain(
      sampleCompany.branches[0]!.employees![0]!.channels![0]!.id,
    );
    expect(ids).not.toContain(branch1Id);
  });
});
