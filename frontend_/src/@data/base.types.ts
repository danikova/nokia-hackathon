export interface BaseCollectionResponse<T> {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}

export type Expandable<T> = { expand?: Partial<T> };
