import { ColDef } from 'ag-grid-community';
import { WorkspaceRanking, useRunTasks } from '@/lib/dataHooks';
import { MutableRefObject, useEffect, useMemo } from 'react';
import CreateReviewDialog, { CreateReviewDialogProps } from './CreateReviewDialog';
import { CommentRenderer, PointsRenderer, WorkspaceAvatarRenderer } from '@/components/ui/table/renderers';

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

export function useColumnDefs(gridRef: MutableRefObject<any>, useGlobalRankings: boolean) {
  const runTasks = useRunTasks();

  const columnDefs = useMemo<ColDef<WorkspaceRanking>[]>(() => {
    const runTasksCd =
      runTasks?.map((runTask) => ({
        sortable: false,
        field: 'rankings',
        headerName: runTask.task_name,
        flex: 1,
        valueGetter: ({ data }: any) => data?.points,
        cellRenderer: PointsRenderer,
        cellRendererParams: {
          taskName: runTask.task_name,
        },
      })) || [];
    return getColumnDefs([
      ...runTasksCd,
      !useGlobalRankings
        ? {
            field: 'comments',
            headerName: 'Comments',
            minWidth: 300,
            cellRenderer: CommentRenderer,
            cellRendererParams: {
              dialogComponent: CreateReviewDialog,
              dialogProps: {
                runTasks,
              } as Partial<CreateReviewDialogProps>,
            },
          }
        : {
            field: 'comments',
          },
    ]);
  }, [runTasks, useGlobalRankings]);

  useEffect(() => {
    gridRef.current?.api?.setColumnDefs(columnDefs);
    gridRef.current?.api?.sizeColumnsToFit();
  }, [columnDefs, gridRef]);

  return columnDefs;
}
