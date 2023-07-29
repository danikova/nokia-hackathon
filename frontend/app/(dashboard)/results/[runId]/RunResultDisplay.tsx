'use client'

import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import { atom, useAtom } from "jotai";
import { RunResult } from '../helpers';
import Code from "@/app/_components/Code";
import humanizeDuration from "humanize-duration";
import Button from "@/app/_components/inputs/Button";
import { useEffect, useMemo, useState } from "react";
import { FaCircle, FaCircleXmark } from 'react-icons/fa6';

const activeIdAtom = atom<null | string>(null);

export default function RunResultDisplay({
  runResult, hideOutput = false, hideTaskName = false, className, href, defaultOpen: defaultIsOpen = false
}: { runResult: RunResult; hideOutput?: boolean; hideTaskName?: boolean; className?: string, href?: string, defaultOpen?: boolean }) {
  const id = useMemo<string>(() => uuidv4(), []);
  const [activeId, setActiveId] = useAtom(activeIdAtom);
  const [showMore, setShowMore] = useState(defaultIsOpen);

  useEffect(() => {
    if (!hideOutput && activeId && activeId !== id) setShowMore(false);
  }, [id, activeId, hideOutput])

  const header = useMemo(() => (
    <div className="flex justify-between gap-2 h-8 whitespace-nowrap p-2 rounded-md bg-[rgba(0,0,0,0.04)]">
      <div className="flex justify-start items-center gap-2">
        {runResult.is_success ? <div><FaCircle className="text-green-500 h-5 w-5" /></div> : <div><FaCircleXmark className="text-red-500 h-5 w-5" /></div>}
        {!hideTaskName && <div className="text-lg">{runResult.task}</div>}
      </div>
      <div className="flex justify-start items-center gap-2">
        <div>{dayjs(new Date(runResult.created)).fromNow()}</div>
        {
          runResult.is_success && <>
            <span className="text-lg">/</span>
            <div>{humanizeDuration((runResult.execution_time || 0) * 1000)}</div>
          </>
        }
      </div>
    </div>
  ), [hideTaskName, runResult])

  return <div className={clsx("flex flex-col gap-2 bg-[rgba(0,0,0,0.02)] rounded-md min-w-min p-2", className)}>
    {href ? <Link href={href}>{header}</Link> : header}
    {!hideOutput && <div className={clsx("relative transition-all delay-150 duration-200", !showMore && 'h-[80px]', showMore && 'h-[400px]')}>
      <Code language="yaml" className='p-2 rounded-md overflow-auto absolute'>
        {runResult.output}
      </Code>
      <Button
        variant='call-to-action'
        className="absolute right-2 bottom-2"
        onClick={(e: Event) => {
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
