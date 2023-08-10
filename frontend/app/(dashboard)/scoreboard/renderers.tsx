
import React from 'react';
import { RunStatistic } from './page';
import { Workspace } from '../settings/page';
import 'ag-grid-community/styles/ag-grid.css';
import { ICellRendererParams } from 'ag-grid-community';
import WorkspaceAvatar from '../settings/WorkspaceAvatar';
import 'ag-grid-community/styles/ag-theme-alpine-no-font.min.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
          Number of tasks that were evaluated by the system
        </TooltipContent>
      </Tooltip>
      <span className='opacity-50'>/</span>
      <span className='flex-[1_1_100px] flex justify-center items-center'>
        <Tooltip>
          <span className='text-green-500 font-bold'>
            <TooltipTrigger>
              {data?.number_of_successful_tasks}
            </TooltipTrigger>
          </span>
          <TooltipContent side='right'>
            Number of tasks that were successfully evaluated by the system
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <span className='text-xs m-1 text-orange-500 font-bold'>
            <TooltipTrigger>
              {'('}
              <span>{data?.number_of_timeouted_tasks}</span>
              {')'}
            </TooltipTrigger>
          </span>
          <TooltipContent side='right'>
            Number of tasks that were successfully evaluated by the system but timed out
          </TooltipContent>
        </Tooltip>
      </span>
      <span className='opacity-50'>/</span>
      <Tooltip>
        <span className='flex-[1_1_100px] flex justify-center items-center text-red-500 font-bold'>
          <TooltipTrigger>
            {data?.number_of_failure_tasks}
          </TooltipTrigger>
        </span>
        <TooltipContent side='right'>
          Number of tasks that were the system noticed something changed in the .github folder
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
