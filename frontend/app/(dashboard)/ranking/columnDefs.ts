import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ColDef } from 'ag-grid-community';
import { globalRankingAtom } from './page';
import { CommentRenderer, PointsRenderer, TotalRenderer } from './renderers';
import ReviewDialog, { ReviewDialogProps } from './ReviewDialog';
import { WorkspaceAvatarRenderer } from '../scoreboard/renderers';
import { RunTask, WorkspaceRanking, runTasksAtom } from '@/lib/dataHooks';

function getColumnDefs(dynamicColumns?: ColDef[]): ColDef[] {
  return [
    {
      field: 'workspace',
      maxWidth: 60,
      headerName: '',
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
  ] as ColDef<WorkspaceRanking>[];
}

function getTaskColumns(runTasks: RunTask[]) {
  return (
    runTasks?.map((runTask) => ({
      sortable: false,
      field: 'rankings',
      headerName: runTask.task_name,
      flex: 1,
      valueGetter: ({ data }: any) => data?.points,
      cellRenderer: PointsRenderer,
      cellRendererParams: {
        runTask: runTask,
      },
    })) || []
  );
}

function getMyRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  return getColumnDefs([
    ...getTaskColumns(runTasks),
    {
      field: 'sum',
      headerName: 'Total',
      cellRenderer: TotalRenderer,
    },
    {
      field: 'comments',
      headerName: 'Comments',
      minWidth: 300,
      cellRenderer: CommentRenderer,
    },
  ]);
}

function getGlobalRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  return getColumnDefs([...getTaskColumns(runTasks)]);
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
