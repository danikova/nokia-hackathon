import { workspaceDialogStateAtom } from "@/atoms/workspace";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { ReviewDialogProps } from "./type";
import { RunTaskRecord } from "@/@data/runTasks.types";

export const rangeMaxBase = 7;
export const getRangeMax = (scoreMultipler: number) => {
  return Math.max(rangeMaxBase, Math.round(rangeMaxBase * scoreMultipler));
};

export function getRangeKeysFromTask(task: RunTaskRecord) {
  return [
    `${task.task_name}-implementation`,
    `${task.task_name}-functionality`,
    `${task.task_name}-prettiness`,
  ];
}

export function useReviewDialog() {
  const [state, setState] = useAtom(workspaceDialogStateAtom);

  const openDialog = useCallback(
    (props: ReviewDialogProps) => {
      setState({ open: true, props });
    },
    [setState]
  );

  const closeDialog = useCallback(() => {
    setState({ open: false, props: null });
  }, [setState]);

  const setDialogProps = useCallback(
    (props: Partial<ReviewDialogProps>) => {
      if (state.props)
        setState({ ...state, props: { ...state.props, ...props } });
    },
    [state, setState]
  );

  return { openDialog, closeDialog, setDialogProps, state };
}
