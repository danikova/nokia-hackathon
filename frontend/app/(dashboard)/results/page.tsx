import { getPB } from '../../_lib/pocketbase';
import BarChart, { defaultColors } from '../../_components/BarChart';
import { RunResultDisplay } from "./[runId]/RunResultDisplay";
import { RunResult, GroupedRunResult, getGroupedRunResults } from './helpers';

const perPage = 50;

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
  const n = 3;

  const lastCells = getLastNGridCell(runResultsGroupedByRunId, taskKeys, n);
  const { fastestCells, fastestSolutions } = getFastestGridCells(runResultsGroupedByTask);

  return (
    <div className='w-full overflow-x-auto'>
      <div className='grid gap-x-8 gap-y-2 m-16 max-md:m-8' style={{
        gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`
      }}>
        <h2 className='text-2xl col-span-full'>
          State of the last {n > 1 ? `${n} runs` : 'run'}
        </h2>
        {taskKeys.map((key) => <div key={key} className='text-lg'>{key}</div>)}
        {lastCells}
        <h2 className='text-2xl mt-8'>Fastest Solutions <sub className='text-sm max-md:block'>(based on the last {perPage} runs)</sub></h2>
        {fastestCells}
        <div className='col-start-2' style={{
          gridRowStart: `${n + 3 + 1}`,
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
    data: runResults.reduce((acc, curr) => curr.execution_time ? acc + curr.execution_time : acc, 0) / runResults.length
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