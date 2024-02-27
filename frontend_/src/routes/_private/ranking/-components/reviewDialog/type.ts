import { WorkspaceRankingRecord } from "@/@data/WorkspaceRankingRecord";
import { RankingRecord } from "@/@data/rankings.type";
import { WorkspaceRecord } from "@/@data/workspaces.type";

export interface ReviewDialogProps {
  data: WorkspaceRankingRecord;
  ranking?: RankingRecord;
}

export interface ReviewDialogContentProps {
  workspace: WorkspaceRecord;
  ranking?: RankingRecord;
  className?: string;
}
