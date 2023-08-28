'use client'

import { useForm } from "react-hook-form";
import { TaskFormfield } from "./TaskFormfield";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/ui/clientForm";
import { Textarea } from "@/components/ui/textarea";
import { snackbarWrapper, usePocketBase, useUserModel } from "@/lib/clientPocketbase";
import WorkspaceAvatar from "../settings/WorkspaceAvatar";
import { Ranking, RunTask, WorkspaceRanking } from "@/lib/dataHooks";
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

export type ReviewDialogProps = {
  data: WorkspaceRanking;
  runTasks?: RunTask[];
  ranking?: Ranking;
};

export default function ReviewDialog(props: ReviewDialogProps) {
  const pb = usePocketBase();
  const form = useForm();
  const {
    data: {
      expand: { workspace }
    },
    runTasks,
    ranking
  } = props;
  const user = useUserModel();
  const formId = useMemo(() => `create-form-for-${workspace.id}`, [workspace]);

  useEffect(() => {
    const defaultValue = Math.ceil(rangeSteps / 2);

    for (const runTask of runTasks ?? []) {
      for (const key of getRangeKeysFromTask(runTask)) {
        if (ranking?.points[key]) {
          form.setValue(key, ranking.points[key]);
        } else {
          form.setValue(key, defaultValue);
        }
      }
    }
  }, [runTasks, form, ranking]);

  useEffect(() => {
    if (ranking?.comments) {
      form.setValue('comments', ranking.comments);
    } else {
      form.setValue('comments', '');
    }
  }, [form, ranking]);

  const onSubmit = useCallback(async (data: any) => {
    const { comments, ...points } = data;

    const reqData = {
      "user": user?.id,
      "workspace": workspace.id,
      points,
      comments
    };
    try {
      if (ranking) {
        await snackbarWrapper(pb.collection('rankings').update(ranking.id, reqData), 'Review updated');
      } else {
        await snackbarWrapper(pb.collection('rankings').create(reqData), 'Review created');
      }
    } catch { }
  }, [workspace, user, pb, ranking]);

  const onDelete = useCallback(async () => {
    try {
      await snackbarWrapper(pb.collection('rankings').delete(ranking?.id as string), 'Review deleted');
    } catch { }
  }, [pb, ranking]);

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
          {!ranking ? 'Add' : 'Update'} Review
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
      <p className="text-xs">You can navigate with <span className="font-bold">tab</span>, and {!ranking ? 'save' : 'update'} with <span className="font-bold">enter</span> or close with <span className="font-bold">esc</span></p>
      <DialogFooter>
        {ranking && <Button variant='destructive' onClick={onDelete} >Delete</Button>}
        <Button type="submit" form={formId}>{!ranking ? 'Save' : 'Update'}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
