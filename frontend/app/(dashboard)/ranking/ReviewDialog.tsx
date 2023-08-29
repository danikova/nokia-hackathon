'use client'

import { useForm } from "react-hook-form";
import { TaskFormfield } from "./TaskFormfield";
import { Button } from "@/components/ui/button";
import ClientForm from "@/components/ui/clientForm";
import { Textarea } from "@/components/ui/textarea";
import { atom, useAtom, useAtomValue } from "jotai";
import WorkspaceAvatar from "../settings/WorkspaceAvatar";
import { ReactElement, useCallback, useEffect, useMemo } from "react";
import { WorkspaceDetails, WorkspaceExtraDetails } from "../code/WorkspaceDetails";
import { Ranking, RunTask, WorkspaceRanking, runTasksAtom } from "@/lib/dataHooks";
import { snackbarWrapper, usePocketBase, useUserModel } from "@/lib/clientPocketbase";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const rangeSteps = 7;

export function getRangeKeysFromTask(task: RunTask) {
  return [
    `${task.task_name}-implementation`,
    `${task.task_name}-functionality`,
    `${task.task_name}-prettiness`,
  ];
}

const dialogStateAtom = atom({
  open: false,
  props: null as null | ReviewDialogProps
})

export function useReviewDialog() {
  const [state, setState] = useAtom(dialogStateAtom);

  const openDialog = useCallback((props: ReviewDialogProps) => {
    setState({ open: true, props })
  }, [setState]);

  const closeDialog = useCallback(() => {
    setState({ open: false, props: null })
  }, [setState]);

  const setDialogProps = useCallback((props: Partial<ReviewDialogProps>) => {
    if (state.props)
      setState({ ...state, props: { ...state.props, ...props } })
  }, [state, setState]);

  return { openDialog, closeDialog, setDialogProps, state };
}

export type ReviewDialogProps = {
  data: WorkspaceRanking;
  ranking?: Ranking;
};

export default function ReviewDialog() {
  const state = useAtomValue(dialogStateAtom);
  if (!state.props) return null;
  return <ReviewDialogHelper {...state.props} />;
}

function ReviewDialogHelper(props: ReviewDialogProps) {
  const { state, closeDialog, setDialogProps } = useReviewDialog();
  const pb = usePocketBase();
  const form = useForm();
  const {
    data: {
      expand: { workspace }
    },
    ranking
  } = props;
  const runTasks = useAtomValue(runTasksAtom);
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
    <Dialog open={state.open} onOpenChange={closeDialog}>
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
          {ranking &&
            <AlertDialog>
              <AlertDialogTrigger asChild={true}>
                <Button variant='destructive' >Delete</Button>
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
            </AlertDialog>
          }
          <Button type="submit" form={formId}>{!ranking ? 'Save' : 'Update'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
