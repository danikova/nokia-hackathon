import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { NavBarItem } from './types';
import { Link } from '@tanstack/react-router';
import { useRouterState } from '@tanstack/react-router';

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = useMemo(() => {
    const isActive = pathname.startsWith(item.rootPath);
    return isActive;
  }, [item, pathname]);

  return (
    <Link
      to={item.rootPath}
      className={cn(
        'm-auto flex min-h-full items-center justify-center',
        isActive &&
          'border-primary bg-primary/20 text-primary shadow-inner max-md:border-b-4 md:border-l-4'
      )}
    >
      {item.icon}
    </Link>
  );
}
