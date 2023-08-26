import { CommentRenderer, PointsRenderer, WorkspaceAvatarRenderer } from '@/components/ui/table/renderers';
import { useRunTasks } from '@/lib/dataHooks';
import { ColDef } from 'ag-grid-community';
import { MutableRefObject, useEffect, useMemo } from 'react';
import ReviewDialog, { ReviewDialogProps } from './ReviewModal';

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
  ];
}

export function useColumnDefs(gridRef: MutableRefObject<any>, useGlobalRankings: boolean) {
  const runTasks = useRunTasks();

  const columnDefs = useMemo<ColDef[]>(() => {
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
              dialogComponent: ReviewDialog,
              dialogProps: {
                runTasks,
              } as Partial<ReviewDialogProps>,
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
