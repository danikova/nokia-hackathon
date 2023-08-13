'use client'

import { useEffect, useState } from 'react';
import WorkspaceForm from './WorkspaceForm';
import WorkspaceAvatar from './WorkspaceAvatar';
import { snackbarWrapper, usePocketBase } from '@/app/_lib/clientPocketbase';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';
import { navBarItems } from '@/app/_constans/navBar';

export type Workspace = {
  id: string;
  user: string;
  repo_url: string;
  [k: string]: any;
};

export function useUserWorkspace() {
  const pb = usePocketBase();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    const _ = async () => {
      const records = await snackbarWrapper(pb.collection('workspaces').getFullList());
      setWorkspace(records.length !== 0 ? records[0] as never as Workspace : null);
    }
    _();
  }, [pb]);

  return workspace;
}

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
