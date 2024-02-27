import { BaseCollectionResponse, BaseRecord } from './base.types';

export interface RunTaskRecord extends BaseRecord {
  task_name: string;
  etalon_result: string;
  score_multipler: number;
}

export type RuntTasksResponse = BaseCollectionResponse<RunTaskRecord>;
