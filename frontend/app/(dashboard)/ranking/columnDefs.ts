import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ColDef } from 'ag-grid-community';
import { globalRankingAtom } from './page';
import { CommentRenderer, PointsRenderer } from './renderers';
import ReviewDialog, { ReviewDialogProps } from './ReviewDialog';
import { WorkspaceAvatarRenderer } from '../scoreboard/renderers';
import { RunTask, WorkspaceRanking, useRunTasks } from '@/lib/dataHooks';

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

function getMyRankingColumnDef(runTasks: RunTask[]): ColDef[] {
  const runTasksCd =
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
    })) || [];
  return getColumnDefs([
    ...runTasksCd,
    {
      field: 'comments',
      headerName: 'Comments',
      minWidth: 300,
      cellRenderer: CommentRenderer,
      cellRendererParams: {
        dialogComponent: ReviewDialog,
        dialogProps: {
          runTasks,
        } as Partial<ReviewDialogProps>,
      },
    },
  ]);
}

export function useColumnDefs() {
  const globalRankings = useAtomValue(globalRankingAtom);
  const runTasks = useRunTasks();

  const columnDefs = useMemo<ColDef<WorkspaceRanking>[]>(() => {
    if (!globalRankings) {
      return getMyRankingColumnDef(runTasks);
    }
    return getColumnDefs();
  }, [runTasks, globalRankings]);

  return columnDefs;
}
