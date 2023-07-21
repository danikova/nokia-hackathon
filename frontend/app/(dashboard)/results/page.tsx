import Link from 'next/link';
import { getPB } from '../../_lib/pocketbase';
import { RunResultDisplay } from './[runId]/page';
import { RunResult, GroupedRunResult, getGroupedKeys, getGroupedRunResults } from './helpers';

async function getRunResults() {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, 50, { sort: '-created' });
}

export default async function ResultsHome() {
  const runResults = await getRunResults();
  const groupedRunResults = getGroupedRunResults(runResults);

  return <div className='flex flex-col gap-8 m-16 max-md:m-8'>
    <LastNResult groupedRunResults={groupedRunResults} n={3} />
    <FastestResults groupedRunResults={groupedRunResults} />
  </div>;
}

function LastNResult({ groupedRunResults, n }: { groupedRunResults: GroupedRunResult, n: number }) {
  return <div>
    <h2 className='text-2xl'>Result of the last {n > 1 ? `${n} runs` : 'run'}</h2>
    <div className='flex overflow-x-auto max-md:flex-col'>
      {getGroupedKeys(groupedRunResults).map((key) => {
        const rrs = groupedRunResults[key];
        return <div className='flex-auto' key={key}>
          <div className='text-lg'>{key}</div>
          {rrs.slice(0, n).map((rr, i) => (
            <Link key={`${key}-${i}`} href={`/results/${rr.run_id}`}>
              <RunResultDisplay runResult={rr} hideOutput hideTaskName />
            </Link>
          ))}
        </div>
      })}
    </div>
  </div>
}

function FastestResults({ groupedRunResults }: { groupedRunResults: GroupedRunResult }) {
  return <div>
    <h2 className='text-2xl'>Fastest Solutions</h2>
    <div className='flex overflow-x-auto max-md:flex-col'>
      {getGroupedKeys(groupedRunResults).map((key) => {
        const rrs = groupedRunResults[key];
        const fastestSolution = rrs.reduce(function (prev, current) {
          return ((prev.execution_time || Infinity) < (current.execution_time || Infinity)) ? prev : current
        })
        return <Link key={key} href={`/results/${fastestSolution.run_id}`} className='flex-auto'>
          <div className='text-lg'>{key}</div>
          <RunResultDisplay runResult={fastestSolution} hideTaskName />
        </Link>
      })}
    </div>
  </div>
}