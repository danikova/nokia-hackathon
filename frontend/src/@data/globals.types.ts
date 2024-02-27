import { BaseRecord } from './base.types';

export interface GlobalRecord extends BaseRecord {
  key: string;
  value: string;
}

export type Globals = Record<string, string>;
