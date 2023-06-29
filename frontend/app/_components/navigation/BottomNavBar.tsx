import { navBarItems } from '@/app/_constans/navBar';
import NavBarItem from './NavBarItem';
import UserAvatar from '../UserAvatar';

export default function BottomNavBar() {
  return (
    <div className="box-border h-16 bg-secondary-menu border-t-2 border-secondary-divider flex">
      {navBarItems.map((item) => {
        return (
          <div key={item.title} className="hover:bg-secondary-divider hover:cursor-pointer flex-1">
            <NavBarItem item={item} />
          </div>
        );
      })}
      <div className="hover:bg-secondary-divider hover:cursor-pointer flex-1">
        <div className="flex min-h-full content-center justify-center flex-wrap">
          <UserAvatar
            className="flex min-h-full content-center justify-center flex-wrap h-10 w-10 rounded-full ring-2 shadow-primary"
            dropdownProps={{ menuItemsClass: 'right-0 bottom-[2.7rem] origin-bottom-right' }}
          />
        </div>
      </div>
    </div>
  );
}
