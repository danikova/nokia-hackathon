import { ListResult } from 'pocketbase';
import { getPB } from '../../_lib/pocketbase';
import { RunResult, GroupedRunResult, getGroupedKeys, getGroupedRunResults } from './helpers';

async function getRunResults() {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, 50, { sort: '-created' });
}

export default async function ResultsHome() {
  const runResults = await getRunResults();
  const groupedRunResults = getGroupedRunResults(runResults);

  return <div>
    <LastNResult groupedRunResults={groupedRunResults} n={3} />
    <FastestResults groupedRunResults={groupedRunResults} />
  </div>;
}

function LastNResult({ groupedRunResults, n }: { groupedRunResults: GroupedRunResult, n: number }) {
  return <div>
    {getGroupedKeys(groupedRunResults).map((key) => {
      const rrs = groupedRunResults[key];
      return <div key={key}>
        <p>{key}</p>
        {rrs.slice(0, n).map((rr, i) => (
          <div key={`${key}-${i}`}>
            <span>{rr.is_success ? 'true' : 'false'}</span>
            <span>{rr.execution_time}</span>
            <span>{rr.created}</span>
          </div>
        ))}
      </div>
    })}
  </div>
}

function FastestResults({ groupedRunResults }: { groupedRunResults: GroupedRunResult }) {
  return <div>
    {getGroupedKeys(groupedRunResults).map((key) => {
      const rrs = groupedRunResults[key];
      const fastestSolution = rrs.reduce(function (prev, current) {
        return ((prev.execution_time || Infinity) < (current.execution_time || Infinity)) ? prev : current
      })
      return <div key={key}>
        <p>{key}</p>
        <p>fastest solution</p>
        {JSON.stringify(fastestSolution, null, '  ')}
      </div>
    })}
  </div>
}