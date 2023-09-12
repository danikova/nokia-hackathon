
import React, { useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import { ICellRendererParams } from 'ag-grid-community';
import { RunStatistic, Workspace } from '@/lib/dataHooks';
import WorkspaceAvatar from '../settings/WorkspaceAvatar';
import 'ag-grid-community/styles/ag-theme-alpine-no-font.min.css';
import { OutputSimilarityRenderer as OSR } from '../results/[runId]/RunResultDisplay';
import { Tooltip, TooltipContent, TooltipDescription, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkspaceAvatarRendererProps extends ICellRendererParams {
  workspace: Workspace | null
}

export function WorkspaceAvatarRenderer(props: WorkspaceAvatarRendererProps) {
  const workspaceId = props.valueFormatted ? props.valueFormatted : props.value;
  const { workspace } = props;

  return (
    <div className='h-full w-full flex items-center justify-center'>
      <Tooltip>
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

function useKformatter(charCount: any) {
  return useMemo(() => {
    try {
      const charCountNumber: number = parseInt(charCount);
      return kFormatter(charCountNumber) + ' chars';
    } catch {
      return charCount + ' chars';
    }
  }, [charCount]);
}

function kFormatter(num: number) {
  return Math.abs(num) > 999 ? Math.sign(num) * (Math.round(Math.abs(num) / 100) / 10) + 'k' : Math.sign(num) * Math.abs(num)
}

export function AverageOutputSizeRenderer(props: ICellRendererParams<RunStatistic>) {
  const charCount = props.valueFormatted ? props.valueFormatted : props.value;
  const text = useKformatter(charCount);

  return (
    <p>{text}</p>
  );
}

export function TaskStatisticRenderer({ data }: ICellRendererParams<RunStatistic>) {
  return (
    <div className='flex gap-1'>
      <Tooltip>
        <span className='flex-[1_1_100px] flex justify-center items-center font-bold'>
          <TooltipTrigger>
            {data?.number_of_evaluated_tasks}
          </TooltipTrigger>
        </span>
        <TooltipContent side='right'>
          Total Evaluated Tasks
          <TooltipDescription>
            The total number of tasks that have been evaluated.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
      <span className='opacity-50'>/</span>
      <span className='flex-[1_1_100px] flex justify-center items-center gap-1'>
        <Tooltip>
          <span className='text-green-500 font-bold'>
            <TooltipTrigger>
              {data?.number_of_successful_tasks}
            </TooltipTrigger>
          </span>
          <TooltipContent side='right'>
            Successful Tasks
            <TooltipDescription>
              The number of tasks that completed successfully without errors.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
        {!!data?.number_of_failure_tasks && <Tooltip>
          <span className='text-xs text-red-500 font-bold'>
            <TooltipTrigger>
              {'('}
              <span>{data?.number_of_failure_tasks}</span>
              {')'}
            </TooltipTrigger>
          </span>
          <TooltipContent side='right'>
            Failed Tasks
            <TooltipDescription>
              The number of tasks that encountered failures or errors.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>}
        {!!data?.number_of_timeouted_tasks && <Tooltip>
          <span className='text-xs text-orange-500 font-bold'>
            <TooltipTrigger>
              {'('}
              <span>{data?.number_of_timeouted_tasks}</span>
              {')'}
            </TooltipTrigger>
          </span>
          <TooltipContent side='right'>
            Timed Out Tasks
            <TooltipDescription>
              The number of tasks that exceeded their execution time limit and timed out.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>}
      </span>
      <span className='opacity-50'>/</span>
      <Tooltip>
        <span className='flex-[1_1_100px] flex justify-center items-center text-red-500 font-bold'>
          <TooltipTrigger>
            {data?.number_of_flow_failure_tasks}
          </TooltipTrigger>
        </span>
        <TooltipContent side='right'>
          Flow Anomalies
          <TooltipDescription>
            The number of tasks with irregularities in their execution flows, indicating deviations from the normal sequence of tasks.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function OutputSimilarityRenderer(props: ICellRendererParams<RunStatistic>) {
  const outputSimilarity = props.valueFormatted ? props.valueFormatted : props.value;
  return (
    <OSR value={outputSimilarity} />
  );
}