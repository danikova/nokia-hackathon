import { ListResult } from 'pocketbase';

export type RunResult = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  workspace: string;
  run_id: string;
  task: string;
  execution_time?: number;
  output: string;
  returncode: number;
  is_success: boolean;
  stderr?: string;
};

export type GroupedRunResult = Map<string, RunResult[]>;

export function getGroupedRunResults<T extends RunResult>(
  runResults: ListResult<T>,
  groupKey: keyof T,
  omitEmpty = true
) {
  const groups = new Map<string, T[]>();
  for (const runResult of runResults.items) {
    const groupName = `${runResult[groupKey]}`;
    if (omitEmpty && !groupName) continue;
    const runResults = groups.get(groupName);
    if (runResults) runResults.push(runResult);
    else groups.set(groupName, [runResult]);
  }
  return groups;
}

export function getGroupedKeys(groupedRunResults: GroupedRunResult) {
  return [...groupedRunResults.keys()].sort((a, b) => a.localeCompare(b));
}
