import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { snackbarWrapper, usePocketBase } from './clientPocketbase';

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

export function useRunStatistics() {
  const pb = usePocketBase();
  const timeoutId = useRef<NodeJS.Timeout>();
  const [runStatistics, setRunStatistics] = useState<RunStatistic[]>([]);

  const fetchData = useCallback(async () => {
    const data = (await snackbarWrapper(pb.collection('run_statistics').getFullList())) as never as RunStatistic[];
    setRunStatistics(data);
  }, [pb]);

  const onCreate = useCallback(() => {
    clearTimeout(timeoutId.current!);
    timeoutId.current = setTimeout(() => {
      fetchData();
    }, Math.random() * 2000);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useRunStatisticsRealtime(onCreate);

  return runStatistics;
}

export type Workspace = {
  id: string;
  user: string;
  repo_url: string;
  [k: string]: any;
};

export function useUserWorkspace() {
  const pb = usePocketBase();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const _ = async () => {
      const records = await snackbarWrapper(pb.collection('workspaces').getFullList());
      setWorkspace(records.length !== 0 ? (records[0] as never as Workspace) : null);
    };
    _();
  }, [pb]);

  return workspace;
}

export function useGlobals() {
  const pb = usePocketBase();
  const [globals, setGlobals] = useState<Record<string, string>>({});

  useEffect(() => {
    pb.collection('globals')
      .getFullList()
      .then((data) => {
        const _globals: any = {};
        for (const item of data) {
          _globals[item.key] = item.value;
        }
        setGlobals(_globals);
      });
  }, [pb]);

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
  const [events, setEvents] = useState<WorkspaceEvents>();

  useEffect(() => {
    pb.collection('workspace_events').subscribe('*', (data) => {
      setEvents((data.record as never as WorkspaceEvents) || undefined);
    });
  }, [pb]);

  useEffect(() => {
    pb.collection('workspace_events')
      .getFullList()
      .then((data) => {
        setEvents(data.length !== 0 ? (data[0] as never as WorkspaceEvents) : undefined);
      });
  }, [pb]);

  return events;
}

export function useIsWorkspaceBusy() {
  const events = useWorkspaceEvenets();
  const isLoading = useMemo(() => !!events && !!events.new_run_started, [events]);
  return isLoading;
}

export type Ranking = {
  user: string;
  workspace: string;
  points: any;
  comment: string;
};

export type WorkspaceRanking = {
  id: string;
  workspace: string;
};

export function useWorkspaceRankings() {
  const pb = usePocketBase();
  const [rankings, setRankings] = useState<WorkspaceRanking[]>();

  useEffect(() => {
    pb.collection('workspace_rankings')
      .getFullList({ expand: 'workspace, rankings' })
      .then((data) => {
        setRankings(data as never as WorkspaceRanking[]);
      });
  }, [pb]);

  return rankings;
}

export type RunTask = {
  task_name: string;
  etalon_result: string;
};

export function useRunTasks() {
  const pb = usePocketBase();
  const [runTasks, setRunTasks] = useState<RunTask[]>();

  useEffect(() => {
    pb.collection('run_tasks')
      .getFullList({ sort: 'task_name' })
      .then((data) => {
        setRunTasks(data as never as RunTask[]);
      });
  }, [pb]);

  return runTasks;
}
