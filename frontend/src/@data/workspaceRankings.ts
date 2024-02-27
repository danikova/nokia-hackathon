import { pb, useRealtime } from './client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isDefined, sw } from '@/lib/utils';
import { RankingRecord } from './rankings.types';
import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import { WorkspaceRankingRecord } from './workspaceRankings.types';
import { UserRecord } from './users.types';
import { defaults } from 'lodash';
import { RecordSubscription } from 'pocketbase';
import { enqueueSnackbar } from 'notistack';
import { query as rankingsQuery } from './rankings';

export const query = {
  queryKey: ['workspaceRankings'],
  queryFn: async () =>
    await sw(
      pb.collection('workspace_rankings').getFullList<WorkspaceRankingRecord>({
        expand: 'workspace, rankings',
        sort: 'created',
      })
    ),
};

export function useWorkspaceRankings(
  options?: Partial<UseQueryOptions<WorkspaceRankingRecord[], Error>>
) {
  return useQueries({
    queries: [
      {
        ...query,
        ...options,
      },
    ],
  });
}

export function useCombinedRankings(
  onChange?: (data: WorkspaceRankingRecord) => void,
  optionsWorkspaceRankingRecord?: Partial<
    UseQueryOptions<WorkspaceRankingRecord[], Error>
  >,
  optionsRankingRecord?: Partial<UseQueryOptions<RankingRecord[], Error>>
) {
  const [workspaceRankings, setWorkspaceRankings] = useState<
    WorkspaceRankingRecord[]
  >([]);
  const userMapping = useRef<Map<string, UserRecord>>(new Map());
  const results = useFetchMultipleQueries(
    setWorkspaceRankings,
    optionsWorkspaceRankingRecord,
    optionsRankingRecord
  );

  useOnFirstFetch(
    results,
    userMapping,
    setWorkspaceRankings,
    workspaceRankings
  );
  useOnRealtimeUpdate(userMapping, setWorkspaceRankings, onChange);

  return { data: workspaceRankings, results };
}

function useOnRealtimeUpdate(
  userMapping: React.MutableRefObject<Map<string, UserRecord>>,
  setWorkspaceRankings: React.Dispatch<
    React.SetStateAction<WorkspaceRankingRecord[]>
  >,
  onChange?: (data: WorkspaceRankingRecord) => void
) {
  const onRankingRealtime = useCallback(
    async (data: RecordSubscription<RankingRecord>) => {
      let user = userMapping.current.get(data.record.user);
      if (!user) {
        user = await pb
          .collection('users')
          .getOne<UserRecord>(data.record.user);
        userMapping.current.set(data.record.user, user);
      }
      data.record.expand = { user };

      try {
        setWorkspaceRankings(old => {
          const newWorkspaceRankings = [...old];
          const workspaceRankingId = newWorkspaceRankings.findIndex(
            item => item.workspace === data.record.workspace
          );
          if (workspaceRankingId !== -1) {
            const workspaceRanking = newWorkspaceRankings[workspaceRankingId];
            const expand = workspaceRanking.expand;
            defaults(expand, { rankings: [] });

            const rankingId: number =
              expand?.rankings?.findIndex(
                (item: RankingRecord) => item.id === data.record.id
              ) ?? -1;
            if (data.action === 'create') {
              // @ts-ignore
              expand.rankings.push(data.record);
            } else if (data.action === 'update' && rankingId !== -1) {
              //@ts-ignore
              expand.rankings[rankingId] = data.record;
            } else if (data.action === 'delete' && rankingId !== -1) {
              // @ts-ignore
              expand.rankings.splice(rankingId, 1);
            }
            onChange && onChange(workspaceRanking);
          }
          return newWorkspaceRankings;
        });
      } catch {
        enqueueSnackbar('Realtime update not working please refresh manually', {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
    [onChange, setWorkspaceRankings, userMapping]
  );
  useRealtime('rankings/*', onRankingRealtime);
}

function useOnFirstFetch(
  results: ReturnType<typeof useFetchMultipleQueries>,
  userMapping: React.MutableRefObject<Map<string, UserRecord>>,
  setWorkspaceRankings: React.Dispatch<
    React.SetStateAction<WorkspaceRankingRecord[]>
  >,
  workspaceRankings: WorkspaceRankingRecord[]
) {
  const [_, rs] = results; // eslint-disable-line
  const firstFetch = useRef(true);
  useEffect(() => {
    if (
      firstFetch.current &&
      workspaceRankings.length !== 0 &&
      rs.status === 'success'
    ) {
      const rankingMapping = new Map<string, RankingRecord>();
      for (const ranking of rs.data) {
        rankingMapping.set(ranking.id, ranking);
        if (ranking?.expand?.user)
          userMapping.current.set(ranking.user, ranking?.expand?.user);
      }

      setWorkspaceRankings(old => {
        return old.map(record => {
          const rankingIds = record.rankings;
          const rankings = rankingIds
            .map(id => rankingMapping.get(id))
            .filter(isDefined);
          record.expand = {
            ...record.expand,
            rankings,
          };
          return record;
        });
      });
      firstFetch.current = false;
    }
  }, [workspaceRankings, rs, setWorkspaceRankings]); // eslint-disable-line
}

function useFetchMultipleQueries(
  setWorkspaceRankings: React.Dispatch<
    React.SetStateAction<WorkspaceRankingRecord[]>
  >,
  optionsWorkspaceRankingRecord?: Partial<
    UseQueryOptions<WorkspaceRankingRecord[], Error>
  >,
  optionsRankingRecord?: Partial<UseQueryOptions<RankingRecord[], Error>>
) {
  return useQueries({
    queries: [
      {
        ...query,
        queryFn: async () => {
          const data = await sw(
            pb
              .collection('workspace_rankings')
              .getFullList<WorkspaceRankingRecord>({
                expand: 'workspace, rankings',
                sort: 'created',
              })
          );
          setWorkspaceRankings(data);
          return data;
        },
        ...optionsWorkspaceRankingRecord,
      },
      {
        ...rankingsQuery,
        ...optionsRankingRecord,
      },
    ],
  });
}
