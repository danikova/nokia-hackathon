import { useAtomValue } from "jotai";
import { globalRankingAtom, hideEmptyWorkspacesAtom } from "./atoms";
import { useCallback, useEffect, useState } from "react";
import {
  WorkspaceRanking,
  useUserModel,
  useWorkspaceRankings,
} from "@/lib/dataHooks";

export function useRowData(onChange?: (data: WorkspaceRanking) => void) {
  const user = useUserModel();
  const globalRankings = useAtomValue(globalRankingAtom);
  const hideEmptyWorkspaces = useAtomValue(hideEmptyWorkspacesAtom);
  const rowData = useWorkspaceRankings(onChange);
  const [finalRowData, _setFinalRowData] =
    useState<WorkspaceRanking[]>(rowData);
  const setFinalRowData = useCallback(
    (list: WorkspaceRanking[]) => {
      _setFinalRowData(
        list.filter((r) => {
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
        rowData.map((workspaceRanking) => {
          const rankings =
            workspaceRanking.expand?.rankings?.filter(
              (ranking) => ranking.user === user.id
            ) || [];
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
  }, [setFinalRowData, globalRankings, rowData, user]);

  return finalRowData;
}
