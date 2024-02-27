import { useMemo } from 'react';
import { useWorkspaces } from '@/@data/workspaces';
import WorkspaceForm from './-components/workspaceForm';
import { createFileRoute } from '@tanstack/react-router';
import BreadCrumb from '@/components/navigation/breadCrumb';
import WorkspaceAvatar from './-components/workspaceAvatar';
import { navBarItems } from '@/components/navigation/navBarItems';

export const Route = createFileRoute('/_private/settings/')({
  component: Settings,
});

function Settings() {
  const { data } = useWorkspaces();
  const userWorkspace = useMemo(() => data?.items![0] ?? null, [data]);

  return (
    <div className="m-16 max-md:m-8 md:max-w-2xl">
      <BreadCrumb items={[navBarItems[3]]} />
      <div className="flex gap-4">
        <WorkspaceAvatar workspace={userWorkspace} />
        <h2 className="pb-8 text-2xl">Workspace settings</h2>
      </div>
      <WorkspaceForm workspace={userWorkspace} />
    </div>
  );
}
