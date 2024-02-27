import { BaseRecord } from './base.types';

export interface RunResultRecord extends BaseRecord {
  workspace: string;
  run_id: string;
  task: string;
  execution_time: number;
  output_similarity: number;
  status: string;
  output: string;
  stderr: string;
  returncode: number;
  is_success: boolean;
  sha: string;
}
