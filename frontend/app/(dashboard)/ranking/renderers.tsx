'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { FaComment } from 'react-icons/fa6';
import { getRangeKeysFromTask } from './ReviewDialog';
import { ICellRendererParams } from 'ag-grid-community';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { Ranking, RunTask, WorkspaceRanking } from '@/lib/dataHooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PointsRendererProps extends ICellRendererParams<WorkspaceRanking> {
  runTask: RunTask;
}

function getTaskAvgFromRanking(ranking: Ranking, runTask: RunTask) {
  const keys = getRangeKeysFromTask(runTask);
  let sum = 0;
  let counter = 0;
  for (const [key, value] of Object.entries(ranking.points)) {
    if (keys.includes(key)) {
      sum += value;
      counter += 1;
    }
  }
  return sum / counter;
}

export function PointsRenderer({ data, runTask }: PointsRendererProps) {
  const sum = useMemo(() => {
    let sum = 0;
    const list = data?.expand.rankings || [];
    for (const ranking of list) {
      sum += getTaskAvgFromRanking(ranking, runTask);
    }
    return sum / list.length;
  }, [data, runTask]);
  const [wholeNumber, decimal] = useMemo(() => sum.toFixed(2).split('.') as [string, string], [sum]);

  if (isNaN(sum)) return <span className="opacity-50">-</span>;
  return (
    <div>
      <span className="font-bold text-base">{wholeNumber}</span>.
      <span className={cn(decimal === '00' && 'text-xs opacity-50')}>{decimal}</span>
    </div>
  );
}

interface CommentRendererProps extends ICellRendererParams<WorkspaceRanking> {
  dialogComponent: () => ReactElement;
  dialogProps: any;
}

export function CommentRenderer(props: CommentRendererProps) {
  const { dialogComponent: DC, dialogProps, data } = props;
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const rankingLength = useMemo(() => {
    return data?.expand.rankings?.length;
  }, [data]);

  if (rankingLength === 0)
    return (
      <div className="flex justify-end">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger className="hidden-ag-cell-feature cursor-pointer">Create new review</DialogTrigger>
          <DC data={props.data} {...dialogProps} />
        </Dialog>
      </div>
    );

  if (rankingLength === 1)
    return data?.expand.rankings.map((ranking) => {
      const { comments } = ranking;
      return (
        <div key={ranking.id} className="flex justify-between">
          {comments && (
            <Tooltip>
              <TooltipTrigger>
                <div className="h-[var(--ag-row-height)] flex items-center">
                  <FaComment className="h-6 w-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div dangerouslySetInnerHTML={{ __html: comments }} className="max-w-md whitespace-break-spaces" />
              </TooltipContent>
            </Tooltip>
          )}
          <div className="placeholder" />
          <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
            <DialogTrigger className="hidden-ag-cell-feature cursor-pointer">Update review</DialogTrigger>
            <DC data={props.data} ranking={ranking} {...dialogProps} />
          </Dialog>
        </div>
      );
    });
}
