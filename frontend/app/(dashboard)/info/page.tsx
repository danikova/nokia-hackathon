import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown'
import { navBarItems } from '@/app/_constans/navBar';
import { getPB, getUserRole } from '../../_lib/pocketbase';
import BreadCrumb from '@/app/_components/navigation/BreadCrumb';

export type InfoCard = {
  "id": string,
  "collectionId": string,
  "collectionName": string,
  "created": string,
  "updated": string,
  "left_image": string,
  "text": string,
  "right_image": string,
}

async function getInfoCards() {
  const pb = getPB();
  const records = await pb.collection('info_cards').getFullList();
  return records as never as InfoCard[];
}

export default async function InfoHome() {
  const infoCards = await getInfoCards();
  const role = getUserRole();

  return <div className='info-card m-16 max-md:m-8 flex flex-col gap-8'>
    <BreadCrumb items={[navBarItems[0]]} />
    {infoCards.map((infoCard) => {
      return <div key={infoCard.id}>
        <Section infoCard={infoCard} />
        {role === 'staff' && <Link href={`/info/${infoCard.id}`} >Edit card text</Link>}
      </div>
    })}
  </div>
}

async function Section({ infoCard, className }: {
  infoCard: InfoCard,
  className?: string;
}) {
  const pb = getPB();
  const leftImageSrc = infoCard.left_image && pb.files.getUrl(infoCard, infoCard.left_image);
  const RightImageSrc = infoCard.right_image && pb.files.getUrl(infoCard, infoCard.right_image);

  return <div className={cn(`flex items-end gap-8 max-md:flex-col max-md:items-center`, className)}>
    {leftImageSrc && <Image height={200} width={200} src={leftImageSrc} alt={"info section image"} className='' />}
    <div>
      <ReactMarkdown >
        {infoCard.text}
      </ReactMarkdown>
    </div>
    {RightImageSrc && <Image height={200} width={200} src={RightImageSrc} alt={"info section image"} className='' />}
  </div>
}
