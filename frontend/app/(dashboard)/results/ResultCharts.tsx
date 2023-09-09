import { RunResult, GroupedRunResult } from './helpers';
import BarChart, { defaultColors, reversedDefaultColors } from '../../../components/BarChart';

export function ResultCharts({ taskKeys, runResultsGroupedByTask, bestSolutions }: { taskKeys: string[], runResultsGroupedByTask: GroupedRunResult; bestSolutions: RunResult[]; }) {
  const avgExectime = getAverageExecutionTime(runResultsGroupedByTask);
  const avgOutputSim = getAverageOutputSimilarityTime(runResultsGroupedByTask);

  return <div className='w-full h-full flex flex-col items-start justify-center gap-y-2'>
    <h3>Execution time</h3>
    <BarChart
      className='w-full'
      labels={taskKeys}
      datasets={[
        {
          label: 'Average execution time',
          data: avgExectime,
          backgroundColor: defaultColors,
        },
        {
          label: 'Best solution execution time',
          data: bestSolutions.map(
            i => i.status === 'success' ? i.execution_time || 0 : 0
          ),
          backgroundColor: defaultColors,
        }
      ]} />
    <h3>Output similarity</h3>
    <BarChart
      className='w-full'
      labels={taskKeys}
      datasets={[
        {
          label: 'Average output similarity',
          data: avgOutputSim,
          backgroundColor: defaultColors,
        },
        {
          label: 'Best solution output_similarity',
          data: bestSolutions.map(
            i => i.status === 'success' ? i.output_similarity || 0 : 0
          ),
          backgroundColor: reversedDefaultColors,
        }
      ]} />
  </div>;
}

function getAverageExecutionTime(runResultsGroupedByTask: GroupedRunResult) {
  const avgExectime = [];
  for (const [_, runResults] of runResultsGroupedByTask) {
    const actualRunResults = runResults.filter(i => i.status === 'success');
    avgExectime.push(
      actualRunResults.reduce((acc, curr) => curr.execution_time ? acc + curr.execution_time : acc, 0) / actualRunResults.length
    );
  }

  return avgExectime;
}

function getAverageOutputSimilarityTime(runResultsGroupedByTask: GroupedRunResult) {
  const avgOutputSim = [];
  for (const [_, runResults] of runResultsGroupedByTask) {
    const actualRunResults = runResults.filter(i => i.status === 'success');
    avgOutputSim.push(
      actualRunResults.reduce((acc, curr) => curr.output_similarity ? acc + curr.output_similarity : acc, 0) / actualRunResults.length
    );
  }

  return avgOutputSim;
}
