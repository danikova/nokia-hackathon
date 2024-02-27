import { BaseCollectionResponse } from "./base.types";
import { RankingRecord } from "./rankings.types";
import { WorkspaceRecord } from "./workspaces.types";

export interface WorkspaceRankingRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  workspace: string;
  rankings: string[];
  expand: {
    workspace: WorkspaceRecord;
    rankings: RankingRecord[];
  };
}

export type WorkspaceRankingResponse =
  BaseCollectionResponse<WorkspaceRankingRecord>;
