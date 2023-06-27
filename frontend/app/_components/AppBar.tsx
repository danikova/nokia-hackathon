import Image from 'next/image';
import { ReactElement } from 'react';

export default function AppBar({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children?: ReactElement;
}) {
  return (
    <div className="h-full bg-primary px-4 z-50">
      <div className="min-h-full flex items-center">
        <div className="inline-block">
          <Image src="/nokia.svg" height={30} width={90} alt="Nokia logo" />
        </div>
        <h1 className="ml-4 text-white text-xl">{title}</h1>
        {subTitle && <p className="ml-4 text-white text-xl opacity-70 font-light">{subTitle}</p>}
        {children}
      </div>
    </div>
  );
}
