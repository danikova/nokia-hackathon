import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { globalRankingAtom } from './columnDefs';
import { WorkspaceRanking, useUserModel, useWorkspaceRankings } from '@/lib/dataHooks';

export function useRowData() {
  const user = useUserModel();
  const globalRankings = useAtomValue(globalRankingAtom);
  const rowData = useWorkspaceRankings();
  const [finalRowData, setFinalRowData] = useState<WorkspaceRanking[]>(rowData);

  useEffect(() => {
    if (!globalRankings && user) {
      setFinalRowData(
        rowData.map((workspaceRanking) => {
          const rankings = workspaceRanking.expand.rankings.filter((ranking) => ranking.user === user.id);
          return {
            ...workspaceRanking,
            expand: {
              ...workspaceRanking.expand,
              rankings,
            },
            rankings: rankings.map((r) => r.id),
          };
        })
      );
    } else {
      setFinalRowData(rowData);
    }
  }, [globalRankings, rowData, user]);

  return finalRowData;
}
