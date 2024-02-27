import { RankingRecord } from "@/@data/rankings.types";
import { WorkspaceRankingRecord } from "@/@data/workspaceRankings.types";
import { WorkspaceRecord } from "@/@data/workspaces.types";

export interface ReviewDialogProps {
  data: WorkspaceRankingRecord;
  ranking?: RankingRecord;
}

export interface ReviewDialogContentProps {
  workspace: WorkspaceRecord;
  ranking?: RankingRecord;
  className?: string;
}
