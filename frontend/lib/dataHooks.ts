import { v4 as uuidv4 } from 'uuid';
import { atom, useAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { Record, RecordFullListQueryParams } from 'pocketbase';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { snackbarWrapper, usePocketBase, userModelAtom } from './clientPocketbase';

function getFirstElementFromList<T>(data: T[]): T | null {
  return data.length !== 0 ? data[0] : null;
}

function usePbGetFullList(
  collectionIdOrName: string,
  onSuccess: (data: Record[]) => void,
  queryParams?: RecordFullListQueryParams
) {
  const pb = usePocketBase();
  const cancelKey = useMemo(() => uuidv4(), []);
  const fetch = useCallback(async () => {
    const result = await snackbarWrapper(pb.collection(collectionIdOrName).getFullList(queryParams));
    onSuccess(result);
  }, [pb, collectionIdOrName, queryParams, onSuccess]);

  useEffect(() => {
    fetch();
    return () => {
      pb.cancelRequest(cancelKey);
    };
  }, [pb, fetch, cancelKey]);

  return { refetch: fetch, cancelKey };
}

function usePbRealtime(topic: string, onMessage: (msg: any) => void) {
  const pb = usePocketBase();

  useEffect(() => {
    let unsub: any;
    async function sub() {
      unsub = await pb.realtime.subscribe(topic, onMessage);
    }
    sub();
    return () => {
      unsub && unsub();
    };
  }, [pb, onMessage, topic]);
}

export type AuthMethods = {
  usernamePassword?: boolean;
  emailPassword?: boolean;
  authProviders?: {
    name: string;
  }[];
};

export function useAuthMethods() {
  const pb = usePocketBase();
  const [authMethods, setAuthMethods] = useState<AuthMethods>({});

  useEffect(() => {
    const _ = async () => {
      const result = await snackbarWrapper(pb.collection('users').listAuthMethods());
      setAuthMethods(result);
    };
    _();
  }, [pb, setAuthMethods]);

  return authMethods;
}

export type RunStatistic = {
  id: string;
  collectionId: string;
  collectionName: string;
  number_of_runs: number;
  average_execution_time: number;
  average_output_length: number;
  number_of_evaluated_tasks: number;
  number_of_successful_tasks: number;
  number_of_failure_tasks: number;
  number_of_timeouted_tasks: number;
};

export function useRunStatistics(): RunStatistic[] {
  const timeoutId = useRef<NodeJS.Timeout>();
  const [runStatistics, setRunStatistics] = useState<Record[]>([]);
  const { refetch } = usePbGetFullList('run_statistics', setRunStatistics);

  const onMessage = useCallback(
    (msg: { action: string }) => {
      if (msg.action === 'create') {
        clearTimeout(timeoutId.current!);
        timeoutId.current = setTimeout(() => {
          refetch();
        }, Math.random() * 2000);
      }
    },
    [refetch]
  );

  usePbRealtime('run_statistics/*', onMessage);

  return runStatistics as never as RunStatistic[];
}

export type Workspace = {
  id: string;
  user: string;
  repo_url: string;
  [k: string]: any;
};

export function useUserWorkspace() {
  const [workspace, _setWorkspace] = useState<Record | null>(null);
  const setWorkspace = useCallback(
    (data: Record[]) => {
      _setWorkspace(getFirstElementFromList(data));
    },
    [_setWorkspace]
  );
  usePbGetFullList('workspaces', setWorkspace);
  return workspace ? (workspace as never as Workspace) : null;
}

export function useGlobals() {
  const [globals, _setGlobals] = useState<{ [k: string]: string }>({});
  const setGlobals = useCallback(
    (data: Record[]) => {
      const _globals: any = {};
      for (const item of data) {
        _globals[item.key] = item.value;
      }
      _setGlobals(_globals);
    },
    [_setGlobals]
  );
  const params = useMemo(() => ({ $autoCancel: false }), []);
  usePbGetFullList('globals', setGlobals, params);
  return globals;
}

export type WorkspaceEvents = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  workspace: string;
  new_run_started: string;
};

export function useWorkspaceEvenets() {
  const pb = usePocketBase();
  const [events, _setEvents] = useState<Record | null>(null);
  const setEvents = useCallback(
    (data: Record[]) => {
      _setEvents(getFirstElementFromList(data));
    },
    [_setEvents]
  );
  const params = useMemo(() => ({ $autoCancel: false }), []);
  usePbGetFullList('workspace_events', setEvents, params);

  useEffect(() => {
    pb.collection('workspace_events').subscribe('*', (data) => {
      _setEvents(data.record);
    });
  }, [pb, _setEvents]);

  return events ? (events as never as WorkspaceEvents) : null;
}

