"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RunTask } from "@/lib/dataHooks";
import { Label } from "@/components/ui/label";
import { CSSProperties, ReactElement } from "react";
import { getRangeKeysFromTask, getRangeMax } from ".";
import { ControllerRenderProps } from "react-hook-form";
import { FaCogs, FaWrench, FaCrown } from "react-icons/fa";
import { FormField, FormLabel } from "@/components/ui/form";

export function TaskFormfield({ task, form }: { task: RunTask; form: any }) {
  const [implementationKey, functionalityKey, prettinessKey] =
    getRangeKeysFromTask(task);

  return (
    <>
      <FormLabel>{task.task_name}</FormLabel>
      <div className="flex flex-col gap-2">
        <FormField
          key={implementationKey}
          name={implementationKey}
          control={form.control}
          render={({ field }: any) => (
            <IconRange
              field={field}
              icon={
                <Tooltip>
                  <TooltipTrigger>
                    <FaCogs className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent side="left">Implementation</TooltipContent>
                </Tooltip>
              }
              scoreMultipler={task.score_multipler || 1}
            />
          )}
        />
        <FormField
          key={functionalityKey}
          name={functionalityKey}
          control={form.control}
          render={({ field }: any) => (
            <IconRange
              field={field}
              icon={
                <Tooltip>
                  <TooltipTrigger>
                    <FaWrench className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent side="left">Functionality</TooltipContent>
                </Tooltip>
              }
              scoreMultipler={task.score_multipler || 1}
            />
          )}
        />
        <FormField
          key={prettinessKey}
          name={prettinessKey}
          control={form.control}
          render={({ field }: any) => (
            <IconRange
              field={field}
              icon={
                <Tooltip>
                  <TooltipTrigger>
                    <FaCrown className="w-5 h-5" />
                  </TooltipTrigger>
                  <TooltipContent side="left">Prettiness</TooltipContent>
                </Tooltip>
              }
              scoreMultipler={task.score_multipler || 1}
            />
          )}
        />
      </div>
    </>
  );
}

function IconRange({
  field,
  icon,
  scoreMultipler,
}: {
  field: ControllerRenderProps<any>;
  icon: ReactElement;
  scoreMultipler: number;
}) {
  const rangeMax = getRangeMax(scoreMultipler);

  return (
    <div className="flex gap-2 w-full h-6">
      <div className="flex-[0_0_24px]">
        <Label className="text-lg font-bold">{field.value}</Label>
      </div>
      <div className="flex-auto">
        <input
          className="range"
          type="range"
          step="1"
          min={1}
          max={rangeMax}
          style={
            {
              "--range-shdw": "var(--primary)",
            } as CSSProperties
          }
          {...field}
          onChange={(event) => field.onChange(+event.target.value)}
        />
      </div>
      <div className="flex flex-[0_0_24px] justify-end">{icon}</div>
    </div>
  );
}
