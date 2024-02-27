import { useWorkspaces } from '@/@data/workspaces';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { getGroupedRunResults } from './-components/helpers';
import { useRunResults } from '@/@data/runResults';
import { useBestGridCells, getLastNGridCell } from './-components/utils';
import FirstSteps from './-components/firstSteps';
import BreadCrumb from '@/components/navigation/breadCrumb';
import { navBarItems } from '@/components/navigation/navBarItems';
import Details from './-components/details';
import { TaskLabels } from './-components/taskLabels';
import { RunResultRecord } from '@/@data/runResults.types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ResultCharts } from './-components/resultCharts';

export const Route = createFileRoute('/_private/results/')({
  component: Results,
});

function Results() {
  const { data } = useWorkspaces();
  const { data: runResults } = useRunResults();
  const userWorkspace = useMemo(() => data?.items![0] ?? undefined, [data]);

  const runResultsGroupedByRunId = getGroupedRunResults(
    runResults?.items ?? [],
    'run_id'
  );
  const runResultsGroupedByTask = new Map(
    [...getGroupedRunResults(runResults?.items ?? [], 'task').entries()].sort()
  );
  const taskKeys = [...runResultsGroupedByTask.keys()];

  const lastCells = getLastNGridCell(runResultsGroupedByRunId, taskKeys);
  const { bestCells, bestSolutions } = useBestGridCells(userWorkspace);

  if (runResultsGroupedByRunId.size === 0) return <FirstSteps />;

  return (
    <div className="w-full overflow-x-auto">
      <BreadCrumb items={[navBarItems[1]]} />
      <div className="m-16 max-md:m-8">
        <Details />
        <LastNGrid taskKeys={taskKeys} lastCells={lastCells} />
        <BestGrid
          taskKeys={taskKeys}
          bestCells={bestCells}
          runResultsGroupedByTask={runResultsGroupedByTask}
          bestSolutions={bestSolutions ?? []}
        />
      </div>
    </div>
  );
}

function LastNGrid({
  taskKeys,
  lastCells,
}: {
  taskKeys: string[];
  lastCells: JSX.Element[];
}) {
  return (
    <div
      className="grid gap-x-8 gap-y-2"
      style={{
        gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`,
      }}
    >
      <h2 className="col-span-full pb-8 text-2xl">State of the last runs</h2>
      <TaskLabels taskKeys={taskKeys} />
      {lastCells}
    </div>
  );
}

function BestGrid({
  taskKeys,
  bestCells,
  runResultsGroupedByTask,
  bestSolutions,
}: {
  taskKeys: string[];
  bestCells: JSX.Element[];
  runResultsGroupedByTask: Map<string, RunResultRecord[]>;
  bestSolutions: RunResultRecord[];
}) {
  return (
    <div
      className="grid gap-x-8 gap-y-2"
      style={{
        gridTemplateColumns: `repeat(${taskKeys.length},minmax(300px, 1fr))`,
      }}
    >
      <h2 className="col-span-full mb-6 mt-8 text-2xl">
        <Tooltip>
          <TooltipTrigger>Best Solutions</TooltipTrigger>
          <TooltipContent side="right">
            Best solution for each task based on output similarity and execution
            time.
          </TooltipContent>
        </Tooltip>
      </h2>
      {bestCells}
      <div
        className="col-start-2 row-start-2"
        style={{
          gridRowEnd: `span ${bestCells.length + 1}`,
          gridColumnEnd: `span ${taskKeys.length - 1}`,
        }}
      >
        <ResultCharts
          taskKeys={taskKeys}
          runResultsGroupedByTask={runResultsGroupedByTask}
          bestSolutions={bestSolutions}
        />
      </div>
    </div>
  );
}
