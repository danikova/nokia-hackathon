import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { globalRankingAtom } from './columnDefs';
import { useUserModel } from '@/lib/clientPocketbase';
import { WorkspaceRanking, useWorkspaceRankings } from '@/lib/dataHooks';

export function useRowData() {
  const globalRankings = useAtomValue(globalRankingAtom);
  const user = useUserModel();
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
