import { useMemo } from 'react';
import { ColDef } from 'ag-grid-community';
import { rankingValueGetterFactory } from './columnDefs';
import { TotalRenderer } from '@/components/renderers/total';
import { CommentRenderer } from '@/components/renderers/comment';
import { ReviewCountRenderer } from '@/components/renderers/reviewCount';
import { CommentsRenderer } from '@/components/renderers/comments';

export function useColumnTypes() {
  return useMemo<{
    [key: string]: ColDef;
  }>(
    () => ({
      totalColumn: {
        headerName: 'Total',
        cellRenderer: TotalRenderer,
        valueGetter: rankingValueGetterFactory(data => data.sum),
      },
      singleCommentColumn: {
        headerName: 'Comment',
        cellRenderer: CommentRenderer,
        valueGetter: rankingValueGetterFactory(
          data => (data.comments ? 1 : 0),
          false
        ),
      },
      reviewCountColumn: {
        headerName: 'Review Count',
        cellRenderer: ReviewCountRenderer,
        valueGetter: rankingValueGetterFactory(() => 1, false),
      },
      multipleCommentsColumn: {
        headerName: 'Comments',
        cellRenderer: CommentsRenderer,
        valueGetter: rankingValueGetterFactory(
          data => (data.comments && data.comments !== '' ? 1 : 0),
          false
        ),
      },
    }),
    []
  );
}
