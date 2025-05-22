import { cn } from '@/lib/utils';
import { pb } from '@/@data/client';
import ReactMarkdown from 'react-markdown';
import { useInfoCards } from '@/@data/infoCards';
import { InfoCardRecord } from '@/@data/infoCards.types';
import { createFileRoute } from '@tanstack/react-router';
import BreadCrumb from '@/components/navigation/breadCrumb';
import { navBarItems } from '@/components/navigation/navBarItems';

export const Route = createFileRoute('/_private/info/')({
  component: Info,
});

function Info() {
  const { data: infoCards } = useInfoCards();

  return (
    <div className="info-card m-16 flex flex-col gap-8 max-md:m-8">
      <BreadCrumb items={[navBarItems[0]]} />
      {infoCards?.map(infoCard => {
        return (
          <div key={infoCard.id}>
            <Section infoCard={infoCard} />
          </div>
        );
      })}
    </div>
  );
}

function Section({
  infoCard,
  className,
}: {
  infoCard: InfoCardRecord;
  className?: string;
}) {
  const leftImageSrc =
    infoCard.left_image && pb.files.getUrl(infoCard, infoCard.left_image);
  const RightImageSrc =
    infoCard.right_image && pb.files.getUrl(infoCard, infoCard.right_image);

  return (
    <div
      className={cn(
        `flex items-end gap-8 max-md:flex-col max-md:items-center`,
        className
      )}
    >
      {leftImageSrc && <img height={200} width={200} src={leftImageSrc} />}
      <div>
        <ReactMarkdown>{infoCard.text}</ReactMarkdown>
      </div>
      {RightImageSrc && <img height={200} width={200} src={RightImageSrc} />}
    </div>
  );
}
