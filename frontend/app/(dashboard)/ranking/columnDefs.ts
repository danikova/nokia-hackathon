import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { ColDef } from "ag-grid-community";
import { PointsRenderer } from "./renderers";
import { WorkspaceAvatarRenderer } from "../scoreboard/renderers";
import {
  Ranking,
  RunTask,
  WorkspaceRanking,
  runTasksAtom,
} from "@/lib/dataHooks";
import { globalRankingAtom } from "./page";

export function rankingValueGetterFactory(
  valueFn: (data: Ranking) => number,
  avg = true
) {
  return ({ data }: { data: WorkspaceRanking }) => {
    let sum = 0;
    let validCount = 0;
    const list = data?.expand?.rankings || [];
    for (const ranking of list) {
      try {
        sum += valueFn(ranking);
        validCount += 1;
      } catch {}
    }
    return avg ? sum / validCount : sum;
  };
}

function getDefaultColumnDefs(dynamicColumns?: ColDef[]): ColDef[] {
  return [
    {
      field: "workspace",
      maxWidth: 60,
      headerName: "",
      sortable: false,
      cellRenderer: WorkspaceAvatarRenderer,
      cellRendererParams: {
        workspace: null,
      },
    },
    {
      field: "workspace",
      headerName: "Workspace Id",
    },
    ...(dynamicColumns || []),
  ] as ColDef<WorkspaceRanking>[];
}

function getTaskColumns(runTasks: RunTask[]) {
  return (
    runTasks?.map((runTask) => ({
      cellRenderer: PointsRenderer,
      headerName: runTask.task_name,
      valueGetter: rankingValueGetterFactory(
        (data) => data.points_sum[runTask.task_name]
      ),
    })) || []
  );
}

function getMyRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  return getDefaultColumnDefs([
    {
      type: "totalColumn",
    },
    ...getTaskColumns(runTasks),
    {
      type: "singleCommentColumn",
    },
  ]);
}

function getGlobalRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  return getDefaultColumnDefs([
    {
      type: "totalColumn",
      initialSort: "desc",
    },
    ...getTaskColumns(runTasks),
    {
      type: "reviewCountColumn",
    },
    {
      type: "multipleCommentsColumn",
    },
  ]);
}

export function useColumnDefs() {
  const globalRankings = useAtomValue(globalRankingAtom);
  const runTasks = useAtomValue(runTasksAtom);

  const columnDefs = useMemo<ColDef<WorkspaceRanking>[]>(() => {
    if (!globalRankings) {
      return getMyRankingColumnDef(runTasks);
    }
    return getGlobalRankingColumnDef(runTasks);
  }, [runTasks, globalRankings]);

  return columnDefs;
}
