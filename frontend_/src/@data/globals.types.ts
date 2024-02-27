import { BaseCollectionResponse, BaseRecord } from './base.types';

export interface GlobalRecord extends BaseRecord {
  key: string;
  value: string;
}

export type GlobalsResponse = BaseCollectionResponse<GlobalRecord>;

export type Globals = Record<string, string>;
