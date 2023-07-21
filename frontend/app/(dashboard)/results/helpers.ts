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
  is_success: boolean;
};

export type GroupedRunResult = {
  [groupName: string]: RunResult[];
};

export function getGroupedRunResults(runResults: ListResult<RunResult>) {
  const groups: GroupedRunResult = {};
  for (const runResult of runResults.items) {
    const groupName = runResult.task;
    if (groupName in groups) groups[groupName].push(runResult);
    else groups[groupName] = [runResult];
  }
  return groups;
}

export function getGroupedKeys(groupedRunResults: GroupedRunResult) {
  return Object.keys(groupedRunResults).sort((a, b) => a.localeCompare(b));
}
