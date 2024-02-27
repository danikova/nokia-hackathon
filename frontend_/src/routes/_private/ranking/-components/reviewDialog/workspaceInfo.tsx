import { getEditorUrl } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useBestRuns } from '@/@data/customViews';
import { WorkspaceRecord } from '@/@data/workspaces.types';
import RunResultDisplay from '@/components/runResultDisplay';

export default function WorkspaceInfo({
  workspace,
}: {
  workspace: WorkspaceRecord;
}) {
  const { data: runResults, status } = useBestRuns(workspace);

  return (
    <div className="max-h-[70vh] w-[28rem] overflow-auto p-4">
      <h2 className="text-lg font-bold">Best runs</h2>
      {status === 'pending' && (
        <>
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[80px] w-full" />
          </div>
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[80px] w-full" />
          </div>
        </>
      )}
      {runResults?.map(runResult => {
        return (
          <RunResultDisplay
            tabIndex={-1}
            key={runResult.task}
            hideCreated
            runResult={runResult}
            href={getEditorUrl(workspace.repo_url, runResult.sha)}
            windowHref={getEditorUrl(workspace.repo_url, runResult.sha)}
          />
        );
      })}
    </div>
  );
}
