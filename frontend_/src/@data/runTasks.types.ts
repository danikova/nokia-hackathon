import { BaseCollectionResponse } from "./base.types";

export interface RunTaskRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  task_name: string;
  etalon_result: string;
  score_multipler: number;
}

export type RuntTasksResponse = BaseCollectionResponse<RunTaskRecord>;
