import { ExpandedBaseRecord } from './base.types';
import { RankingRecord } from './rankings.types';
import { WorkspaceRecord } from './workspaces.types';

export interface WorkspaceRankingRecord
  extends ExpandedBaseRecord<{
    workspace: WorkspaceRecord;
    rankings: RankingRecord[];
  }> {
  workspace: string;
  rankings: string[];
}
