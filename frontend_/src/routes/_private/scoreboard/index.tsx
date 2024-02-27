import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useMemo, useRef } from 'react';
import { useUserWorkspace } from '@/@data/workspaces';
import { useRunStatistics } from '@/@data/customViews';
import { createFileRoute } from '@tanstack/react-router';
import { useColumnDefs } from './-components/columnDefs';
import { RunResultRecord } from '@/@data/runResults.types';
import BreadCrumb from '@/components/navigation/breadCrumb';
import { FullPageAgGridReact } from '@/components/ui/table';
import { RunStatisticRecord } from '@/@data/customViews.types';
import { navBarItems } from '@/components/navigation/navBarItems';

export const Route = createFileRoute('/_private/scoreboard/')({
  component: Scoreboard,
});

function Scoreboard() {
  const { data: rowData } = useRunStatistics();
  const userWorkspace = useUserWorkspace();
  const columnDefs = useColumnDefs(userWorkspace);
  const gridRef = useRef<AgGridReact<RunResultRecord>>();

  const defaultColDef = useMemo<ColDef<RunStatisticRecord>>(
    () => ({
      sortable: true,
      filter: false,
      flex: 1,
      cellClass: params =>
        params.data?.id === userWorkspace?.id ? 'bg-primary/20' : '',
    }),
    [userWorkspace]
  );

  useEffect(() => {
    const defaultSortModel = [
      { colId: 'average_output_similarity', sort: 'desc', sortIndex: 0 },
      { colId: 'average_execution_time', sort: 'asc', sortIndex: 1 },
    ];

    // @ts-ignore
    gridRef.current?.columnApi?.applyColumnState({ state: defaultSortModel });
  }, [rowData]);

  return (
    <>
      <BreadCrumb items={[navBarItems[2]]} />
      <FullPageAgGridReact
        gridRef={gridRef}
        animateRows={true}
        rowData={rowData ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={({ data }) => data.id}
        noRowsOverlayComponent={() => {
          return (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-500">No data</div>
              <div className="text-gray-400">
                There is no run statistics available.
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
