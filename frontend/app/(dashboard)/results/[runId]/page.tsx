import dayjs from "dayjs";
import Code from "@/app/_components/Code";
import { getPB } from "@/app/_lib/pocketbase";
import humanizeDuration from "humanize-duration";
import { FaCircle, FaCircleXmark } from 'react-icons/fa6';
import { RunResult, getGroupedKeys, getGroupedRunResults } from '../helpers';

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

export function RunResultDisplay({
  runResult,
  hideOutput = false,
  hideTaskName = false
}: { runResult: RunResult, hideOutput?: boolean, hideTaskName?: boolean }) {
  return <div className="flex flex-col gap-2 bg-[rgba(0,0,0,0.02)] rounded-md min-w-min max-w-[1000px] w-full p-2">
    <div className="flex justify-between gap-2 h-8 whitespace-nowrap p-2 rounded-md bg-[rgba(0,0,0,0.04)]">
      <div className="flex justify-start items-center gap-2">
        {runResult.is_success ? <div><FaCircle className="text-green-500 h-5 w-5" /></div> : <div><FaCircleXmark className="text-red-500 h-5 w-5" /></div>}
        {!hideTaskName && <div className="text-lg">{runResult.task}</div>}
      </div>
      <div className="flex justify-start items-center gap-2">
        <div>{dayjs(new Date(runResult.created)).fromNow()}</div>
        <span className="text-lg">/</span>
        <div>{humanizeDuration((runResult.execution_time || 0) * 1000)}</div>
      </div>
    </div>
    {!hideOutput && <div className="flex whitespace-nowrap">
      <Code language="bash" className='p-2 rounded-md min-w-full max-h-[500px] overflow-y-scroll'>
        {runResult.output}
      </Code>
    </div>}
  </div>
}