import { Workspace } from '../settings/page';
import { getPB } from '../../_lib/pocketbase';
import EditorViewModal from './EditorViewModal';

async function getUserWorkspace() {
  const pb = getPB();
  const records = await pb.collection('workspaces').getFullList();
  return records.length !== 0 ? records[0] as never as Workspace : null
}

export default async function CodeHome() {
  const workspace = await getUserWorkspace();

  return (
    <EditorViewModal workspace={workspace} />
  )
}
