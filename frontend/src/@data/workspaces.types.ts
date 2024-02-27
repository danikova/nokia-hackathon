import { BaseRecord } from './base.types';

export interface WorkspaceRecord extends BaseRecord {
  user: string;
  repo_url: string;
  last_valid_sha: string;
}
