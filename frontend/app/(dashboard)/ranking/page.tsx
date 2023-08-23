'use client'

import { useMemo } from "react";
import { ColDef } from "ag-grid-community";
import { FullPageAgGridReact } from "@/components/ui/table";
import { staffNavBarItems } from "@/app/_constans/navBar"
import BreadCrumb from "@/app/_components/navigation/BreadCrumb"
import { WorkspaceAvatarRenderer } from "@/components/ui/table/renderers";

export default function RankingPage() {

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      field: 'id',
      maxWidth: 60,
      headerName: '',
      cellRenderer: WorkspaceAvatarRenderer,
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
        rowData={[]}
        columnDefs={columnDefs}
        getRowId={({ data }) => data.id}
        noRowsOverlayComponent={() => {
          return <div className='flex flex-col items-center justify-center h-full w-full'>
            <div className='text-2xl font-bold text-gray-500'>No data</div>
          </div>
        }}
      />
    </>
  );
}