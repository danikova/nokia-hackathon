'use client'

import { cn } from "@/lib/utils";
import FromNow from "@/lib/dayjs";
import { useGlobals } from "@/lib/dataHooks";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

function useCountdownTime(endDate: Date) {
  const [distance, setDeltaTime] = useState(
    endDate.getTime() - new Date().getTime()
  );
  var days = useMemo(() => Math.floor(distance / (1000 * 60 * 60 * 24)), [distance]);
  var hours = useMemo(() => Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), [distance]);
  var minutes = useMemo(() => Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), [distance]);
  var seconds = useMemo(() => Math.floor((distance % (1000 * 60)) / 1000), [distance]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDeltaTime(endDate.getTime() - now.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return { days, hours, minutes, seconds };
}

export default function CountDownTimer(props: any) {
  const globals = useGlobals();
  const endDate = useMemo(() => new Date(globals['event_end_date_time']), [globals]);
  const isValidEndDate = useMemo(() => isValidDate(endDate), [endDate]);
  const isEnded = useMemo(() => endDate.getTime() < new Date().getTime(), [endDate]);
  const { days, hours, minutes, seconds } = useCountdownTime(endDate);

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn("countdown font-mono text-2xl opacity-40 hover:opacity-90 cursor-default", props.className)}>
          <span style={{ "--value": !isEnded ? (days || 0) : 0 } as React.CSSProperties}></span>:
          <span style={{ "--value": !isEnded ? (hours || 0) : 0 } as React.CSSProperties}></span>:
          <span style={{ "--value": !isEnded ? (minutes || 0) : 0 } as React.CSSProperties}></span>:
          <span style={{ "--value": !isEnded ? (seconds || 0) : 0 } as React.CSSProperties}></span>
        </span>
      </TooltipTrigger>
      <TooltipContent hidden={!isValidEndDate}>
        <div className="text-sm">
          {
            isEnded
              ? <div className="font-bold">Event has ended</div>
              : <>
                <div className="font-bold">Event ends <FromNow date={endDate} /></div>
                <div>({endDate.toLocaleDateString()} {endDate.toLocaleTimeString()})</div>
              </>
          }
        </div>
      </TooltipContent>
    </Tooltip>
  );
}