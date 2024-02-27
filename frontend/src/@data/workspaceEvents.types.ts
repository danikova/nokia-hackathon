import { BaseCollectionResponse, BaseRecord } from './base.types';

export interface WorkspaceEventRecord extends BaseRecord {
  workspace: string;
  new_run_started: string;
}

export type WorkspaceEventsResponse =
  BaseCollectionResponse<WorkspaceEventRecord>;
