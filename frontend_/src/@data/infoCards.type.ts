import { BaseCollectionResponse } from "./base.type";

export interface InfoCard {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  left_image: string;
  text: string;
  right_image: string;
}

export type InfoCardResponse = BaseCollectionResponse<InfoCard>;
