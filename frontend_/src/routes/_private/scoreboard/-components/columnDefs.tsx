"use client";

import { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { headerTemplateWithInfoCircle } from "@/components/ui/table/headerTemplates";
import { WorkspaceRecord } from "@/@data/workspaces.types";
import { RunStatisticRecord } from "@/@data/customViews.types";
import { WorkspaceAvatarRenderer } from "@/components/renderers/workspaceAvatar";
import { OutputSimilarityRenderer } from "@/components/renderers/outputSimilarity";
import { getHumaneRunDuration } from "@/components/runResultDisplay";
import { AverageOutputSizeRenderer } from "@/components/renderers/averageOutputSize";
import { TaskStatisticRenderer } from "@/components/renderers/taskStatistic";

export function useColumnDefs(workspace: WorkspaceRecord | null) {
  return useMemo<ColDef<RunStatisticRecord>[]>(
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
        valueGetter: (params) =>
          Math.round((params.data?.average_output_similarity || 0) * 100),
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
