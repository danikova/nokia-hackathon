import Link from 'next/link';
import { getPB } from '../../_lib/pocketbase';
import Modal from '@/app/_components/inputs/Modal';
import { Workspace } from '../settings/WorkspaceForm';
import { Button } from '@/components/ui/button';

async function getUserWorkspace() {
  const pb = getPB();
  const records = await pb.collection('workspaces').getFullList();
  return records.length !== 0 ? records[0] as never as Workspace : null
}

export default async function CodeHome() {
  const workspace = await getUserWorkspace();
  const isRepoUrlSet = !!workspace?.repo_url;

  return (
    <Modal title='Editor view' acknowledgeBtn={
      <Button disabled={!isRepoUrlSet}>
        <>
          {workspace?.repo_url && <Link href={`https://vscode.dev/${workspace?.repo_url}`}>
            Open workspace editor
          </Link>}
          {!workspace?.repo_url && <div>Open workspace editor</div>}
        </>
      </Button>
    } >
      <>
        {isRepoUrlSet && <>
          <span>Workspace details</span>
          <div className="text-sm">
            <p>
              Repo url: <Link href={workspace.repo_url} className='text-secondary-foreground hover:underline'>{workspace.repo_url}</Link>
            </p>
          </div>
        </>}
        {!isRepoUrlSet && <p className="text-sm">
          Currently there are no repo url set in this workspace, please go to the <Link href='/settings' className='text-secondary-foreground hover:underline'>/settings</Link> and set it correctly.
        </p>}
      </>
    </Modal>
  );
}
