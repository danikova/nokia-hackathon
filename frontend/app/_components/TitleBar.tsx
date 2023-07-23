'use client'

import { useAtom } from 'jotai';
import { ReactElement } from 'react';
import { currentNavBarItemAtom } from './navigation/NavBarItem';

export default function TitleBar({
  children,
}: {
  children?: ReactElement | ReactElement[] | string;
}) {
  const [activeNavBarItem] = useAtom(currentNavBarItemAtom);

  return (
    <div className="h-12 w-full bg-secondary-bg/50 px-4 drop-shadow-default backdrop-blur-sm">
      <div className="min-h-full flex items-center">
        {activeNavBarItem?.title}
        {children}
      </div>
    </div>
  );
}
