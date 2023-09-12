'use client'

import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { navBarItems } from '@/lib/navBar';
import { useColumnDefs } from './columnDefs';
import BreadCrumb from '@/components/navigation/BreadCrumb';
import { FullPageAgGridReact } from '../../../components/ui/table';
import { RunStatistic, useRunStatistics, useUserWorkspace } from '@/lib/dataHooks';

export default function App() {
  const workspace = useUserWorkspace();
  const rowData = useRunStatistics();
  const columnDefs = useColumnDefs(workspace);

  const defaultColDef = useMemo<ColDef<RunStatistic>>(() => ({
    sortable: true,
    filter: false,
    flex: 1,
    cellClass: (params) => params.data?.id === workspace?.id ? 'bg-primary/20' : ''
  }), [workspace]);

  return (
    <>
      <BreadCrumb items={[navBarItems[2]]} />
      <FullPageAgGridReact
        onGridReady={({ api }) => {
          api?.sizeColumnsToFit();
        }}
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

