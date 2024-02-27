import { BaseCollectionResponse } from './base.types';

export interface RunResultRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
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

export type RunResultsResponse = BaseCollectionResponse<RunResultRecord>;
