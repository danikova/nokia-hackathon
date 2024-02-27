import { RunResultRecord } from './runResults.types';

export interface RunStatisticRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  number_of_runs: number;
  average_execution_time: number;
  average_output_similarity: number;
  average_output_length: number;
  number_of_evaluated_tasks: number;
  number_of_successful_tasks: number;
  number_of_failure_tasks: number;
  number_of_timeouted_tasks: number;
  number_of_flow_failure_tasks: number;
}

export type RunStatisticResponse = RunStatisticRecord[];

export type RunResultSumResponse = RunResultRecord[];
