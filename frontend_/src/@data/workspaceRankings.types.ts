import { BaseCollectionResponse, BaseRecord, Expandable } from './base.types';
import { RankingRecord } from './rankings.types';
import { WorkspaceRecord } from './workspaces.types';

export interface WorkspaceRankingRecord
  extends Expandable<{
      workspace: WorkspaceRecord;
      rankings: RankingRecord[];
    }>,
    BaseRecord {
  workspace: string;
  rankings: string[];
}

export type WorkspaceRankingResponse =
  BaseCollectionResponse<WorkspaceRankingRecord>;
