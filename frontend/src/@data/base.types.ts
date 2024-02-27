import { RecordModel } from 'pocketbase';

export interface BaseRecord extends RecordModel {}

export interface ExpandedBaseRecord<T> extends BaseRecord {
  expand?: Partial<T>;
}
