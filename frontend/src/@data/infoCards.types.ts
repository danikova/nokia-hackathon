import { BaseCollectionResponse, BaseRecord } from './base.types';

export interface InfoCardRecord extends BaseRecord {
  left_image: string;
  text: string;
  right_image: string;
}

export type InfoCardsResponse = BaseCollectionResponse<InfoCardRecord>;
