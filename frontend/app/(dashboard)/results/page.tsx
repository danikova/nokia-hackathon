
import ResultsHome from './ResultsHome';
import { getPB } from '@/lib/pocketbase';
import { AutoReload } from './AutoReload';
import { RunResult, perPage } from './helpers';

async function getRunResults() {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, perPage, {
    sort: '-created',
  });
}

export default async function Page() {
  const runResults = await getRunResults();
  return (
    <>
      <AutoReload />
      <ResultsHome runResults={runResults.items || []} />
    </>
  );
}