import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaComment } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ICellRendererParams } from "ag-grid-community";
import { useReviewDialog } from "@/routes/_private/ranking/-components/reviewDialog/utils";
import { WorkspaceRankingRecord } from "@/@data/workspaceRankings.types";

export function CommentRenderer({
  data,
}: ICellRendererParams<WorkspaceRankingRecord>) {
  const { openDialog } = useReviewDialog();

  const rankingLength = useMemo(() => {
    return data?.expand?.rankings?.length || 0;
  }, [data]);

  if (!data) return null;

  if (rankingLength === 0)
    if (!data.expand.workspace?.repo_url)
      return (
        <div className="flex justify-end">
          <Dialog open={false}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="secondary"
                  className="hidden-ag-cell-feature cursor-pointer"
                >
                  Create new review
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="max-w-md whitespace-break-spaces">
                  This workspace doesn{"'"}t have a linked repository.
                </div>
              </TooltipContent>
            </Tooltip>
          </Dialog>
        </div>
      );
    else
      return (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            className="hidden-ag-cell-feature"
            onClick={() => openDialog({ data })}
          >
            Create new review
          </Button>
        </div>
      );

  if (rankingLength === 1)
    return (data?.expand?.rankings || []).map((ranking) => {
      const { comments } = ranking;
      return (
        <div key={ranking.id} className="flex justify-between">
          {comments && (
            <Tooltip>
              <TooltipTrigger>
                <div className="h-[var(--ag-row-height)] flex items-center">
                  <FaComment className="h-6 w-6" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div
                  dangerouslySetInnerHTML={{ __html: comments }}
                  className="max-w-md whitespace-break-spaces"
                />
              </TooltipContent>
            </Tooltip>
          )}
          <div className="placeholder" />
          <Button
            variant="secondary"
            className="hidden-ag-cell-feature"
            onClick={() => openDialog({ data, ranking })}
          >
            Update review
          </Button>
        </div>
      );
    });
}
