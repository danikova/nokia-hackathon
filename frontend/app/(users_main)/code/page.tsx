import { getPB } from '../../_lib/pocketbase';

export default function CodeHome() {
  const pb = getPB();
  return <div>code {JSON.stringify(pb.authStore.model)}</div>;
}
