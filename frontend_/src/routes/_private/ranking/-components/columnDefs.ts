import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ColDef } from 'ag-grid-community';
import { RankingRecord } from '@/@data/rankings.types';
import { WorkspaceRankingRecord } from '@/@data/workspaceRankings.types';
import { WorkspaceAvatarRenderer } from '@/components/renderers/workspaceAvatar';
import { RunTaskRecord } from '@/@data/runTasks.types';
import { globalRankingAtom } from '@/atoms/ranking';
import { useRunTasks } from '@/@data/runTasks';
import { PointsRenderer } from '@/components/renderers/points';

export function rankingValueGetterFactory(
  valueFn: (data: RankingRecord) => number,
  avg = true
) {
  return ({ data }: { data: WorkspaceRankingRecord }) => {
    let sum = 0;
    let validCount = 0;
    const list = data?.expand?.rankings || [];
    for (const ranking of list) {
      try {
        sum += valueFn(ranking);
        validCount += 1;
      } catch (e) {
        console.error(e);
      }
    }
    return avg ? sum / validCount : sum;
  };
}

function getDefaultColumnDefs(dynamicColumns?: ColDef[]): ColDef[] {
  return [
    {
      field: 'workspace',
      maxWidth: 60,
      headerName: '',
      sortable: false,
      cellRenderer: WorkspaceAvatarRenderer,
      cellRendererParams: {
        workspace: null,
      },
    },
    {
      field: 'workspace',
      headerName: 'Workspace Id',
    },
    ...(dynamicColumns || []),
  ] as ColDef<WorkspaceRankingRecord>[];
}

function getTaskColumns(runTasks: RunTaskRecord[]) {
  return (
    runTasks?.map(runTask => ({
      cellRenderer: PointsRenderer,
      headerName: runTask.task_name,
      valueGetter: rankingValueGetterFactory(
        data => data.points_sum[runTask.task_name]
      ),
    })) || []
  );
}

function getMyRankingColumnDef(runTasks: RunTaskRecord[]): ColDef[] {
  return getDefaultColumnDefs([
    {
      type: 'totalColumn',
    },
    ...getTaskColumns(runTasks),
    {
      type: 'singleCommentColumn',
    },
  ]);
}

function getGlobalRankingColumnDef(runTasks: RunTaskRecord[]): ColDef[] {
  return getDefaultColumnDefs([
    {
      type: 'totalColumn',
      initialSort: 'desc',
    },
    ...getTaskColumns(runTasks),
    {
      type: 'reviewCountColumn',
    },
    {
      type: 'multipleCommentsColumn',
    },
  ]);
}

export function useColumnDefs() {
  const globalRankings = useAtomValue(globalRankingAtom);
  const { data: runTasks } = useRunTasks();

  const columnDefs = useMemo<ColDef<WorkspaceRankingRecord>[]>(() => {
    if (!globalRankings) {
      return getMyRankingColumnDef(runTasks?.items || []);
    }
    return getGlobalRankingColumnDef(runTasks?.items || []);
  }, [runTasks, globalRankings]);

  return columnDefs;
}
