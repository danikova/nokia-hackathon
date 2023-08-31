import Link from 'next/link';
import { RunResult, getGroupedRunResults, perPage } from './helpers';
import { navBarItems } from '@/app/_constans/navBar';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';
import { ResultCharts } from './ResultCharts';
import { getFastestGridCells } from './getFastestGridCells';
import { getLastNGridCell } from './getLastNGridCell';
import { TaskLabels } from './TaskLabels';

export default function ResultsHome({ runResults }: { runResults: RunResult[] }) {
  const runResultsGroupedByRunId = getGroupedRunResults(runResults, 'run_id');
  const runResultsGroupedByTask = new Map([...getGroupedRunResults(runResults, 'task').entries()].sort());
  const taskKeys = [...runResultsGroupedByTask.keys()];

  const lastCells = getLastNGridCell(runResultsGroupedByRunId, taskKeys);
  const { fastestCells, fastestSolutions } = getFastestGridCells(runResultsGroupedByTask);

  if (runResultsGroupedByRunId.size === 0) return <div className='m-16 max-md:m-8'>
    <h2 className='text-2xl col-span-full pb-8'>
      There are no registered run results {':('}
    </h2>
    <p>Set your repo in the <Link href='/settings' className='text-primary hover:underline'>/settings</Link> and commit something to the repo to see the result of the runs.</p>
  </div>

  return (
    <div className='w-full overflow-x-auto'>
      <BreadCrumb items={[navBarItems[1]]} />
      <div className='m-16 max-md:m-8'>
        <LastNGrid taskKeys={taskKeys} lastCells={lastCells} />
        <FastestGrid taskKeys={taskKeys} fastestCells={fastestCells} runResultsGroupedByTask={runResultsGroupedByTask} fastestSolutions={fastestSolutions} />
      </div>
    </div >
  )
}

function LastNGrid({ taskKeys, lastCells }: { taskKeys: string[], lastCells: JSX.Element[] }) {
  return (
    <div className='grid gap-x-8 gap-y-2' style={{
      gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`
    }}>
      <h2 className='text-2xl col-span-full pb-8'>
        State of the last runs
      </h2>
      <TaskLabels taskKeys={taskKeys} />
      {lastCells}
    </div>
  );
}

function FastestGrid({ taskKeys, fastestCells, runResultsGroupedByTask, fastestSolutions }: {
  taskKeys: string[],
  fastestCells: JSX.Element[],
  runResultsGroupedByTask: Map<string, RunResult[]>,
  fastestSolutions: RunResult[]
}) {
  return (
    <div className='grid gap-x-8 gap-y-2' style={{
      gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`
    }}>
      <h2 className='text-2xl my-8 col-span-2'>Fastest Solutions <sub className='text-sm max-md:block'>(based on the last {perPage} records)</sub></h2>
      {fastestCells}
      <div className='col-start-2 row-start-2' style={{
        gridRowEnd: `span ${fastestCells.length + 1}`,
        gridColumnEnd: `span ${taskKeys.length - 1}`
      }}>
        <ResultCharts runResultsGroupedByTask={runResultsGroupedByTask} fastestSolutions={fastestSolutions} />
      </div>
    </div>
  );
}