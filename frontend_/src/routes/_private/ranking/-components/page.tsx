"use client";

import { useAtom } from "jotai";
import { useRowData } from "./rowData";
import ReviewDialog from "./ReviewDialog";
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import BreadCrumb, {
  BreadCrumbChildren,
} from "@/components/navigation/BreadCrumb";
import { useColumnDefs } from "./columnDefs";
import { Label } from "@/components/ui/label";
import { useColumnTypes } from "./columnTypes";
import { Switch } from "@/components/ui/switch";
import { staffNavBarItems } from "@/lib/navBar";
import { FullPageAgGridReact } from "@/components/ui/table";
import { WorkspaceRanking, useRunTasks } from "@/lib/dataHooks";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { globalRankingAtom, hideEmptyWorkspacesAtom } from "./atoms";

export default function RankingPage() {
  useRunTasks();

  const [globalRankings, setGlobalRankings] = useAtom(globalRankingAtom);
  const [hideEmptyWorkspaces, setHideEmptyWorkspaces] = useAtom(
    hideEmptyWorkspacesAtom
  );
  const gridRef = useRef<AgGridReact<WorkspaceRanking>>();

  const redrawRowOnChange = useCallback(
    (data: WorkspaceRanking) => {
      const row = gridRef.current?.api?.getRowNode(data.id);
      if (row)
        setTimeout(() => {
          gridRef.current?.api?.redrawRows({ rowNodes: [row] });
        }, Math.random() * 200 + 150);
    },
    [gridRef]
  );

  const rowData = useRowData(redrawRowOnChange);
  const columnDefs = useColumnDefs();

  const columnTypes = useColumnTypes();
  const defaultColDef = useMemo<ColDef<WorkspaceRanking>>(
    () => ({
      sortable: true,
      filter: false,
      flex: 1,
      cellClass: (params) =>
        !params.data?.expand.workspace?.repo_url
          ? "line-through-cell opacity-30"
          : "",
    }),
    []
  );

  useEffect(() => {
    gridRef.current?.api?.setRowData(rowData);
  }, [rowData, gridRef]);

  useEffect(() => {
    gridRef.current?.api?.setColumnDefs(columnDefs);
    gridRef.current?.api?.sizeColumnsToFit();
  }, [columnDefs, gridRef]);

  return (
    <>
      <BreadCrumb items={[staffNavBarItems[0]]} />
      <BreadCrumbChildren>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-2">
            <Label>{globalRankings ? "Global" : "My"} rankings</Label>
            <Switch
              checked={globalRankings}
              onCheckedChange={setGlobalRankings}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Hide empty workspace</Label>
            <Switch
              checked={hideEmptyWorkspaces}
              onCheckedChange={setHideEmptyWorkspaces}
            />
          </div>
        </div>
      </BreadCrumbChildren>
      <ReviewDialog />
      <FullPageAgGridReact
        columnTypes={columnTypes}
        key={globalRankings ? "global" : "local"}
        gridRef={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        getRowId={({ data }) => data.id}
        noRowsOverlayComponent={() => {
          return (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="text-2xl font-bold text-gray-500">No data</div>
            </div>
          );
        }}
      />
    </>
  );
}
