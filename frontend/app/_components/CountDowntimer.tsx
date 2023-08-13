'use client'

import { cn } from "@/lib/utils";
import { usePocketBase } from "../_lib/clientPocketbase";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";

function useGlobals() {
  const pb = usePocketBase();
  const [globals, setGlobals] = useState<Record<string, string>>({});

  useEffect(() => {
    pb.collection('globals').getFullList().then((data) => {
      const _globals: any = {};
      for (const item of data) {
        _globals[item.key] = item.value;
      }
      setGlobals(_globals);
    });
  }, [pb]);

  return globals;
}

export default function CountDownTimer(props: any) {
  const globals = useGlobals();

  const endDate = useMemo(() => new Date(globals['event_end_date_time'] || '3000-01-01T00:00:00.000Z'), [globals]);
  const [deltaTime, setDeltaTime] = useState(new Date(
    endDate.getTime() - new Date().getTime()
  ));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDeltaTime(new Date(
        endDate.getTime() - now.getTime()
      ));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn("countdown font-mono text-2xl opacity-40 hover:opacity-90 cursor-default", props.className)}>
          <span style={{ "--value": deltaTime.getDay() } as React.CSSProperties}></span>:
          <span style={{ "--value": deltaTime.getHours() } as React.CSSProperties}></span>:
          <span style={{ "--value": deltaTime.getMinutes() } as React.CSSProperties}></span>:
          <span style={{ "--value": deltaTime.getSeconds() } as React.CSSProperties}></span>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-bold">Event ends</div>
          <div>{dayjs(endDate).fromNow()} ({endDate.toLocaleDateString()} {endDate.toLocaleTimeString()})</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}