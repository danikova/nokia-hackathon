'use client'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import WorkspaceAvatar from '../settings/WorkspaceAvatar';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine-no-font.min.css';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { snackbarWrapper, usePocketBase } from '@/app/_lib/clientPocketbase';
import { Workspace, useUserWorkspace } from '../settings/page';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const refetchTimeout = 30_000;

type RunStatistic = {
  "id": string,
  "collectionId": string,
  "collectionName": string,
  "number_of_runs": number,
  "number_of_timeouted_runs": number,
  "number_of_successful_runs": number,
  "number_of_something_changed_runs": number,
  "average_execution_time": number,
  "average_output_length": number
}

function useRunStatistics() {
  const pb = usePocketBase();
  const [runStatistics, setRunStatistics] = useState<RunStatistic[]>([]);

  const fetchData = useCallback(async () => {
    const data = await snackbarWrapper(pb.collection('run_statistics').getFullList());
    setRunStatistics(data as never as RunStatistic[]);
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
    { headerName: 'id', width: 50 },
    {
      field: 'id', headerName: '', cellRenderer: WorkspaceAvatarRenderer, cellRendererParams: {
        workspace
      }
    },
    { field: 'number_of_runs' },
    { field: 'number_of_successful_runs' },
    { field: 'number_of_timeouted_runs' },
    { field: 'number_of_something_changed_runs' },
    { field: 'average_execution_time' },
    { field: 'average_output_length' },
  ], []);

  const defaultColDef = useMemo<ColDef<RunStatistic>>(() => ({
    sortable: true,
    filter: false,
    cellClass: (params) => params.data?.id === workspace?.id ? 'bg-primary/20' : ''
  }), [workspace]);

  return (
    <div className='h-[calc(100%-var(--cm-titlebar-h))] w-full box-border'>
      <div className='ag-theme-alpine h-full w-full'>
        <AgGridReact
          onGridReady={({ api }) => {
            api?.sizeColumnsToFit();
          }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
        />
      </div>
    </div>
  );
};

interface WorkspaceAvatarRendererProps extends ICellRendererParams {
  workspace: Workspace | null
}

function WorkspaceAvatarRenderer(props: WorkspaceAvatarRendererProps) {
  const workspaceId = props.valueFormatted ? props.valueFormatted : props.value;
  const { workspace } = props;

  return (
    <div className='h-full w-full flex items-center justify-start'>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>
          <WorkspaceAvatar workspaceId={workspaceId} />
        </TooltipTrigger>
        <TooltipContent side='right' hidden={workspace?.id !== workspaceId}>
          This is your workspace
        </TooltipContent>
      </Tooltip>
    </div>
  );
}