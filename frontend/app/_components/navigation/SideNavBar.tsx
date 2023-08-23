import { navBarItems, staffNavBarItems } from '@/app/_constans/navBar';
import NavBarItem from './NavBarItem';
import { cn } from '@/lib/utils';
import { getUserRole } from '@/lib/pocketbase';

export default function SideNavBar() {
  const role = getUserRole();
  const lastItem = navBarItems[navBarItems.length - 1];

  return (
    <div className="flex flex-col justify-between min-h-full bg-background border-r-2 border-secondary">
      <div>
        {navBarItems.slice(0, -1).map((item) => {
          return (
            <div key={item.title} className="hover:bg-secondary hover:cursor-pointer hover:shadow-inner transition-all h-16">
              <NavBarItem item={item} />
            </div>
          );
        })}
        {role === 'staff' && (
          <>
            <Divider className="my-4" />
            {staffNavBarItems.map((item) => {
              return (
                <div key={item.title} className="hover:bg-secondary hover:cursor-pointer hover:shadow-inner transition-all h-16">
                  <NavBarItem item={item} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <div>
        <Divider />
        <div key={lastItem.title} className="hover:bg-secondary hover:cursor-pointer hover:shadow-inner transition-all h-16">
          <NavBarItem item={lastItem} />
        </div>
      </div>
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t-2 border-secondary", className)} />;
}