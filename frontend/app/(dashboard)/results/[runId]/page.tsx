import { ReactElement } from "react";
import { notFound } from "next/navigation";
import { getPB } from "@/lib/pocketbase";
import { Workspace } from "@/lib/dataHooks";
import RunResultDisplay from "./RunResultDisplay";
import { navBarItems } from "@/app/_constans/navBar";
import BreadCrumb from "@/app/_components/navigation/BreadCrumb";
import { RunResult, getGroupedKeys, getGroupedRunResults } from '../helpers';
import { clientSafeObj } from "@/lib/utils";

interface ExpandedRunResult extends RunResult {
  expand: { workspace: Workspace }
};

async function getRunResultByGithubRunId(runId: number) {
  const pb = getPB();
  return (await pb.collection('run_results').getList<ExpandedRunResult>(1, 50, {
    filter: `run_id="${runId}"`,
    expand: "workspace"
  })).items || [];
}

export default async function RunDetail({ params }: {
  params: { runId: number }
}) {
  const runResults = await getRunResultByGithubRunId(params.runId);

  if (runResults.length === 0) {
    notFound();
  }

  if (runResults && runResults[0] && !runResults[0].is_success)
    return <DetailWrapper runId={params.runId}>
      <RunResultDisplay runResult={clientSafeObj(runResults[0])} defaultOpen={true} />
    </DetailWrapper>

  const groupedRunResults = new Map([...getGroupedRunResults(runResults, 'task').entries()].sort());
  return <DetailWrapper runId={params.runId}>
    <>
      {getGroupedKeys(groupedRunResults).map((key) => {
        const firstRunResult = groupedRunResults.get(key)![0];
        let repo_url = firstRunResult?.expand.workspace.repo_url;
        repo_url = repo_url?.endsWith('/') ? repo_url : repo_url + '/';
        return firstRunResult ? <RunResultDisplay
          key={key}
          runResult={clientSafeObj(firstRunResult)}
          href={`${repo_url}/actions/runs/${params.runId}`}
        /> : null
      })}
    </>
  </DetailWrapper>
}

function DetailWrapper({ children, runId }: { children: ReactElement | ReactElement[], runId: number }) {
  return <div className="m-16 max-md:m-8 flex flex-col gap-8">
    <BreadCrumb items={[navBarItems[1], { title: `Details of ${runId}` }]} />
    {children}
  </div>
}
