import { useMemo } from 'react';
import { useWorkspaces } from '@/@data/workspaces';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceDetails } from '../../ranking/-components/workspaceDetails';

export default function Details() {
  const { data } = useWorkspaces();
  const userWorkspace = useMemo(() => data?.items![0] ?? null, [data]);

  return (
    <div className="mb-8">
      <h2 className="col-span-full pb-[31px] text-2xl">Details</h2>
      {userWorkspace ? (
        <>
          <WorkspaceDetails workspace={userWorkspace} />
        </>
      ) : (
        <div>
          <Skeleton className="mb-2 h-[19px] w-[400px]" />
          <Skeleton className="mb-2 h-[19px] w-[450px]" />
          <Skeleton className="h-[19px] w-[420px]" />
        </div>
      )}
    </div>
  );
}
