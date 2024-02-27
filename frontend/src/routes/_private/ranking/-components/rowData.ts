import { useWorkspaceRankings } from '@/@data/workspaceRankings';
import { WorkspaceRankingRecord } from '@/@data/workspaceRankings.types';
import { globalRankingAtom, hideEmptyWorkspacesAtom } from '@/atoms/ranking';
import { userAtom } from '@/atoms/user';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useRowData(onChange?: (data: WorkspaceRankingRecord) => void) {
  const user = useAtomValue(userAtom);
  const globalRankings = useAtomValue(globalRankingAtom);
  const hideEmptyWorkspaces = useAtomValue(hideEmptyWorkspacesAtom);
  const { data } = useWorkspaceRankings({}, onChange);
  const rowData = useMemo(() => data || [], [data]);
  const [finalRowData, _setFinalRowData] =
    useState<WorkspaceRankingRecord[]>(rowData);
  const setFinalRowData = useCallback(
    (list: WorkspaceRankingRecord[]) => {
      _setFinalRowData(
        list.filter(r => {
          if (hideEmptyWorkspaces) {
            return r.expand?.workspace?.repo_url;
          }
          return true;
        })
      );
    },
    [hideEmptyWorkspaces]
  );

  useEffect(() => {
    if (!globalRankings && user) {
      setFinalRowData(
        rowData.map(workspaceRanking => {
          const rankings =
            workspaceRanking.expand?.rankings?.filter(
              ranking => ranking.user === user.id
            ) || [];
          return {
            ...workspaceRanking,
            expand: {
              ...workspaceRanking.expand,
              rankings,
            },
            rankings: rankings.map(r => r.id),
          };
        })
      );
    } else {
      setFinalRowData(rowData);
    }
  }, [setFinalRowData, globalRankings, rowData, user]);

  return finalRowData;
}
