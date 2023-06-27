import { navBarItems } from '@/app/_constans/navBar';
import NavBarItem from './NavBarItem';

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
    </div>
  );
}
