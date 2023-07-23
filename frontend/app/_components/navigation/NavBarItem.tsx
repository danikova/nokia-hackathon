'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { NavBarItem } from '@/app/_constans/navBar';

export const currentNavBarItemAtom = atom<NavBarItem | null>(null);

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const pathname = usePathname();
  const [_, setCurrentNavBarItem] = useAtom(currentNavBarItemAtom);

  const isActive = useMemo(() => {
    const isActive = pathname.startsWith(item.rootPath)
    if (isActive) setCurrentNavBarItem(item);
    return isActive;
  }, [item, pathname, setCurrentNavBarItem]);

  return (
    <Link
      href={item.rootPath}
      className={clsx(
        'min-h-full flex items-center justify-center m-auto',
        isActive && 'bg-primary-50 text-primary-700 md:border-l-4 max-md:border-b-4 border-primary-700 shadow-inner'
      )}
    >
      {item.icon}
    </Link>
  );
}
