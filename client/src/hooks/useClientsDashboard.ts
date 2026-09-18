import { useEffect, useState } from "react";
import type { Company, MonthLabel } from "@nevis-books/shared";
import { buildChartSeries, type ChartSeries } from "../domain/chartSeries";
import {
  buildClientSummary,
  type ClientSummary,
} from "../domain/clientSummary";
import {
  buildVisibleRows,
  toggleExpandedIds,
  type TableRow,
} from "../domain/tableRows";
import type { MonthHighlightHandler } from "../formatting/monthHighlight";
import { useClients } from "./useClients";

export type ClientsDashboardView =
  | {
      status: "loading";
      loadedAt: Date | null;
      highlightedMonth: null;
      onHighlightMonth: MonthHighlightHandler;
    }
  | {
      status: "error";
      loadedAt: Date | null;
      errorMessage: string;
      retry: () => void;
      highlightedMonth: null;
      onHighlightMonth: MonthHighlightHandler;
    }
  | {
      status: "success";
      loadedAt: Date | null;
      highlightedMonth: MonthLabel | null;
      onHighlightMonth: MonthHighlightHandler;
      summary: ClientSummary;
      chartSeries: ChartSeries;
      tableRows: readonly TableRow[];
      expandedIds: ReadonlySet<string>;
      onToggleExpand: (rowId: string) => void;
    };

/**
 * Page orchestration: clients fetch, expand state, month highlight, and
 * derived chart/table/summary props. Keeps ClientsPage presentational.
 */
export function useClientsDashboard(): ClientsDashboardView {
  const clients = useClients();
  const companyId = clients.status === "success" ? clients.data.id : null;
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string> | null>(
    null,
  );
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);
  const [highlightedMonth, setHighlightedMonth] = useState<MonthLabel | null>(
    null,
  );

  useEffect(() => {
    setExpandedIds(null);
    setHighlightedMonth(null);
  }, [companyId]);

  useEffect(() => {
    if (clients.status === "success") {
      setLoadedAt(new Date());
    }
  }, [clients.status, companyId]);

  if (clients.status === "loading") {
    return {
      status: "loading",
      loadedAt,
      highlightedMonth: null,
      onHighlightMonth: setHighlightedMonth,
    };
  }

  if (clients.status === "error") {
    return {
      status: "error",
      loadedAt,
      errorMessage: clients.error.message,
      retry: clients.retry,
      highlightedMonth: null,
      onHighlightMonth: setHighlightedMonth,
    };
  }

  const company: Company = clients.data;
  const activeExpandedIds = expandedIds ?? new Set([company.id]);

  return {
    status: "success",
    loadedAt,
    highlightedMonth,
    onHighlightMonth: setHighlightedMonth,
    summary: buildClientSummary(company),
    chartSeries: buildChartSeries(company),
    tableRows: buildVisibleRows(company, activeExpandedIds),
    expandedIds: activeExpandedIds,
    onToggleExpand: (rowId: string) => {
      setExpandedIds((current) =>
        toggleExpandedIds(company, current ?? new Set([company.id]), rowId),
      );
    },
  };
}
