'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import FromNow from "@/lib/dayjs";
import { v4 as uuidv4 } from 'uuid';
import { atom, useAtom } from "jotai";
import { RunResult } from '../helpers';
import Code from "@/app/../components/Code";
import { Button } from "@/components/ui/button";
import humanizeDuration from "humanize-duration";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { FaCircle, FaCircleXmark, FaMaximize } from 'react-icons/fa6';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

const activeIdAtom = atom<null | string>(null);

type RunResultDisplayProps = {
  runResult: RunResult;
  hideOutput?: boolean;
  hideCreated?: boolean;
  hideTaskName?: boolean;
  className?: string,
  href?: string,
  defaultOpen?: boolean
  tabIndex?: number
}

export function getHumaneRunDuration(execution_time: number) {
  return shortEnglishHumanizer((execution_time || 0) * 1000, { maxDecimalPoints: 3 });
}

export default function RunResultDisplay({
  runResult, hideOutput = false, hideCreated = false, hideTaskName = false, className, href, defaultOpen: defaultIsOpen = false, tabIndex
}: RunResultDisplayProps) {
  const id = useMemo<string>(() => uuidv4(), []);
  const [activeId, setActiveId] = useAtom(activeIdAtom);
  const [showMore, setShowMore] = useState(defaultIsOpen);

  useEffect(() => {
    if (!hideOutput && !defaultIsOpen) {
      if (activeId && activeId !== id) setShowMore(false);
    }
  }, [id, activeId, hideOutput, defaultIsOpen]);

  return <div className={cn("flex flex-col gap-2 bg-[rgba(0,0,0,0.02)] rounded-md min-w-min p-2", className)}>
    {
      href ?
        <Link href={href} tabIndex={tabIndex}>
          <Header runResult={runResult} hideCreated={hideCreated} hideTaskName={hideTaskName} />
        </Link> :
        <Header runResult={runResult} hideCreated={hideCreated} hideTaskName={hideTaskName} />
    }
    {!hideOutput && <div className={cn("relative transition-all delay-150 duration-200", !showMore && 'h-[80px]', showMore && 'h-[400px]')}>
      <Code language="yaml" className='p-2 rounded-md overflow-auto absolute'>
        {runResult.output}
      </Code>
      <Button
        tabIndex={tabIndex}
        className="absolute right-2 bottom-2"
        onClick={(e) => {
          e.preventDefault();
          setShowMore((v) => !v);
          if (!showMore) setActiveId(id);
          else setActiveId(null);
        }}
      >
        {!showMore ? 'Show more' : 'Show less'}
      </Button>
      <Dialog>
        <DialogTrigger tabIndex={-1}>
          <FaMaximize className="w-5-h-5 absolute right-2 top-2" />
        </DialogTrigger>
        <DialogContent className="max-w-[80vw] h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {runResult.task} output
            </DialogTitle>
          </DialogHeader>
          <div className="h-[calc(80vh-18px-18px-(24px*2))]">
            <Code language="yaml" className='p-2 rounded-md overflow-auto'>
              {runResult.output}
            </Code>
          </div>
        </DialogContent>
      </Dialog>
    </div>}
  </div>;
}

function Header({ runResult, hideCreated = false, hideTaskName = false }: { runResult: RunResult, hideCreated?: boolean, hideTaskName?: boolean }) {
  return (
    <div className="flex justify-between gap-2 h-8 whitespace-nowrap p-2 rounded-md bg-[rgba(0,0,0,0.04)]">
      <div className="flex justify-start items-center gap-2">
        <StatusMark runResult={runResult} />
        {!hideTaskName && <div className="text-lg">{runResult.task}</div>}
      </div>
      <div className="flex justify-start items-center gap-2">
        {!hideCreated && <div>
          <FromNow date={runResult.created} />
        </div>}
        {!hideCreated && runResult.is_success && <span className="text-lg">/</span>}
        {runResult.is_success && <OutputSimilarity runResult={runResult} />}
        {runResult.is_success && <ExecutionTime runResult={runResult} />}
      </div>
    </div>
  );
}

function OutputSimilarity({ runResult }: { runResult: RunResult }) {
  const outputSimilarityPercent = Math.round(runResult.output_similarity * 100);
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1} className={cn({
        "text-green-500": 80 <= outputSimilarityPercent,
        "text-orange-500": 20 <= outputSimilarityPercent && outputSimilarityPercent < 80,
        "text-red-500": outputSimilarityPercent < 20,
      })}>
        {outputSimilarityPercent}%
      </TooltipTrigger>
      <TooltipContent>
        Output similarity was {outputSimilarityPercent}% <p className="text-xs opacity-80">(0% means no similarity, 100% means identical)</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ExecutionTime({ runResult }: { runResult: RunResult }) {
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1}>
        {getHumaneRunDuration(runResult.execution_time || 0)}
      </TooltipTrigger>
      <TooltipContent>
        Execution time was {runResult.execution_time} seconds
      </TooltipContent>
    </Tooltip>
  );
}

function StatusMark({ runResult }: { runResult: RunResult }) {
  const { status } = runResult;
  let state = {
    icon: <Skeleton className="h-5 w-5 rounded-full" />,
    tooltipText: ''
  };

  if (status === 'success')
    state = {
      icon: <FaCircle className="text-green-500 h-5 w-5" />,
      tooltipText: 'Success'
    };
  else if (status === 'fail')
    state = {
      icon: <FaCircle className="text-red-500 h-5 w-5" />,
      tooltipText: 'Unexpected error, please check the logs'
    };
  else if (status === 'timeout')
    state = {
      icon: <FaCircle className="text-orange-500 h-5 w-5" />,
      tooltipText: 'Timeout'
    };
  else if (status === 'flowFail')
    state = {
      icon: <FaCircleXmark className="text-red-500 h-5 w-5" />,
      tooltipText: 'Flow fail, please check the logs'
    };

  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1}>
        {state.icon}
      </TooltipTrigger>
      <TooltipContent side="right">
        {state.tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}