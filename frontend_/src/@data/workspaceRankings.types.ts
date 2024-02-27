import { BaseCollectionResponse, Expandable } from './base.types';
import { RankingRecord } from './rankings.types';
import { WorkspaceRecord } from './workspaces.types';

export interface WorkspaceRankingRecord
  extends Expandable<{
    workspace: WorkspaceRecord;
    rankings: RankingRecord[];
  }> {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  workspace: string;
  rankings: string[];
}

export type WorkspaceRankingResponse =
  BaseCollectionResponse<WorkspaceRankingRecord>;
