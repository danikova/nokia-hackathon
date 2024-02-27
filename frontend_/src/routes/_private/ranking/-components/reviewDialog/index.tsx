import { useAtom } from "jotai";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReviewDialog } from "./utils";
import WorkspaceInfo from "./workspaceInfo";
import { WorkspaceDetails } from "../workspaceDetails";
import { workspaceInfoOpenAtom } from "@/atoms/workspace";
import { ReviewDialogContent } from "./content";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import WorkspaceAvatar from "@/routes/_private/settings/-components/workspaceAvatar";

export default function ReviewDialog() {
  const [isWorkspaceInfoOpen, setIsWorkspaceInfoOpen] = useAtom(
    workspaceInfoOpenAtom
  );
  const { state, closeDialog } = useReviewDialog();

  if (!state.props) return null;
  const {
    data: {
      expand: { workspace },
    },
    ranking,
  } = state.props;

  return (
    <Dialog open={state.open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>{!ranking ? "Add" : "Update"} Review</DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <WorkspaceAvatar workspace={workspace} />
              {workspace.id}
            </p>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <WorkspaceDetails workspace={workspace} shortVersion withSha />
              </div>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => setIsWorkspaceInfoOpen((old) => !old)}
                >
                  {!isWorkspaceInfoOpen ? (
                    <FaChevronRight />
                  ) : (
                    <FaChevronLeft />
                  )}
                </TooltipTrigger>
                <TooltipContent side="left">
                  Click to {!isWorkspaceInfoOpen ? "expand" : "collapse"}{" "}
                  workspace info
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogHeader>
        <div className="flex">
          <ReviewDialogContent
            {...{
              workspace,
              ranking,
            }}
            className="w-[500px]"
          />
          {isWorkspaceInfoOpen && <WorkspaceInfo workspace={workspace} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
