import { BaseRecord } from './base.types';

export interface WorkspaceEventRecord extends BaseRecord {
  workspace: string;
  new_run_started: string;
}
