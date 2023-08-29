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
        flex: 1,
        maxWidth: 120,
        headerName: 'Total',
        cellRenderer: TotalRenderer,
        valueGetter: rankingValueGetterFactory((data) => data.sum),
      },
      singleCommentColumn: {
        flex: 1,
        headerName: 'Comment',
        cellRenderer: CommentRenderer,
        valueGetter: rankingValueGetterFactory((data) => (!!data.comments ? 1 : 0), false),
      },
      reviewCountColumn: {
        flex: 1,
        headerName: 'Review Count',
        cellRenderer: ReviewCountRenderer,
        valueGetter: rankingValueGetterFactory(() => 1, false),
      },
      multipleCommentsColumn: {
        flex: 1,
        headerName: 'Comments',
        cellRenderer: CommentsRenderer,
        valueGetter: rankingValueGetterFactory((data) => (!!data.comments ? 1 : 0), false),
      },
    }),
    []
  );
}
