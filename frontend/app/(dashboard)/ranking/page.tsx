'use client'

import { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { FullPageAgGridReact } from "@/components/ui/table";
import { staffNavBarItems } from "@/app/_constans/navBar"
import BreadCrumb from "@/app/_components/navigation/BreadCrumb"
import { WorkspaceAvatarRenderer } from "@/components/ui/table/renderers";
import { useWorkspaceRankings } from "@/lib/dataHooks";

export default function RankingPage() {

  const rowData = useWorkspaceRankings();

  const columnDefs = useMemo<ColDef[]>(() => [
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
      initialSort: 'asc'
    },
    {
      field: 'rankings',
      headerName: 'Points',
      flex: 1,
    },
    {
      field: 'comments',
      headerName: 'Comments',
    }
  ], []);

  return (
    <>
      <BreadCrumb items={[staffNavBarItems[0]]} />
      <FullPageAgGridReact
        onGridReady={({ api }) => {
          api?.sizeColumnsToFit();
        }}
        animateRows={true}
        rowData={rowData}
        columnDefs={columnDefs}
        // getRowId={({ data }) => data.id}
        noRowsOverlayComponent={() => {
          return <div className='flex flex-col items-center justify-center h-full w-full'>
            <div className='text-2xl font-bold text-gray-500'>No data</div>
          </div>
        }}
      />
    </>
  );
}