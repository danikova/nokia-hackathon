import RunResultDisplay from "./[runId]/RunResultDisplay";
import { GroupedRunResult } from './helpers';
import { clientSafeObj } from '@/lib/utils';

export function getFastestGridCells(runResultsGroupedByTask: GroupedRunResult) {
  const fastestCells = [];
  const fastestSolutions = [];
  for (const [taskId, runResults] of runResultsGroupedByTask) {
    const fastestSolution = runResults.reduce(function (prev, current) {
      return ((prev.execution_time || Infinity) < (current.execution_time || Infinity)) ? prev : current;
    });
    fastestSolutions.push(fastestSolution);
    fastestCells.push(
      <RunResultDisplay
        key={taskId}
        className='col-start-1'
        hideCreated={true}
        runResult={clientSafeObj(fastestSolution)}
        href={`/results/${fastestSolution.run_id}`} />
    );
  }
  return { fastestCells, fastestSolutions };
}
