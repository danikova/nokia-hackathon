import { getPB } from '../../_lib/pocketbase';

export default function ResultsHome() {
  const pb = getPB();
  return <div>results {JSON.stringify(pb.authStore.model)}</div>;
}
