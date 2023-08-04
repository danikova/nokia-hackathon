import { ReactElement } from "react";
import { getPB } from "@/app/_lib/pocketbase";
import RunResultDisplay from "./RunResultDisplay";
// import BreadCrumbPush from "../../../_components/navigation/BreadCrumbPush";
import { RunResult, getGroupedKeys, getGroupedRunResults } from '../helpers';
import { notFound } from "next/navigation";

async function getRunResultByGithubRunId(runId: number) {
  const pb = getPB();
  return await pb.collection('run_results').getList<RunResult>(1, 50, {
    filter: `run_id="${runId}"`,
    expand: "workspace"
  });
}

export default async function RunDetail({ params }: {
  params: { runId: number }
}) {
  const runResults = await getRunResultByGithubRunId(params.runId);

  if (runResults.items.length === 0) {
    notFound();
  }

  if (runResults.items && runResults.items[0] && !runResults.items[0].is_success)
    return <DetailWrapper runId={params.runId}>
      <RunResultDisplay runResult={runResults.items[0]} defaultOpen={true} />
    </DetailWrapper>

  const groupedRunResults = new Map([...getGroupedRunResults(runResults, 'task').entries()].sort());
  return <DetailWrapper runId={params.runId}>
    <>
      {getGroupedKeys(groupedRunResults).map((key) => {
        const firstRunResult = groupedRunResults.get(key)
        return firstRunResult ? <RunResultDisplay key={key} runResult={firstRunResult[0]} /> : null
      })}
    </>
  </DetailWrapper>
}

function DetailWrapper({ children, runId }: { children: ReactElement | ReactElement[], runId: number }) {
  return <div className="m-16 max-md:m-8 flex flex-col gap-8">
    {/* <BreadCrumbPush item={{ title: `Details of ${runId}` }} /> */}
    {children}
  </div>
}
