'use client'

import { atom, useAtom } from "jotai";
import { useRowData } from "./rowData";
import { useEffect, useRef } from "react";
import { useColumnDefs } from "./columnDefs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { staffNavBarItems } from "@/app/_constans/navBar";
import { FullPageAgGridReact } from "@/components/ui/table";
import BreadCrumb, { BreadCrumbChildren } from "@/app/_components/navigation/BreadCrumb";

export const globalRankingAtom = atom(false);

export default function RankingPage() {
  const [globalRankings, setGlobalRankings] = useAtom(globalRankingAtom);
  const gridRef = useRef<any>();

  const rowData = useRowData();
  const columnDefs = useColumnDefs();

  useEffect(() => {
    gridRef.current?.api?.setRowData(rowData);
  }, [rowData]);

  useEffect(() => {
    gridRef.current?.api?.setColumnDefs(columnDefs);
    gridRef.current?.api?.sizeColumnsToFit();
  }, [columnDefs]);

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
        key={globalRankings ? 'global' : 'local'}
        gridRef={gridRef}
        onGridReady={({ api }) => {
          api?.sizeColumnsToFit();
        }}
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
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
