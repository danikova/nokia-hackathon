'use client';

import { NavBarItem } from '@/app/_constans/navBar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const pathname = usePathname();

  return (
    <Link
      href={item.rootPath}
      className={`
      min-h-full flex items-center justify-center m-auto
      ${
        pathname.startsWith(item.rootPath)
          ? 'bg-primary-50 text-primary-700 md:border-l-4 max-md:border-b-4 border-primary-700'
          : ''
      }
      `}
    >
      {item.icon}
    </Link>
  );
}
