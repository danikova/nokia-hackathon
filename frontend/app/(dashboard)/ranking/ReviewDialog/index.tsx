'use client'

import { useCallback } from "react";
import { atom, useAtom } from "jotai";
import WorkspaceInfo from "./WorkspaceInfo";
import { ReviewDialogContent } from "./ReviewDialogContent";
import WorkspaceAvatar from "../../settings/WorkspaceAvatar";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Ranking, RunTask, Workspace, WorkspaceRanking } from "@/lib/dataHooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceDetails, WorkspaceExtraDetails } from "../../_code/WorkspaceDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
});
const workspaceInfoOpenAtom = atom(false);

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

export type ReviewDialogContentProps = {
  workspace: Workspace;
  ranking?: Ranking;
  className?: string;
}

export default function ReviewDialog() {
  const [isWorkspaceInfoOpen, setIsWorkspaceInfoOpen] = useAtom(workspaceInfoOpenAtom);
  const { state, closeDialog } = useReviewDialog();

  if (!state.props) return null;
  const {
    data: {
      expand: { workspace }
    },
    ranking
  } = state.props;

  return (
    <Dialog open={state.open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            {!ranking ? 'Add' : 'Update'} Review
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <WorkspaceAvatar workspaceId={workspace.id} />
              {workspace.id}
            </p>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <WorkspaceDetails workspace={workspace} shortVersion />
                <WorkspaceExtraDetails workspace={workspace} />
              </div>
              <Tooltip>
                <TooltipTrigger tabIndex={-1} onClick={() => setIsWorkspaceInfoOpen(old => !old)}>
                  {!isWorkspaceInfoOpen ? <FaChevronRight /> : <FaChevronLeft />}
                </TooltipTrigger>
                <TooltipContent side="left">
                  Click to {!isWorkspaceInfoOpen ? 'expand' : 'collapse'} workspace info
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogHeader>
        <div className="flex">
          <ReviewDialogContent {...{
            workspace, ranking
          }} className="w-[500px]" />
          {isWorkspaceInfoOpen && <WorkspaceInfo workspace={workspace} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
