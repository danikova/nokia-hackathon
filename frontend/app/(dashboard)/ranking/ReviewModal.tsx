'use client'

import { useForm } from "react-hook-form";
import { TaskFormfield } from "./TaskFormfield";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/ui/clientForm";
import { Textarea } from "@/components/ui/textarea";
import WorkspaceAvatar from "../settings/WorkspaceAvatar";
import { Ranking, RunTask, WorkspaceRanking } from "@/lib/dataHooks";
import { ReactElement, useCallback, useEffect, useMemo } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const rangeSteps = 7;

export function getRangeKeysFromTask(task: RunTask) {
  return [
    `${task.task_name}-implementation`,
    `${task.task_name}-functionality`,
    `${task.task_name}-prettiness`,
  ];
}

export type ReviewDialogProps = {
  data: WorkspaceRanking;
  ranking?: Ranking;
  runTasks?: RunTask[];
};

export default function ReviewDialog(props: ReviewDialogProps) {
  const { data, runTasks } = props;
  const form = useForm();

  const isNewReview = useMemo(() => !!props.ranking, [props.ranking]);
  const formId = useMemo(() => `review-form-for-${data.workspace}`, [data.workspace]);

  const additionalFormFields: ReactElement[] = useMemo(() => {
    return runTasks?.map((task) => (
      <TaskFormfield key={task.task_name} task={task} form={form} />
    )) ?? [];
  }, [runTasks, form]);

  useEffect(() => {
    const defaultValue = Math.ceil(rangeSteps / 2);
    for (const runTask of runTasks ?? []) {
      for (const key of getRangeKeysFromTask(runTask)) {
        form.setValue(key, defaultValue);
      }
    }
  }, [runTasks, form]);

  const onSubmit = useCallback((data: any) => {
    console.log(data);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit(onSubmit)();
    }
  }, [form, onSubmit]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isNewReview ? 'Edit' : 'Add'} Review
        </DialogTitle>
        <DialogDescription>
          <div className="flex items-center gap-2">
            <WorkspaceAvatar workspaceId={data.workspace} />
            {data.workspace}
          </div>
        </DialogDescription>
      </DialogHeader>
      <ClientForm
        id={formId}
        form={form}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-4 overflow-auto max-h-[70vh] py-2 pl-2 pr-1"
      >
        <>{additionalFormFields}</>
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ClientForm>
      <DialogFooter>
        <Button type="submit" form={formId}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
