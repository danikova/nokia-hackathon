import { getPB } from '../../_lib/pocketbase';
import RunResultDisplay from "./[runId]/RunResultDisplay";
import BarChart, { defaultColors } from '../../_components/BarChart';
import { RunResult, GroupedRunResult, getGroupedRunResults } from './helpers';

const perPage = 50;
const lastN = 5;

async function getRunResults() {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, perPage, {
    sort: '-created'
  });
}

export default async function ResultsHome() {
  const runResults = await getRunResults();
  const runResultsGroupedByRunId = getGroupedRunResults(runResults, 'run_id');
  const runResultsGroupedByTask = new Map([...getGroupedRunResults(runResults, 'task').entries()].sort());
  const taskKeys = [...runResultsGroupedByTask.keys()];

  const lastCells = getLastNGridCell(runResultsGroupedByRunId, taskKeys, lastN);
  const { fastestCells, fastestSolutions } = getFastestGridCells(runResultsGroupedByTask);

  if (runResultsGroupedByRunId.size === 0) return <div className='m-16 max-md:m-8'>
    <h2 className='text-2xl col-span-full pb-8'>
      There are no registered run results {':('}
    </h2>
  </div>

  return (
    <div className='w-full overflow-x-auto'>
      <div className='grid gap-x-8 gap-y-2 m-16 max-md:m-8' style={{
        gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`
      }}>
        <h2 className='text-2xl col-span-full pb-8'>
          State of the last runs
        </h2>
        {taskKeys.map((key) => <div key={key} className='text-lg'>{key}</div>)}
        {lastCells}
        <h2 className='text-2xl my-8'>Fastest Solutions <sub className='text-sm max-md:block'>(based on the last {perPage} records)</sub></h2>
        {fastestCells}
        <div className='col-start-2' style={{
          gridRowStart: `${lastN + 3 + 1}`,
          gridRowEnd: `span ${fastestCells.length + 1}`,
          gridColumnEnd: `span ${taskKeys.length - 1}`
        }}>
          <ResultCharts runResultsGroupedByTask={runResultsGroupedByTask} fastestSolutions={fastestSolutions} />
        </div>
      </div>
    </div>
  )
}

function getLastNGridCell(runResultsGroupedByRunId: GroupedRunResult, taskKeys: string[], n: number) {
  let remainingLines = n;
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
          runResult={firstResult}
          hideTaskName
        />
      );
      continue;
    }

    for (const taskKey of taskKeys) {
      const runResult = runResults.find((rr) => rr.task === taskKey);
      if (runResult) lastCells.push(
        <RunResultDisplay
          key={`${taskKey}-${runId}`}
          href={`/results/${runResult.run_id}`}
          runResult={runResult}
          hideOutput
          hideTaskName
        />
      );
      else lastCells.push(<div className='opacity-0'>placeholder</div>)
    }
  }
  return lastCells;
}

function getFastestGridCells(runResultsGroupedByTask: GroupedRunResult) {
  const fastestCells = [];
  const fastestSolutions = [];
  for (const [taskId, runResults] of runResultsGroupedByTask) {
    const fastestSolution = runResults.reduce(function (prev, current) {
      return ((prev.execution_time || Infinity) < (current.execution_time || Infinity)) ? prev : current
    })
    fastestSolutions.push(fastestSolution);
    fastestCells.push(
      <RunResultDisplay
        key={taskId}
        className='col-start-1'
        runResult={fastestSolution}
        href={`/results/${fastestSolution.run_id}`}
      />
    );
  }
  return { fastestCells, fastestSolutions };
}

function ResultCharts({ runResultsGroupedByTask, fastestSolutions }: { runResultsGroupedByTask: GroupedRunResult, fastestSolutions: RunResult[] }) {
  const averageData = [];
  for (const [taskKey, runResults] of runResultsGroupedByTask) averageData.push({
    label: taskKey,
    data: runResults.filter(curr => curr.returncode === 0).reduce((acc, curr) => curr.execution_time ? acc + curr.execution_time : acc, 0) / runResults.length
  });

  return <div className='w-full h-full flex items-start justify-center'>
    <BarChart
      className='w-full'
      labels={averageData.map(i => i.label)}
      datasets={[
        {
          label: 'Average execution time',
          data: averageData.map(i => i.data),
          backgroundColor: defaultColors,
        },
        {
          label: 'Fastest execution time',
          data: fastestSolutions.map(i => i.execution_time || NaN),
          backgroundColor: defaultColors,
        }
      ]}
    />
  </div>
}