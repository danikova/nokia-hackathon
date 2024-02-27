import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaComment } from "react-icons/fa6";
import { Stack } from "@/components/ui/stack";
import { ICellRendererParams } from "ag-grid-community";
import { UserAvatar } from "../userAvatar";
import { WorkspaceRankingRecord } from "@/@data/workspaceRankings.types";

const maxCommentBubble = 4;
export function CommentsRenderer({
  data,
}: ICellRendererParams<WorkspaceRankingRecord>) {
  const comments = useMemo(() => {
    const list = data?.expand?.rankings || [];
    const comments = list
      .map((ranking) => ({
        comments: ranking.comments,
        user: ranking.expand.user,
      }))
      .filter((c) => !!c.comments);
    return comments;
  }, [data]);
  const commentsLength = useMemo(() => comments.length, [comments]);

  if (commentsLength === 0) return null;

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="h-[var(--ag-row-height)] flex items-center">
            <Stack>
              {Array.from({
                length: Math.min(commentsLength, maxCommentBubble),
              }).map((_, i) => {
                return (
                  <div key={i} className="relative h-6 w-6">
                    <FaComment className="absolute h-6 w-6 scale-110 text-background" />
                    <FaComment
                      className="absolute h-6 w-6"
                      style={{ opacity: (10 - i) / 10 }}
                    />
                  </div>
                );
              })}
              {commentsLength > maxCommentBubble && (
                <div className="h-6 w-6 flex items-center justify-center pl-4">
                  <span className="text-base">
                    +{commentsLength - maxCommentBubble}
                  </span>
                </div>
              )}
            </Stack>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-10 m-0 p-0 rounded-full box-content">
          <ul className="w-10 p-1 flex flex-col items-center gap-2">
            {comments.map((comment, i) => {
              return (
                <li key={i} className="h-8 w-8">
                  <Tooltip>
                    <TooltipTrigger>
                      <UserAvatar
                        user={comment.user}
                        className="ring-1 ring-offset-1 ring-primary/25"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div
                        dangerouslySetInnerHTML={{ __html: comment.comments }}
                        className="max-w-md whitespace-break-spaces"
                      />
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </>
  );
}
