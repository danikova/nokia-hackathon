import { getPB } from "@/app/_lib/pocketbase";
import { RunResult, getGroupedKeys, getGroupedRunResults } from '../helpers';
import { RunResultDisplay } from "./RunResultDisplay";

async function getRunResultByGithubRunId(runId: number) {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, 50, {
    filter: `run_id="${runId}"`
  });
}

export default async function RunDetail({ params }: {
  params: { runId: number }
}) {
  const runResults = await getRunResultByGithubRunId(params.runId);
  const groupedRunResults = getGroupedRunResults(runResults)
  return <div className="m-16 max-md:m-8 flex flex-col gap-8">
    <h1 className="text-2xl">details of {params.runId}</h1>
    {getGroupedKeys(groupedRunResults).map((key) => {
      const firstRunResult = groupedRunResults[key][0]
      return firstRunResult ? <RunResultDisplay key={key} runResult={firstRunResult} /> : null
    })}
  </div>
}

