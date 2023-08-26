'use client';

import { RunTask } from "@/lib/dataHooks";
import { Label } from "@/components/ui/label";
import { CSSProperties, ReactElement } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FaCogs, FaWrench, FaCrown } from 'react-icons/fa';
import { FormField, FormLabel } from "@/components/ui/form";
import { getRangeKeysFromTask, rangeSteps } from "./ReviewModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TaskFormfield({ task, form }: { task: RunTask; form: any; }) {
  const [
    implementationKey, functionalityKey, prettinessKey
  ] = getRangeKeysFromTask(task);

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
              icon={<Tooltip>
                <TooltipTrigger tabIndex={-1}>
                  <FaCogs className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent side='left'>
                  Implementation
                </TooltipContent>
              </Tooltip>} />
          )} />
        <FormField
          key={functionalityKey}
          name={functionalityKey}
          control={form.control}
          render={({ field }: any) => (
            <IconRange
              field={field}
              icon={<Tooltip>
                <TooltipTrigger tabIndex={-1}>
                  <FaWrench className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent side='left'>
                  Functionality
                </TooltipContent>
              </Tooltip>} />
          )} />
        <FormField
          key={prettinessKey}
          name={prettinessKey}
          control={form.control}
          render={({ field }: any) => (
            <IconRange
              field={field}
              icon={<Tooltip>
                <TooltipTrigger tabIndex={-1}>
                  <FaCrown className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent side='left'>
                  Prettiness
                </TooltipContent>
              </Tooltip>} />
          )} />
      </div>
    </>
  );
}

function IconRange({ field, icon }: { field: ControllerRenderProps<any>; icon: ReactElement; }) {
  return (
    <div className="flex gap-2 w-full h-6">
      <div className="flex-[0_0_12px]">
        <Label className="text-lg font-bold">{field.value}</Label>
      </div>
      <div className="flex-auto">
        <input
          className="range"
          type="range"
          step="1"
          min={1}
          max={rangeSteps}
          style={{
            '--range-shdw': 'var(--primary)'
          } as CSSProperties}
          {...field}
          onChange={(event) => field.onChange(+event.target.value)} />
      </div>
      <div className="flex flex-[0_0_20px]">
        {icon}
      </div>
    </div>
  );
}
