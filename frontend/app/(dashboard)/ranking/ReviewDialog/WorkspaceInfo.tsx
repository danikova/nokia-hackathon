'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { Workspace, useBestRuns } from "@/lib/dataHooks";
import RunResultDisplay from "../../results/[runId]/RunResultDisplay";

export default function WorkspaceInfo({ workspace }: { workspace: Workspace }) {
  const runResults = useBestRuns(workspace.id);
  return (
    <div className="p-4 w-[28rem] max-h-[70vh] overflow-auto">
      <h2 className="text-lg font-bold">Best runs</h2>
      {runResults.length === 0 && <>
        <div className="flex flex-col gap-2 p-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[80px] w-full" />
        </div>
        <div className="flex flex-col gap-2 p-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-[80px] w-full" />
        </div>
      </>}
      {runResults.map((runResult) => {
        return (
          <RunResultDisplay
            tabIndex={-1}
            key={runResult.task}
            hideCreated
            runResult={runResult}
          />
        );
      })
      }
    </div>
  );
}