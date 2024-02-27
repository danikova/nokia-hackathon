import { BaseCollectionResponse } from './base.types';

export interface WorkspaceRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  user: string;
  repo_url: string;
  last_valid_sha: string;
}

export type WorkspacesResponse = BaseCollectionResponse<WorkspaceRecord>;
