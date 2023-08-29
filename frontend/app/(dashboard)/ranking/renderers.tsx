'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { FaComment } from 'react-icons/fa6';
import ReviewDialog, { getRangeKeysFromTask } from './ReviewDialog';
import { ICellRendererParams } from 'ag-grid-community';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { Ranking, RunTask, WorkspaceRanking } from '@/lib/dataHooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function NumberRenderer({ num, className, hideDecimal = false }: { num: number, className?: string, hideDecimal?: boolean }) {
  const [wholeNumber, decimal] = useMemo(() => num.toFixed(2).split('.') as [string, string], [num]);

  if (isNaN(num)) return <span className="opacity-50">-</span>;
  return (
    <div className={cn(className)}>
      <span className="font-bold text-base">{wholeNumber}</span>
      {
        !hideDecimal && <>
          .
          <span className={cn(decimal === '00' && 'text-xs opacity-50')}>{decimal}</span>
        </>
      }
    </div>
  );
}

interface PointsRendererProps extends ICellRendererParams<WorkspaceRanking> {
  runTask: RunTask;
}

export function PointsRenderer({ data, runTask }: PointsRendererProps) {
  const sum = useMemo(() => {
    let sum = 0;
    let validCount = 0;
    const list = data?.expand.rankings || [];
    for (const ranking of list) {
      try {
        sum += ranking.points_sum[runTask.task_name];
        validCount += 1;
      } catch { }
    }
    return sum / validCount;
  }, [data, runTask]);

  return <NumberRenderer num={sum} />;
}

interface CommentRendererProps extends ICellRendererParams<WorkspaceRanking> { }

export function CommentRenderer({ data }: CommentRendererProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const rankingLength = useMemo(() => {
    return data?.expand.rankings?.length;
  }, [data]);

  if (!data) return null;

  if (rankingLength === 0)
    if (!data.expand.workspace?.repo_url)
      return (
        <div className="flex justify-end">
          <Dialog open={false}>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger disabled className="hidden-ag-cell-feature cursor-pointer line-through">Create new review</DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="max-w-md whitespace-break-spaces">This workspace doesn{"'"}t have a linked repository.</div>
              </TooltipContent>
            </Tooltip>
          </Dialog>
        </div>
      );
    else
      return (
        <div className="flex justify-end">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger className="hidden-ag-cell-feature cursor-pointer">Create new review</DialogTrigger>
            <ReviewDialog data={data} />
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
              <TooltipContent side="left">
                <div dangerouslySetInnerHTML={{ __html: comments }} className="max-w-md whitespace-break-spaces" />
              </TooltipContent>
            </Tooltip>
          )}
          <div className="placeholder" />
          <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
            <DialogTrigger className="hidden-ag-cell-feature cursor-pointer">Update review</DialogTrigger>
            <ReviewDialog data={data} ranking={ranking} />
          </Dialog>
        </div>
      );
    });
}

interface TotalRendererProps extends ICellRendererParams<WorkspaceRanking> { }

export function TotalRenderer({ data }: TotalRendererProps) {
  const sum = useMemo(() => {
    let sum = 0;
    const list = data?.expand.rankings || [];
    for (const ranking of list) {
      sum += ranking.sum;
    }
    return sum / list.length;
  }, [data]);

  return <NumberRenderer className='scale-[1.15] origin-left' num={sum} />;
}

interface ReviewCountRendererProps extends ICellRendererParams<WorkspaceRanking> { }

export function ReviewCountRenderer({ data }: ReviewCountRendererProps) {
  const len = useMemo(() => {
    const list = data?.expand.rankings || [];
    return list.length
  }, [data]);

  return <NumberRenderer className='scale-[1.15] origin-left' hideDecimal num={len} />;
}

interface CommentsRendererProps extends ICellRendererParams<WorkspaceRanking> { }

export function CommentsRenderer({ data }: CommentsRendererProps) {

  const comments = useMemo(() => {
    const list = data?.expand.rankings || [];
    const comments = list.map((ranking) => ({
      comments: ranking.comments,
      user: ranking.user
    }));
    return comments;
  }, [data]);

  if (comments.length === 0) return null;

  return <>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-[var(--ag-row-height)] flex items-center">
          <FaComment className="h-6 w-6" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        {
          comments.map((comment, i) => {
            if (!comment.comments) return null;
            return <DropdownMenuItem key={i} className='overflow-auto'>
              <Tooltip>
                <TooltipTrigger>
                  comments from {comment.user}
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div dangerouslySetInnerHTML={{ __html: comment.comments }} className="max-w-md whitespace-break-spaces" />
                </TooltipContent>
              </Tooltip>
            </DropdownMenuItem>
          })
        }
      </DropdownMenuContent>
    </DropdownMenu>
  </>
}