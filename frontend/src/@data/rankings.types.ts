import { ExpandedBaseRecord } from './base.types';
import { UserRecord } from './users.types';

export interface RankingRecord
  extends ExpandedBaseRecord<{ user: UserRecord }> {
  user: string;
  workspace: string;
  points: { [k: string]: number };
  points_sum: { [k: string]: number };
  sum: number;
  comments: string;
}
