import { useBestRuns } from '@/@data/customViews';
import { WorkspaceRecord } from '@/@data/workspaces.types';
import RunResultDisplay from '@/components/runResultDisplay';
import { GroupedRunResult, lastN } from './helpers';
import { useMemo } from 'react';

export function useBestGridCells(workspace?: WorkspaceRecord) {
  const { data: bestSolutions } = useBestRuns(
    workspace ?? ({ id: '' } as WorkspaceRecord)
  );
  const bestCells = useMemo(() => {
    const cells = [];
    for (const runResults of bestSolutions ?? []) {
      cells.push(
        <RunResultDisplay
          key={runResults.task}
          className="col-start-1"
          hideCreated={true}
          runResult={runResults}
          href={`/results/${runResults.run_id}`}
        />
      );
    }
    return cells;
  }, [bestSolutions]);
  return { bestCells, bestSolutions };
}

export function getLastNGridCell(
  runResultsGroupedByRunId: GroupedRunResult,
  taskKeys: string[]
) {
  let remainingLines = lastN;
  const lastCells = [];

  for (const [runId, runResults] of runResultsGroupedByRunId) {
    if (remainingLines <= 0) break;
    remainingLines -= 1;

    const firstResult = runResults[0];
    if (firstResult && !firstResult.is_success) {
      lastCells.push(
        <RunResultDisplay
          key={`error-${runId}`}
          href={`/results/${firstResult.run_id}`}
          className="col-span-full"
          runResult={firstResult}
          hideTaskName
        />
      );
      continue;
    }

    for (const taskKey of taskKeys) {
      const runResult = runResults.find(rr => rr.task === taskKey);
      if (runResult)
        lastCells.push(
          <RunResultDisplay
            key={`${taskKey}-${runId}`}
            href={`/results/${runResult.run_id}`}
            runResult={runResult}
            hideOutput
            hideTaskName
          />
        );
      else lastCells.push(<div className="opacity-0">placeholder</div>);
    }
  }
  return lastCells;
}
