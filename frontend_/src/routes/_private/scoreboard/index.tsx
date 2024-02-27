import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useWorkspaces } from "@/@data/workspaces";
import { useEffect, useMemo, useRef } from "react";
import { useRunStatistics } from "@/@data/customViews";
import { createFileRoute } from "@tanstack/react-router";
import { useColumnDefs } from "./-components/columnDefs";
import BreadCrumb from "@/components/navigation/breadCrumb";
import { FullPageAgGridReact } from "@/components/ui/table";
import { navBarItems } from "@/components/navigation/navBarItems";
import { RunResultRecord, RunStatisticRecord } from "@/@data/customViews.types";

export const Route = createFileRoute("/_private/scoreboard/")({
  component: Scoreboard,
});

function Scoreboard() {
  const { data: rowData } = useRunStatistics();
  const { data } = useWorkspaces();
  const userWorkspace = useMemo(() => data?.items![0] ?? null, [data]);
  const columnDefs = useColumnDefs(userWorkspace);
  const gridRef = useRef<AgGridReact<RunResultRecord>>();

  const defaultColDef = useMemo<ColDef<RunStatisticRecord>>(
    () => ({
      sortable: true,
      filter: false,
      flex: 1,
      cellClass: (params) =>
        params.data?.id === userWorkspace?.id ? "bg-primary/20" : "",
    }),
    [userWorkspace]
  );

  useEffect(() => {
    const defaultSortModel = [
      { colId: "average_output_similarity", sort: "desc", sortIndex: 0 },
      { colId: "average_execution_time", sort: "asc", sortIndex: 1 },
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
            <div className="flex flex-col items-center justify-center h-full w-full">
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
