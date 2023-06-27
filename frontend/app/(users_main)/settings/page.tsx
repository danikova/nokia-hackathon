import { getPB } from '../../_lib/pocketbase';

export default function SettingsHome() {
  const pb = getPB();
  return <div>settings {JSON.stringify(pb.authStore.model)}</div>;
}
