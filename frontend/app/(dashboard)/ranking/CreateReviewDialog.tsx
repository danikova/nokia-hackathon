'use client'

import { useForm } from "react-hook-form";
import { TaskFormfield } from "./TaskFormfield";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/ui/clientForm";
import { Textarea } from "@/components/ui/textarea";
import { snackbarWrapper, usePocketBase, useUserModel } from "@/lib/clientPocketbase";
import WorkspaceAvatar from "../settings/WorkspaceAvatar";
import { RunTask, WorkspaceRanking } from "@/lib/dataHooks";
import { ReactElement, useCallback, useEffect, useMemo } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkspaceDetails, WorkspaceExtraDetails } from "../code/WorkspaceDetails";

export const rangeSteps = 7;

export function getRangeKeysFromTask(task: RunTask) {
  return [
    `${task.task_name}-implementation`,
    `${task.task_name}-functionality`,
    `${task.task_name}-prettiness`,
  ];
}

export type CreateReviewDialogProps = {
  data: WorkspaceRanking;
  runTasks?: RunTask[];
};

export default function CreateReviewDialog(props: CreateReviewDialogProps) {
  const pb = usePocketBase();
  const form = useForm();
  const {
    data: {
      expand: { workspace }
    },
    runTasks
  } = props;
  const user = useUserModel();
  const formId = useMemo(() => `create-form-for-${workspace.id}`, [workspace]);

  useEffect(() => {
    const defaultValue = Math.ceil(rangeSteps / 2);
    for (const runTask of runTasks ?? []) {
      for (const key of getRangeKeysFromTask(runTask)) {
        form.setValue(key, defaultValue);
      }
    }
  }, [runTasks, form]);

  useEffect(() => {
    form.setValue('comments', '');
  }, [form]);

  const onSubmit = useCallback(async (data: any) => {
    const { comments, ...points } = data;

    const reqData = {
      "user": user?.id,
      "workspace": workspace.id,
      points,
      comments
    };
    try {
      await snackbarWrapper(pb.collection('rankings').create(reqData), 'Review created');
    } catch { }
  }, [workspace, user, pb]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit(onSubmit)();
    }
  }, [form, onSubmit]);

  const additionalFormFields: ReactElement[] = useMemo(() => {
    return runTasks?.map((task) => (
      <TaskFormfield key={task.task_name} task={task} form={form} />
    )) ?? [];
  }, [runTasks, form]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Add Review
        </DialogTitle>
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <WorkspaceAvatar workspaceId={workspace.id} />
            {workspace.id}
          </p>
          <div className="flex gap-4">
            <WorkspaceDetails workspace={workspace} shortVersion />
            <WorkspaceExtraDetails workspace={workspace} />
          </div>
        </div>
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
      <p className="text-xs">You can navigate with <span className="font-bold">tab</span>, and save with <span className="font-bold">enter</span> or close with <span className="font-bold">esc</span></p>
      <DialogFooter>
        <Button type="submit" form={formId}>Save</Button>
      </DialogFooter>
    </DialogContent>
  );
}
