'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FaComment } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useReviewDialog } from './ReviewDialog';
import { WorkspaceRanking } from '@/lib/dataHooks';
import { ICellRendererParams } from 'ag-grid-community';
import { UserAvatar } from '@/app/_components/UserButton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

export function PointsRenderer({ value }: ICellRendererParams<WorkspaceRanking>) {
  return <NumberRenderer num={value} />;
}

export function TotalRenderer({ value }: ICellRendererParams<WorkspaceRanking>) {
  return <NumberRenderer className='scale-[1.15] origin-left' num={value} />;
}

export function ReviewCountRenderer({ value }: ICellRendererParams<WorkspaceRanking>) {
  return <NumberRenderer className='scale-[1.15] origin-left' hideDecimal num={value} />;
}

export function CommentRenderer({ data }: ICellRendererParams<WorkspaceRanking>) {
  const { openDialog } = useReviewDialog()

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
                <Button variant='secondary' className="hidden-ag-cell-feature cursor-pointer line-through">Create new review</Button>
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
          <Button
            variant='secondary'
            className='hidden-ag-cell-feature'
            onClick={() => openDialog({ data })}>
            Create new review
          </Button>
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
          <Button
            variant='secondary'
            className='hidden-ag-cell-feature'
            onClick={() => openDialog({ data, ranking })}>
            Update review
          </Button>
        </div>
      );
    });
}

export function CommentsRenderer({ data }: ICellRendererParams<WorkspaceRanking>) {

  const comments = useMemo(() => {
    const list = data?.expand.rankings || [];
    const comments = list.map((ranking) => ({
      comments: ranking.comments,
      user: ranking.expand.user
    }));
    return comments;
  }, [data]);

  if (comments.length === 0) return null;

  return <>
    <Popover>
      <PopoverTrigger>
        <div className="h-[var(--ag-row-height)] flex items-center">
          <FaComment className="h-6 w-6" />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-10 m-0 p-0 rounded-full box-content'>
        <ul className='w-10 p-1 flex flex-col items-center gap-1'>
          {
            comments.map((comment, i) => {
              if (!comment.comments) return null;
              return <li key={i} className='h-8 w-8'>
                <Tooltip>
                  <TooltipTrigger>
                    <UserAvatar user={comment.user} />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div dangerouslySetInnerHTML={{ __html: comment.comments }} className="max-w-md whitespace-break-spaces" />
                  </TooltipContent>
                </Tooltip>
              </li>
            })
          }
        </ul>
      </PopoverContent>
    </Popover>
  </>
}