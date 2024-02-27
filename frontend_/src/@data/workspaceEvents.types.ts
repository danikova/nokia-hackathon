import { BaseCollectionResponse } from './base.types';

export interface WorkspaceEventRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  workspace: string;
  new_run_started: string;
}

export type WorkspaceEventsResponse =
  BaseCollectionResponse<WorkspaceEventRecord>;
