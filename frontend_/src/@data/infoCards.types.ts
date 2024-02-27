import { BaseCollectionResponse } from "./base.types";

export interface InfoCardRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  left_image: string;
  text: string;
  right_image: string;
}

export type InfoCardsResponse = BaseCollectionResponse<InfoCardRecord>;
