import Modal from '@/app/_components/inputs/Modal';
import { getPB } from '../../_lib/pocketbase';

export default function CodeHome() {
  const pb = getPB();
  return <div>
    <Modal />
    code {JSON.stringify(pb.authStore.model)}
  </div>;
}
