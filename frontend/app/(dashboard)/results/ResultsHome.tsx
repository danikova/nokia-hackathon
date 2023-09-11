import Details from './Details';
import FirstSteps from './FirstSteps';
import { TaskLabels } from './TaskLabels';
import { ResultCharts } from './ResultCharts';
import { navBarItems } from '@/lib/navBar';
import { getLastNGridCell } from './getLastNGridCell';
import { getBestGridCells } from './getBestGridCells';
import BreadCrumb from '@/components/navigation/BreadCrumb';
import { RunResult, getGroupedRunResults, perPage } from './helpers';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default async function ResultsHome({ runResults }: { runResults: RunResult[] }) {
  const workspaceId = runResults[0]?.workspace;
  const runResultsGroupedByRunId = getGroupedRunResults(runResults, 'run_id');
  const runResultsGroupedByTask = new Map([...getGroupedRunResults(runResults, 'task').entries()].sort());
  const taskKeys = [...runResultsGroupedByTask.keys()];

  const lastCells = getLastNGridCell(runResultsGroupedByRunId, taskKeys);
  const { bestCells, bestSolutions } = await getBestGridCells(workspaceId);

  if (runResultsGroupedByRunId.size === 0)
    return <FirstSteps />

  return (
    <div className='w-full overflow-x-auto'>
      <BreadCrumb items={[navBarItems[1]]} />
      <div className='m-16 max-md:m-8'>
        <Details />
        <LastNGrid taskKeys={taskKeys} lastCells={lastCells} />
        <BestGrid taskKeys={taskKeys} bestCells={bestCells} runResultsGroupedByTask={runResultsGroupedByTask} bestSolutions={bestSolutions} />
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

function BestGrid({ taskKeys, bestCells, runResultsGroupedByTask, bestSolutions }: {
  taskKeys: string[],
  bestCells: JSX.Element[],
  runResultsGroupedByTask: Map<string, RunResult[]>,
  bestSolutions: RunResult[]
}) {
  return (
    <div className='grid gap-x-8 gap-y-2' style={{
      gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`
    }}>
      <h2 className='text-2xl col-span-full mt-8 mb-6'>
        <Tooltip>
          <TooltipTrigger>
            Best Solutions
          </TooltipTrigger>
          <TooltipContent side='right'>
            Best solution for each task based on output similarity and execution time.
          </TooltipContent>
        </Tooltip>
      </h2>
      {bestCells}
      <div className='col-start-2 row-start-2' style={{
        gridRowEnd: `span ${bestCells.length + 1}`,
        gridColumnEnd: `span ${taskKeys.length - 1}`
      }}>
        <ResultCharts
          taskKeys={taskKeys}
          runResultsGroupedByTask={runResultsGroupedByTask}
          bestSolutions={bestSolutions}
        />
      </div>
    </div>
  );
}