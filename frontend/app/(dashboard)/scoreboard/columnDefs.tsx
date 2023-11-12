"use client";

import {
  AverageOutputSizeRenderer,
  OutputSimilarityRenderer,
  TaskStatisticRenderer,
  WorkspaceAvatarRenderer,
} from "./renderers";
import { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { RunStatistic, Workspace } from "@/lib/dataHooks";
import { getHumaneRunDuration } from "../results/[runId]/RunResultDisplay";
import { headerTemplateWithInfoCircle } from "@/components/ui/table/headerTemplates";

export function useColumnDefs(workspace: Workspace | null) {
  return useMemo<ColDef<RunStatistic>[]>(
    () => [
      {
        field: "id",
        maxWidth: 60,
        headerName: "",
        sortable: false,
        cellRenderer: WorkspaceAvatarRenderer,
        cellRendererParams: {
          workspace,
        },
      },
      {
        field: "average_output_similarity",
        headerName: "Avg. output similarity",
        cellRenderer: OutputSimilarityRenderer,
        headerTooltip:
          "Shows how similar task results were on average in the last two runs",
        headerComponentParams: {
          template: headerTemplateWithInfoCircle,
        },
      },
      {
        field: "average_execution_time",
        headerName: "Avg. duration",
        valueGetter: (params) =>
          getHumaneRunDuration(params.data?.average_execution_time || 0),
        headerTooltip:
          "Average time tasks took to finish in the last two runs.",
        headerComponentParams: {
          template: headerTemplateWithInfoCircle,
        },
      },
      {
        field: "average_output_length",
        headerName: "Avg. output length",
        cellRenderer: AverageOutputSizeRenderer,
        headerTooltip: "Average length of task outputs in the last two runs",
        headerComponentParams: {
          template: headerTemplateWithInfoCircle,
        },
      },
      { field: "number_of_runs", headerName: "Runs", maxWidth: 80 },
      {
        headerName: "Tasks",
        valueGetter: ({ data }) => data?.number_of_evaluated_tasks,
        cellRenderer: TaskStatisticRenderer,
      },
    ],
    [workspace]
  );
}
