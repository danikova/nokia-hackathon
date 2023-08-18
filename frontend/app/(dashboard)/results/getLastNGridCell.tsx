import { clientSafeObj } from '@/lib/utils';
import { GroupedRunResult, lastN } from './helpers';
import RunResultDisplay from "./[runId]/RunResultDisplay";

export function getLastNGridCell(runResultsGroupedByRunId: GroupedRunResult, taskKeys: string[]) {
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
          className='col-span-full'
          runResult={clientSafeObj(firstResult)}
          hideTaskName />
      );
      continue;
    }

    for (const taskKey of taskKeys) {
      const runResult = runResults.find((rr) => rr.task === taskKey);
      if (runResult) lastCells.push(
        <RunResultDisplay
          key={`${taskKey}-${runId}`}
          href={`/results/${runResult.run_id}`}
          runResult={clientSafeObj(runResult)}
          hideOutput
          hideTaskName />
      );
      else lastCells.push(<div className='opacity-0'>placeholder</div>);
    }
  }
  return lastCells;
}
