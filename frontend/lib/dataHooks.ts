import { useCallback, useEffect, useState } from 'react';
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

const refetchTimeout = 30_000;

export function useRunStatistics() {
  const pb = usePocketBase();
  const [runStatistics, setRunStatistics] = useState<RunStatistic[]>([]);

  const fetchData = useCallback(async () => {
    const data = (await snackbarWrapper(pb.collection('run_statistics').getFullList())) as never as RunStatistic[];
    setRunStatistics(data);
  }, [pb]);

  useEffect(() => {
    fetchData();
    const timeoutId = setInterval(fetchData, refetchTimeout);
    return () => clearInterval(timeoutId);
  }, [fetchData]);
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
