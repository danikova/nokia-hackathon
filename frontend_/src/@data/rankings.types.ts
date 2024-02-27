import { BaseCollectionResponse } from './base.types';
import { UserRecord } from './users.types';

export interface RankingRecord {
  id: string;
  user: string;
  workspace: string;
  points: { [k: string]: number };
  points_sum: { [k: string]: number };
  sum: number;
  comments: string;
  expand: {
    user: UserRecord;
  };
}

export type RankingsResponse = BaseCollectionResponse<RankingRecord>;
