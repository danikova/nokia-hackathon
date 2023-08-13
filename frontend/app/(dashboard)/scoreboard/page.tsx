'use client'

import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useUserWorkspace } from '../settings/page';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getHumaneRunDuration } from '../results/[runId]/RunResultDisplay';
import { AverageOutputSizeRenderer, TaskStatisticRenderer, WorkspaceAvatarRenderer } from './renderers';
import { snackbarWrapper, usePocketBase } from '@/app/_lib/clientPocketbase';

import './style.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.min.css';
import { navBarItems } from '@/app/_constans/navBar';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';

const refetchTimeout = 30_000;

export type RunStatistic = {
  "id": string,
  "collectionId": string,
  "collectionName": string,
  "number_of_runs": number,
  "average_execution_time": number,
  "average_output_length": number,
  "number_of_evaluated_tasks": number,
  "number_of_successful_tasks": number,
  "number_of_failure_tasks": number,
  "number_of_timeouted_tasks": number
}

function useRunStatistics() {
  const pb = usePocketBase();
  const [runStatistics, setRunStatistics] = useState<RunStatistic[]>([]);

  const fetchData = useCallback(async () => {
    const data = await snackbarWrapper(pb.collection('run_statistics').getFullList()) as never as RunStatistic[];
    setRunStatistics(data);
  }, [pb]);

  useEffect(() => {
    fetchData();
    const timeoutId = setInterval(fetchData, refetchTimeout);
    return () => clearInterval(timeoutId);
  }, [fetchData]);
  return runStatistics;
}

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
    <div className='-mt-[var(--cm-titlebar-h)] h-full w-full box-border' style={{ '--row-data-count': rowData.length } as React.CSSProperties}>
      <BreadCrumb items={[navBarItems[3]]} />
      <div className='ag-theme-alpine h-full w-full scoreboard-grid'>
        <AgGridReact
          onGridReady={({ api }) => {
            api?.sizeColumnsToFit();
          }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          getRowId={({ data }) => data.id}
          noRowsOverlayComponent={() => {
            return <div className='flex flex-col items-center justify-center h-full w-full'>
              <div className='text-2xl font-bold text-gray-500'>No data</div>
              <div className='text-gray-400'>There is no run statistics available.</div>
            </div>
          }}
        />
      </div>
    </div>
  );
};
