'use client'

import { useRef, useState } from "react";
import { FullPageAgGridReact } from "@/components/ui/table";
import { staffNavBarItems } from "@/app/_constans/navBar"
import BreadCrumb, { BreadCrumbChildren } from "@/app/_components/navigation/BreadCrumb"
import { useWorkspaceRankings } from "@/lib/dataHooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useColumnDefs } from "./columnDefs";



export default function RankingPage() {
  const gridRef = useRef<any>();
  const rowData = useWorkspaceRankings();
  const [globalRankings, setGlobalRankings] = useState(false);
  const columnDefs = useColumnDefs(gridRef, globalRankings);

  return (
    <>
      <BreadCrumb items={[staffNavBarItems[0]]} />
      <BreadCrumbChildren>
        <div className="flex items-center space-x-2">
          <Label>My rankings</Label>
          <Switch onCheckedChange={setGlobalRankings} />
          <Label>Global rankings</Label>
        </div>
      </BreadCrumbChildren>
      <FullPageAgGridReact
        gridRef={gridRef}
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
