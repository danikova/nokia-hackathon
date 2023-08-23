'use client'

import React, { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { navBarItems } from '@/app/_constans/navBar';
import { FullPageAgGridReact } from '../../../components/ui/table';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';
import { getHumaneRunDuration } from '../results/[runId]/RunResultDisplay';
import { RunStatistic, useRunStatistics, useUserWorkspace } from '@/lib/dataHooks';
import { AverageOutputSizeRenderer, TaskStatisticRenderer, WorkspaceAvatarRenderer } from '../../../components/ui/table/renderers';

export default function App() {
  const workspace = useUserWorkspace();
  const rowData = useRunStatistics();

  const columnDefs = useMemo<ColDef<RunStatistic>[]>(() => [
    {
      field: 'id',
      maxWidth: 60,
      headerName: '',
      cellRenderer: WorkspaceAvatarRenderer,
      cellRendererParams: {
        workspace
      },
    },
    { field: 'number_of_runs', headerName: 'Runs', maxWidth: 80 },
    {
      field: 'average_execution_time',
      headerName: 'Avg. duration',
      valueGetter: (params) => getHumaneRunDuration(params.data?.average_execution_time || 0)
    },
    {
      field: 'average_output_length',
      headerName: 'Avg. output length',
      cellRenderer: AverageOutputSizeRenderer
    },
    {
      headerName: 'Tasks',
      valueGetter: ({ data }) => data?.number_of_evaluated_tasks,
      cellRenderer: TaskStatisticRenderer
    },
  ], [workspace]);

  const defaultColDef = useMemo<ColDef<RunStatistic>>(() => ({
    sortable: true,
    filter: false,
    flex: 1,
    cellClass: (params) => params.data?.id === workspace?.id ? 'bg-primary/20' : ''
  }), [workspace]);

  return (
    <>
      <BreadCrumb items={[navBarItems[3]]} />
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

