import { BaseCollectionResponse, BaseRecord, Expandable } from './base.types';
import { UserRecord } from './users.types';

export interface RankingRecord
  extends Expandable<{ user: UserRecord }>,
    BaseRecord {
  user: string;
  workspace: string;
  points: { [k: string]: number };
  points_sum: { [k: string]: number };
  sum: number;
  comments: string;
}

export type RankingsResponse = BaseCollectionResponse<RankingRecord>;
