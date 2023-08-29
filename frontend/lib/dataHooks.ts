import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { snackbarWrapper, usePocketBase } from './clientPocketbase';
import { Record, RecordFullListQueryParams } from 'pocketbase';
import { atom, useAtom } from 'jotai';

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

export function useRunStatisticsRealtime(onCreate: Function) {
  const pb = usePocketBase();

  useEffect(() => {
    let unsub: any;
    async function sub() {
      unsub = await pb.realtime.subscribe('run_statistics/*', (msg: { action: string }) => {
        if (msg.action === 'create') onCreate();
      });
    }

    sub();
    return () => {
      unsub && unsub();
    };
  }, [pb, onCreate]);
}

export function useRunStatistics(): RunStatistic[] {
  const timeoutId = useRef<NodeJS.Timeout>();
  const [runStatistics, setRunStatistics] = useState<Record[]>([]);
  const { refetch } = usePbGetFullList('run_statistics', setRunStatistics);

  const onCreate = useCallback(() => {
    clearTimeout(timeoutId.current!);
    timeoutId.current = setTimeout(() => {
      refetch();
    }, Math.random() * 2000);
  }, [refetch]);

  useRunStatisticsRealtime(onCreate);

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
  usePbGetFullList('globals', setGlobals);
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
  usePbGetFullList('workspace_events', setEvents);

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
};

export type WorkspaceRanking = {
  id: string;
  workspace: string;
  expand: {
    workspace: Workspace;
    rankings: Ranking[];
  };
};

export function useWorkspaceRankings() {
  const [rankings, setRankings] = useState<Record[]>([]);
  const params = useMemo(() => ({ expand: 'workspace, rankings', sort: 'created' }), []);
  usePbGetFullList('workspace_rankings', setRankings, params);
  return rankings as never as WorkspaceRanking[];
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