export function useIsWorkspaceBusy() {
  const events = useWorkspaceEvenets();
  const isLoading = useMemo(() => !!events && !!events.new_run_started, [events]);
  return isLoading;
}

export type Ranking = {
  id: string;
  user: string;
  workspace: string;
  points: { [k: string]: number };
  points_sum: { [k: string]: number };
  sum: number;
  comments: string;
  expand: {
    user: User;
  };
};

export type WorkspaceRanking = {
  id: string;
  workspace: string;
  expand: {
    workspace: Workspace;
    rankings: Ranking[];
  };
};

export function useWorkspaceRankings(onChange?: (data: WorkspaceRanking) => void) {
  const pb = usePocketBase();
  const userMapping = useRef<Map<string, User>>(new Map());
  const [workspaceRankings, setWorkspaceRankings] = useState<Record[]>([]);

  const onRankingsFirstFetch = useCallback(
    (data: Record[]) => {
      const rankingMapping = new Map<string, Record>();
      for (const ranking of data) {
        rankingMapping.set(ranking.id, ranking);
        userMapping.current.set(ranking.user as string, ranking.expand.user as never as User);
      }

      setWorkspaceRankings((old) => {
        return old.map((record) => {
          const rankingIds = record.rankings as string[];
          const rankings = rankingIds
            .map((id) => rankingMapping.get(id))
            .filter((item) => item !== undefined) as Record[];
          record.expand = {
            ...record.expand,
            rankings,
          };
          return record;
        });
      });
    },
    [setWorkspaceRankings]
  );

  const onRankingRealtime = useCallback(
    async (msg: { action: string; record: Ranking }) => {
      let user = userMapping.current.get(msg.record.user);
      if (!user) {
        user = (await pb.collection('users').getOne(msg.record.user)) as never as User;
        userMapping.current.set(msg.record.user, user);
      }
      msg.record.expand = { user };

      try {
        setWorkspaceRankings((old) => {
          const newWorkspaceRankings = [...old];
          const workspaceRankingId = newWorkspaceRankings.findIndex((item) => item.workspace === msg.record.workspace);
          if (workspaceRankingId !== -1) {
            const rankingId = newWorkspaceRankings[workspaceRankingId].expand.rankings.findIndex(
              (item: Record) => item.id === msg.record.id
            );
            if (msg.action === 'create') {
              newWorkspaceRankings[workspaceRankingId].expand.rankings.push(msg.record);
            } else if (msg.action === 'update' && rankingId !== -1) {
              //@ts-ignore
              newWorkspaceRankings[workspaceRankingId].expand.rankings[rankingId] = msg.record;
            } else if (msg.action === 'delete' && rankingId !== -1) {
              newWorkspaceRankings[workspaceRankingId].expand.rankings.splice(rankingId, 1);
            }
            onChange && onChange(newWorkspaceRankings[workspaceRankingId] as never as WorkspaceRanking);
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
    [setWorkspaceRankings, pb, onChange]
  );

  const wrParams = useMemo(() => ({ expand: 'workspace', sort: 'created' }), []);
  const rParams = useMemo(() => ({ expand: 'user' }), []);
  usePbGetFullList('workspace_rankings', setWorkspaceRankings, wrParams);
  usePbGetFullList('rankings', onRankingsFirstFetch, rParams);
  usePbRealtime('rankings/*', onRankingRealtime);
  return workspaceRankings as never as WorkspaceRanking[];
}

export type RunTask = {
  task_name: string;
  etalon_result: string;
};

export const runTasksAtom = atom<RunTask[]>([]);

export function useRunTasks() {
  const [_, setRunTasksAtom] = useAtom(runTasksAtom);
  const [runTasks, setRunTasks] = useState<Record[]>([]);
  const setValue = useCallback(
    (data: Record[]) => {
      setRunTasksAtom(data as never as RunTask[]);
      setRunTasks(data);
    },
    [setRunTasksAtom, setRunTasks]
  );
  usePbGetFullList('run_tasks', setValue);
  return runTasks as never as RunTask[];
}

export type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  role?: string;
  avatarUrl?: string;
};

export function useUserModel() {
  const [model] = useAtom(userModelAtom);
  return model as User | null;
}
