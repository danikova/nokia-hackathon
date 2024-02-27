import { getPB } from '@/lib/pocketbase';
import { navBarItems } from '@/lib/navBar';
import { Workspace } from '@/lib/dataHooks';
import { clientSafeObj } from '@/lib/utils';
import EditorViewModal from './EditorViewModal';
import BreadCrumb from '@/components/navigation/BreadCrumb';

async function getUserWorkspace() {
  const pb = getPB();
  const records = await pb.collection('workspaces').getFullList();
  return records.length !== 0 ? records[0] as never as Workspace : null
}

export default async function CodeHome() {
  const workspace = await getUserWorkspace();

  return (
    <>
      <BreadCrumb items={[navBarItems[1]]} />
      <EditorViewModal workspace={clientSafeObj(workspace)} />
    </>
  )
}
