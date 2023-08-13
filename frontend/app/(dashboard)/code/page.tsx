import { Workspace } from '../settings/page';
import { getPB } from '../../_lib/pocketbase';
import EditorViewModal from './EditorViewModal';
import { navBarItems } from '@/app/_constans/navBar';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';

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
      <EditorViewModal workspace={workspace} />
    </>
  )
}
