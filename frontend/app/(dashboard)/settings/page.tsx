'use client'

import WorkspaceForm from './WorkspaceForm';
import WorkspaceAvatar from './WorkspaceAvatar';
import { navBarItems } from '@/app/_constans/navBar';
import { useUserWorkspace } from '@/lib/dataHooks';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';


export default function SettingsHome() {
  const workspace = useUserWorkspace();

  return (
    <div className="m-16 max-md:m-8 md:max-w-2xl">
      <BreadCrumb items={[navBarItems[4]]} />
      <div className='flex gap-4'>
        <WorkspaceAvatar workspaceId={workspace?.id || ''} />
        <h2 className='text-2xl pb-8'>
          Workspace settings
        </h2>
      </div>
      <WorkspaceForm workspace={workspace} />
    </div>
  );
}
