import { RunResult, GroupedRunResult } from './helpers';
import BarChart, { defaultColors } from '../../../components/BarChart';

export function ResultCharts({ runResultsGroupedByTask, fastestSolutions }: { runResultsGroupedByTask: GroupedRunResult; fastestSolutions: RunResult[]; }) {
  const averageData = [];
  for (const [taskKey, runResults] of runResultsGroupedByTask) {
    const actualRunResults = runResults.filter(i => i.returncode === 0);
    averageData.push({
      label: taskKey,
      data: actualRunResults.reduce((acc, curr) => curr.execution_time ? acc + curr.execution_time : acc, 0) / actualRunResults.length
    });
  }

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
          data: fastestSolutions.map(
            i => i.returncode === 0 ? i.execution_time || 0 : 0
          ),
          backgroundColor: defaultColors,
        }
      ]} />
  </div>;
}
