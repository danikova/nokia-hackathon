import { getPB } from '../../_lib/pocketbase';

export default function InfoHome() {
  const pb = getPB();
  return <div>info {JSON.stringify(pb.authStore.model)}</div>;
}
