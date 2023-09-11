'use client';

import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TaskFormfield } from "../TaskFormfield";
import ClientForm from "@/components/ui/clientForm";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { ReactElement, useCallback, useEffect, useMemo } from "react";
import { Ranking, runTasksAtom, useUserModel } from "@/lib/dataHooks";
import { snackbarWrapper, usePocketBase } from "@/lib/clientPocketbase";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ReviewDialogContentProps, useReviewDialog, rangeSteps, getRangeKeysFromTask } from ".";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ReviewDialogContent(props: ReviewDialogContentProps) {
  const form = useForm();
  const pb = usePocketBase();
  const user = useUserModel();
  const runTasks = useAtomValue(runTasksAtom);
  const { closeDialog, setDialogProps } = useReviewDialog();

  const {
    workspace, ranking
  } = props;
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
        const ranking = await snackbarWrapper(pb.collection('rankings').create(reqData), 'Review created') as never as Ranking;
        setDialogProps({ ranking });
      }
    } catch { }
  }, [workspace, user, pb, ranking, setDialogProps]);

  const onDelete = useCallback(async () => {
    try {
      await snackbarWrapper(pb.collection('rankings').delete(ranking?.id as string), 'Review deleted');
      closeDialog();
    } catch { }
  }, [pb, ranking, closeDialog]);

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
    <div className={cn(props.className)}>
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
          )} />
      </ClientForm>
      <p className="text-xs">You can navigate with <span className="font-bold">tab</span>, and {!ranking ? 'save' : 'update'} with <span className="font-bold">enter</span> or close with <span className="font-bold">esc</span></p>
      <DialogFooter>
        {ranking &&
          <AlertDialog>
            <AlertDialogTrigger asChild={true}>
              <Button variant='destructive'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                  This will permanently delete the review for this workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant='destructive' onClick={onDelete}>Delete</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        <Button type="submit" form={formId}>{!ranking ? 'Save' : 'Update'}</Button>
      </DialogFooter>
    </div>
  );
}
