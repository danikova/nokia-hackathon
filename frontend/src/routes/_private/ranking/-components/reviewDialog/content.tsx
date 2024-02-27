import { cn, sw } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TaskFormfield } from './taskFormfield';
import ClientForm from '@/components/ui/clientForm';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useReviewDialog, getRangeKeysFromTask, getRangeMax } from './utils';
import { ReviewDialogContentProps } from './type';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { userAtom } from '@/atoms/user';
import { useRunTasks } from '@/@data/runTasks';
import { pb } from '@/@data/client';
import { RankingRecord } from '@/@data/rankings.types';

export function ReviewDialogContent(props: ReviewDialogContentProps) {
  const form = useForm();
  const user = useAtomValue(userAtom);
  const { data: runTasks } = useRunTasks();
  const { closeDialog, setDialogProps } = useReviewDialog();

  const { workspace, ranking } = props;
  const formId = useMemo(() => `create-form-for-${workspace.id}`, [workspace]);

  useEffect(() => {
    for (const runTask of runTasks ?? []) {
      const rangeMax = getRangeMax(runTask.score_multipler || 1);
      const defaultValue = Math.ceil(rangeMax / 2);
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

  const onSubmit = useCallback(
    async (data: any) => {
      const { comments, ...points } = data;

      const reqData = {
        user: user?.id,
        workspace: workspace.id,
        points,
        comments,
      };
      try {
        if (ranking) {
          await sw(
            pb.collection('rankings').update(ranking.id, reqData),
            'Review updated'
          );
        } else {
          const ranking = (await sw(
            pb.collection('rankings').create(reqData),
            'Review created'
          )) as never as RankingRecord;
          setDialogProps({ ranking });
        }
      } catch (e) {
        console.error(e);
      }
    },
    [workspace, user, ranking, setDialogProps]
  );

  const onDelete = useCallback(async () => {
    try {
      await sw(
        pb.collection('rankings').delete(ranking?.id as string),
        'Review deleted'
      );
      closeDialog();
    } catch (e) {
      console.error(e);
    }
  }, [ranking, closeDialog]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (!e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit]
  );

  const additionalFormFields: ReactElement[] = useMemo(() => {
    return (
      (runTasks ?? []).map(task => (
        <TaskFormfield key={task.task_name} task={task} form={form} />
      )) ?? []
    );
  }, [runTasks, form]);

  return (
    <div className={cn(props.className)}>
      <ClientForm
        defaultFocus={true}
        id={formId}
        form={form}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        className="flex max-h-[70vh] flex-col gap-4 overflow-auto py-2 pl-2 pr-1"
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
      <p className="text-xs">
        You can navigate with <span className="font-bold">tab</span>, and{' '}
        {!ranking ? 'save' : 'update'} with{' '}
        <span className="font-bold">enter</span> or close with{' '}
        <span className="font-bold">esc</span>
      </p>
      <DialogFooter>
        {ranking && (
          <AlertDialog>
            <AlertDialogTrigger asChild={true}>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  review for this workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button type="submit" form={formId}>
          {!ranking ? 'Save' : 'Update'}
        </Button>
      </DialogFooter>
    </div>
  );
}
