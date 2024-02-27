import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ICellRendererParams } from 'ag-grid-community';
import { RunStatisticRecord } from '@/@data/customViews.types';

export function TaskStatisticRenderer({
  data,
}: ICellRendererParams<RunStatisticRecord>) {
  return (
    <div className="flex gap-1">
      <Tooltip>
        <span className="flex flex-[1_1_100px] items-center justify-center font-bold">
          <TooltipTrigger>{data?.number_of_evaluated_tasks}</TooltipTrigger>
        </span>
        <TooltipContent side="right">
          Total Evaluated Tasks
          <TooltipDescription>
            The total number of tasks that have been evaluated.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
      <span className="opacity-50">/</span>
      <span className="flex flex-[1_1_100px] items-center justify-center gap-1">
        <Tooltip>
          <span className="font-bold text-green-500">
            <TooltipTrigger>{data?.number_of_successful_tasks}</TooltipTrigger>
          </span>
          <TooltipContent side="right">
            Successful Tasks
            <TooltipDescription>
              The number of tasks that completed successfully without errors.
            </TooltipDescription>
          </TooltipContent>
        </Tooltip>
        {!!data?.number_of_failure_tasks && (
          <Tooltip>
            <span className="text-xs font-bold text-red-500">
              <TooltipTrigger>
                {'('}
                <span>{data?.number_of_failure_tasks}</span>
                {')'}
              </TooltipTrigger>
            </span>
            <TooltipContent side="right">
              Failed Tasks
              <TooltipDescription>
                The number of tasks that encountered failures or errors.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        )}
        {!!data?.number_of_timeouted_tasks && (
          <Tooltip>
            <span className="text-xs font-bold text-orange-500">
              <TooltipTrigger>
                {'('}
                <span>{data?.number_of_timeouted_tasks}</span>
                {')'}
              </TooltipTrigger>
            </span>
            <TooltipContent side="right">
              Timed Out Tasks
              <TooltipDescription>
                The number of tasks that exceeded their execution time limit and
                timed out.
              </TooltipDescription>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className="opacity-50">/</span>
      <Tooltip>
        <span className="flex flex-[1_1_100px] items-center justify-center font-bold text-red-500">
          <TooltipTrigger>{data?.number_of_flow_failure_tasks}</TooltipTrigger>
        </span>
        <TooltipContent side="right">
          Flow Anomalies
          <TooltipDescription>
            The number of tasks with irregularities in their execution flows,
            indicating deviations from the normal sequence of tasks.
          </TooltipDescription>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
