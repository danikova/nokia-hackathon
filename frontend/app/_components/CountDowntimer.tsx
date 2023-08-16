'use client'

import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useGlobals } from "../_lib/dataHooks";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


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
  const endDate = useMemo(() => new Date(globals['event_end_date_time'] || '3000-01-01T00:00:00.000Z'), [globals]);
  const { days, hours, minutes, seconds } = useCountdownTime(endDate);

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn("countdown font-mono text-2xl opacity-40 hover:opacity-90 cursor-default", props.className)}>
          <span style={{ "--value": days } as React.CSSProperties}></span>:
          <span style={{ "--value": hours } as React.CSSProperties}></span>:
          <span style={{ "--value": minutes } as React.CSSProperties}></span>:
          <span style={{ "--value": seconds } as React.CSSProperties}></span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-bold">Event ends {dayjs(endDate).fromNow()}</div>
          <div>({endDate.toLocaleDateString()} {endDate.toLocaleTimeString()})</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}