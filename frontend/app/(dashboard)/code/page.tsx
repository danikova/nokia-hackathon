import { getPB } from '../../_lib/pocketbase';
import EditorViewModal from './EditorViewModal';
import { Workspace } from '../settings/WorkspaceForm';

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
