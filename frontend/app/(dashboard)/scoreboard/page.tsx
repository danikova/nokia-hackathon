'use client'

import { ColDef } from 'ag-grid-community';
import { navBarItems } from '@/lib/navBar';
import { AgGridReact } from 'ag-grid-react';
import { useColumnDefs } from './columnDefs';
import { RunResult } from '../results/helpers';
import React, { useEffect, useMemo, useRef } from 'react';
import BreadCrumb from '@/components/navigation/BreadCrumb';
import { FullPageAgGridReact } from '../../../components/ui/table';
import { RunStatistic, useRunStatistics, useUserWorkspace } from '@/lib/dataHooks';

export default function App() {
  const rowData = useRunStatistics();
  const workspace = useUserWorkspace();
  const columnDefs = useColumnDefs(workspace);
  const gridRef = useRef<AgGridReact<RunResult>>();

  const defaultColDef = useMemo<ColDef<RunStatistic>>(() => ({
    sortable: true,
    filter: false,
    flex: 1,
    cellClass: (params) => params.data?.id === workspace?.id ? 'bg-primary/20' : ''
  }), [workspace]);

  useEffect(() => {
    var defaultSortModel = [
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
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={({ data }) => data.id}
        noRowsOverlayComponent={() => {
          return <div className='flex flex-col items-center justify-center h-full w-full'>
            <div className='text-2xl font-bold text-gray-500'>No data</div>
            <div className='text-gray-400'>There is no run statistics available.</div>
          </div>
        }}
      />
    </>
  );
};

