'use client'

import { useMemo, useState } from "react";
import { ColDef } from "ag-grid-community";
import { FullPageAgGridReact } from "@/components/ui/table";
import { staffNavBarItems } from "@/app/_constans/navBar"
import BreadCrumb, { BreadCrumbChildren } from "@/app/_components/navigation/BreadCrumb"
import { PointsRenderer, WorkspaceAvatarRenderer } from "@/components/ui/table/renderers";
import { useWorkspaceRankings } from "@/lib/dataHooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RankingPage() {
  const rowData = useWorkspaceRankings();
  const [globalRankings, setGlobalRankings] = useState(false);

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
      sortable: false,
      field: 'rankings',
      headerName: 'Points',
      flex: 1,
      cellRenderer: PointsRenderer
    },
    {
      field: 'comments',
      headerName: 'Comments',
    }
  ], []);

  return (
    <>
      <BreadCrumb items={[staffNavBarItems[0]]} />
      <BreadCrumbChildren>
        <div className="flex items-center space-x-2">
          <Switch onCheckedChange={setGlobalRankings} />
          <Label>Use global rankings</Label>
        </div>
      </BreadCrumbChildren>
      <FullPageAgGridReact
        onGridReady={({ api }) => {
          api?.sizeColumnsToFit();
        }}
        animateRows={true}
        rowData={rowData}
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