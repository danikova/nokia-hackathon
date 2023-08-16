'use client'

import Link from "next/link";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import { atom, useAtom } from "jotai";
import { RunResult } from '../helpers';
import Code from "@/app/_components/Code";
import FromNow from "@/app/_components/dayjs";
import { Button } from "@/components/ui/button";
import humanizeDuration from "humanize-duration";
import { useEffect, useMemo, useState } from "react";
import { FaCircle, FaCircleXmark } from 'react-icons/fa6';

const activeIdAtom = atom<null | string>(null);

type RunResultDisplayProps = {
  runResult: RunResult;
  hideOutput?: boolean;
  hideCreated?: boolean;
  hideTaskName?: boolean;
  className?: string,
  href?: string,
  defaultOpen?: boolean
}

export function getHumaneRunDuration(execution_time: number) {
  return humanizeDuration((execution_time || 0) * 1000, { maxDecimalPoints: 3 });
}

export default function RunResultDisplay({
  runResult, hideOutput = false, hideCreated = false, hideTaskName = false, className, href, defaultOpen: defaultIsOpen = false
}: RunResultDisplayProps) {
  const id = useMemo<string>(() => uuidv4(), []);
  const [activeId, setActiveId] = useAtom(activeIdAtom);
  const [showMore, setShowMore] = useState(defaultIsOpen);

  useEffect(() => {
    if (!hideOutput && !defaultIsOpen) {
      if (activeId && activeId !== id) setShowMore(false);
    }
  }, [id, activeId, hideOutput, defaultIsOpen]);

  const header = useMemo(() => (
    <div className="flex justify-between gap-2 h-8 whitespace-nowrap p-2 rounded-md bg-[rgba(0,0,0,0.04)]">
      <div className="flex justify-start items-center gap-2">
        {
          runResult.is_success ? <div>
            {
              runResult.returncode !== 0 ?
                <FaCircle className="text-orange-500 h-5 w-5" /> :
                <FaCircle className="text-green-500 h-5 w-5" />
            }
          </div> : <div>
            <FaCircleXmark className="text-red-500 h-5 w-5" />
          </div>
        }
        {!hideTaskName && <div className="text-lg">{runResult.task}</div>}
      </div>
      <div className="flex justify-start items-center gap-2">
        {!hideCreated && <div>
          <FromNow date={runResult.created} />
        </div>}
        {!hideCreated && runResult.is_success && <span className="text-lg">/</span>}
        {runResult.is_success && <div>{getHumaneRunDuration(runResult.execution_time || 0)}</div>}
      </div>
    </div>
  ), [hideTaskName, runResult, hideCreated]);

  return <div className={cn("flex flex-col gap-2 bg-[rgba(0,0,0,0.02)] rounded-md min-w-min p-2", className)}>
    {href ? <Link href={href}>{header}</Link> : header}
    {!hideOutput && <div className={cn("relative transition-all delay-150 duration-200", !showMore && 'h-[80px]', showMore && 'h-[400px]')}>
      <Code language="yaml" className='p-2 rounded-md overflow-auto absolute'>
        {runResult.output}
      </Code>
      <Button
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
    </div>}
  </div>;
}