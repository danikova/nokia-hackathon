import { RunResultRecord } from '@/@data/runResults.types';
import { GroupedRunResult } from './helpers';
import BarChart from '@/components/barChart';
import { defaultColors, reversedDefaultColors } from '@/lib/chartColors';

export function ResultCharts({
  taskKeys,
  runResultsGroupedByTask,
  bestSolutions,
}: {
  taskKeys: string[];
  runResultsGroupedByTask: GroupedRunResult;
  bestSolutions: RunResultRecord[];
}) {
  const avgExectime = getAverageExecutionTime(runResultsGroupedByTask);
  const avgOutputSim = getAverageOutputSimilarityTime(runResultsGroupedByTask);

  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-y-2">
      <h3>Execution time</h3>
      <BarChart
        className="w-full max-w-2xl"
        labels={taskKeys}
        datasets={[
          {
            label: 'Average execution time',
            data: avgExectime,
            backgroundColor: defaultColors,
          },
          {
            label: 'Best solution execution time',
            data: bestSolutions.map(i =>
              i.status === 'success' ? i.execution_time || 0 : 0
            ),
            backgroundColor: defaultColors,
          },
        ]}
      />
      <h3>Output similarity</h3>
      <BarChart
        className="w-full max-w-2xl"
        labels={taskKeys}
        datasets={[
          {
            label: 'Average output similarity',
            data: avgOutputSim.map(i => Math.round(i * 100) || 0),
            backgroundColor: defaultColors,
          },
          {
            label: 'Best solution output_similarity',
            data: bestSolutions.map(i =>
              i.status === 'success'
                ? Math.round(i.output_similarity * 100) || 0
                : 0
            ),
            backgroundColor: reversedDefaultColors,
          },
        ]}
      />
    </div>
  );
}

function getAverageExecutionTime(runResultsGroupedByTask: GroupedRunResult) {
  const avgExectime = [];
  // eslint-disable-next-line
  for (const [_, runResults] of runResultsGroupedByTask) {
    const actualRunResults = runResults.filter(i => i.status === 'success');
    avgExectime.push(
      actualRunResults.reduce(
        (acc, curr) => (curr.execution_time ? acc + curr.execution_time : acc),
        0
      ) / actualRunResults.length
    );
  }

  return avgExectime;
}

function getAverageOutputSimilarityTime(
  runResultsGroupedByTask: GroupedRunResult
) {
  const avgOutputSim = [];
  // eslint-disable-next-line
  for (const [_, runResults] of runResultsGroupedByTask) {
    const actualRunResults = runResults.filter(
      i => i.status === 'success' && i.output_similarity > 0.01
    );
    avgOutputSim.push(
      actualRunResults.reduce(
        (acc, curr) =>
          curr.output_similarity ? acc + curr.output_similarity : acc,
        0
      ) / actualRunResults.length
    );
  }

  return avgOutputSim;
}
