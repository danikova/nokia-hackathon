import { RunResultRecord } from '@/@data/runResults.types';

export const perPage = 50;
export const lastN = 5;

export type GroupedRunResult = Map<string, RunResultRecord[]>;

export function getGroupedRunResults<T extends RunResultRecord>(
  runResults: T[],
  groupKey: keyof T,
  omitEmpty = true
) {
  const groups = new Map<string, T[]>();
  for (const runResult of runResults) {
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
