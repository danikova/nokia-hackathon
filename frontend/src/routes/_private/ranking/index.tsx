import { useAtom } from 'jotai';
import { ColDef } from 'ag-grid-community';
import BreadCrumb, {
  BreadCrumbChildren,
} from '@/components/navigation/breadCrumb';
import { AgGridReact } from 'ag-grid-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRowData } from './-components/rowData';
import ReviewDialog from './-components/reviewDialog';
import { useColumnDefs } from './-components/columnDefs';
import { createFileRoute } from '@tanstack/react-router';
import { useColumnTypes } from './-components/columnTypes';
import { FullPageAgGridReact } from '@/components/ui/table';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { staffNavBarItems } from '@/components/navigation/navBarItems';
import { WorkspaceRankingRecord } from '@/@data/workspaceRankings.types';
import { globalRankingAtom, hideEmptyWorkspacesAtom } from '@/atoms/ranking';
import { uniqueId } from 'lodash';

export const Route = createFileRoute('/_private/ranking/')({
  component: Ranking,
});

function Ranking() {
  const [globalRankings, setGlobalRankings] = useAtom(globalRankingAtom);
  const [hideEmptyWorkspaces, setHideEmptyWorkspaces] = useAtom(
    hideEmptyWorkspacesAtom
  );
  const gridRef = useRef<AgGridReact<WorkspaceRankingRecord>>();
  const dataGridKey = useMemo(() => uniqueId(), [globalRankings]); // eslint-disable-line

  const redrawRowOnChange = useCallback(
    (data: WorkspaceRankingRecord) => {
      const row = gridRef.current?.api?.getRowNode(data.id);
      if (row)
        setTimeout(
          () => {
            gridRef.current?.api?.redrawRows({ rowNodes: [row] });
          },
          Math.random() * 200 + 150
        );
    },
    [gridRef]
  );

  const rowData = useRowData(redrawRowOnChange);
  const columnDefs = useColumnDefs();

  const columnTypes = useColumnTypes();
  const defaultColDef = useMemo<ColDef<WorkspaceRankingRecord>>(
    () => ({
      sortable: true,
      filter: false,
      flex: 1,
      cellClass: params =>
        !params.data?.expand?.workspace?.repo_url
          ? 'line-through-cell opacity-30'
          : '',
    }),
    []
  );

  useEffect(() => {
    gridRef.current?.api?.updateGridOptions({ rowData });
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
            <Label>{globalRankings ? 'Global' : 'My'} rankings</Label>
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
        key={dataGridKey}
        gridRef={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={false}
        noRowsOverlayComponent={() => {
          return (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="text-2xl font-bold text-gray-500">No data</div>
            </div>
          );
        }}
      />
    </>
  );
}
