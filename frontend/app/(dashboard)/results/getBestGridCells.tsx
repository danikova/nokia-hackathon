import { RunResult } from './helpers';
import { getPB } from "@/lib/pocketbase";
import { clientSafeObj } from '@/lib/utils';
import RunResultDisplay from "./[runId]/RunResultDisplay";

async function getBestRuns(workspaceId: string): Promise<RunResult[]> {
  const pb = getPB();
  try {
    const url = `/run_result_sum/?workspaceId=${workspaceId}`;
    const res = await pb.send(url, { method: "GET" });
    return res;
  } catch { }
  return [];
}

export async function getBestGridCells(workspaceId: string) {
  const bestCells = [];
  const bestSolutions = await getBestRuns(workspaceId);
  for (const runResults of bestSolutions) {
    bestCells.push(
      <RunResultDisplay
        key={runResults.task}
        className='col-start-1'
        hideCreated={true}
        runResult={clientSafeObj(runResults)}
        href={`/results/${runResults.run_id}`} />
    );
  }
  return { bestCells, bestSolutions };
}
