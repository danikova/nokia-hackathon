import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ColDef } from 'ag-grid-community';
import { globalRankingAtom } from './page';
import { CommentRenderer, CommentsRenderer, PointsRenderer, ReviewCountRenderer, TotalRenderer } from './renderers';
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
      valueGetter: ({ data }: any) => data?.points,
      cellRenderer: PointsRenderer,
      flex: 1,
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
      headerName: 'Total',
      flex: 1,
      cellRenderer: TotalRenderer,
    },
    {
      headerName: 'Comment',
      minWidth: 300,
      flex: 2,
      cellRenderer: CommentRenderer,
    },
  ]);
}

function getGlobalRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  return getColumnDefs([
    ...getTaskColumns(runTasks),
    {
      headerName: 'Total',
      flex: 1,
      cellRenderer: TotalRenderer,
    },
    {
      headerName: 'Review Count',
      flex: 1,
      cellRenderer: ReviewCountRenderer,
    },
    {
      headerName: 'Comments',
      minWidth: 300,
      flex: 2,
      cellRenderer: CommentsRenderer,
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
