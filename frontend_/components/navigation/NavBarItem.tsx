'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { NavBarItem } from '@/lib/navBar';
import { usePathname } from 'next/navigation';

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const pathname = usePathname();

  const isActive = useMemo(() => {
    const isActive = pathname.startsWith(item.rootPath)
    return isActive;
  }, [item, pathname]);

  return (
    <Link
      href={item.rootPath}
      className={cn(
        'min-h-full flex items-center justify-center m-auto',
        isActive && 'bg-primary/20 text-primary md:border-l-4 max-md:border-b-4 border-primary shadow-inner'
      )}
    >
      {item.icon}
    </Link>
  );
}
