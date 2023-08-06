'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { NavBarItem } from '@/app/_constans/navBar';
import { BreadCrumbItem } from '@/app/_constans/breadCrumb';

export const globalBreadCrumbAtom = atom<BreadCrumbItem[]>([]);

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const pathname = usePathname();
  const [_, setGlobalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  const isActive = useMemo(() => {
    const isActive = pathname.startsWith(item.rootPath)
    return isActive;
  }, [item, pathname]);

  useEffect(() => {
    if (isActive) setGlobalBreadCrumb([item]);
  }, [isActive, setGlobalBreadCrumb, item])

  return (
    <Link
      href={item.rootPath}
      // href={'/'}
      className={cn(
        'min-h-full flex items-center justify-center m-auto',
        isActive && 'bg-primary/20 text-primary md:border-l-4 max-md:border-b-4 border-primary shadow-inner'
      )}
    >
      {item.icon}
    </Link>
  );
}
