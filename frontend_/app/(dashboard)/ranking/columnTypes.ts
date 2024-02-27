'use client';

import { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { rankingValueGetterFactory } from './columnDefs';
import { CommentRenderer, CommentsRenderer, ReviewCountRenderer, TotalRenderer } from './renderers';

export function useColumnTypes() {
  return useMemo<{
    [key: string]: ColDef;
  }>(
    () => ({
      totalColumn: {
        headerName: 'Total',
        cellRenderer: TotalRenderer,
        valueGetter: rankingValueGetterFactory((data) => data.sum),
      },
      singleCommentColumn: {
        headerName: 'Comment',
        cellRenderer: CommentRenderer,
        valueGetter: rankingValueGetterFactory((data) => (!!data.comments ? 1 : 0), false),
      },
      reviewCountColumn: {
        headerName: 'Review Count',
        cellRenderer: ReviewCountRenderer,
        valueGetter: rankingValueGetterFactory(() => 1, false),
      },
      multipleCommentsColumn: {
        headerName: 'Comments',
        cellRenderer: CommentsRenderer,
        valueGetter: rankingValueGetterFactory((data) => (data.comments && data.comments !== '' ? 1 : 0), false),
      },
    }),
    []
  );
}
