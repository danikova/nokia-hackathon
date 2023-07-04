import { getPB } from '@/app/_lib/pocketbase';
import WorkspaceForm from './WorkspaceForm';

export const dynamic = 'force-dynamic';

export type Workspace = {
  id: string;
  user: string;
  repo_url: string;
  [k: string]: any;
};

async function getUserWorkspace() {
  const pb = getPB();
  const records = await pb.collection('workspaces').getFullList();
  return records[0] as unknown as Workspace;
}

export default async function SettingsHome() {
  const ws = await getUserWorkspace();
  return (
    <div className="p-16 md:max-w-2xl">
      <h1 className="text-lg pb-16">Workspace Settings</h1>
      <WorkspaceForm workspace={ws} />
    </div>
  );
}
