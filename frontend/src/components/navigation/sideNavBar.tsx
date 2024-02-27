import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAtomValue } from 'jotai';
import NavBarItem from './navBarItem';
import { userAtom } from '@/atoms/user';
import { type NavBarItem as NavBarItemType } from './types';
import { navBarItems, staffNavBarItems } from './navBarItems';

export default function SideNavBar() {
  const user = useAtomValue(userAtom);
  const lastItem = navBarItems[navBarItems.length - 1];

  return (
    <div className="flex min-h-full flex-col justify-between border-r-2 border-secondary bg-background">
      <div>
        {navBarItems.slice(0, -1).map(item => (
          <NavBarItemWrapper key={item.title} item={item} />
        ))}
        {user?.role === 'staff' && (
          <>
            <Divider className="my-4" />
            {staffNavBarItems.map(item => (
              <NavBarItemWrapper key={item.title} item={item} />
            ))}
          </>
        )}
      </div>
      <div>
        <Divider />
        <NavBarItemWrapper item={lastItem} />
      </div>
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return <div className={cn('border-t-2 border-secondary', className)} />;
}

function NavBarItemWrapper({ item }: { item: NavBarItemType }) {
  return (
    <Tooltip delayDuration={600} key={item.title}>
      <TooltipTrigger className="h-16 w-16 transition-all hover:cursor-pointer hover:bg-secondary hover:shadow-inner">
        <NavBarItem item={item} />
      </TooltipTrigger>
      <TooltipContent side="right">
        {item.title}
        {!!item.shortDescription && (
          <TooltipDescription>{item.shortDescription}</TooltipDescription>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
