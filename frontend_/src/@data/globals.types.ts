import { BaseCollectionResponse } from "./base.types";

export interface GlobalRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  key: string;
  value: string;
}

export type GlobalsResponse = BaseCollectionResponse<GlobalRecord>;

export type Globals = Record<string, string>;
