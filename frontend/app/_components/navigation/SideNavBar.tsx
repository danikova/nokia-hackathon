import { navBarItems } from '@/app/_constans/navBar';
import NavBarItem from './NavBarItem';

export default function SideNavBar() {
  return (
    <div className="min-h-full bg-secondary-menu border-r-2 border-secondary-divider">
      {navBarItems.map((item) => {
        return (
          <div key={item.title} className="hover:bg-secondary-divider hover:cursor-pointer hover:shadow-inner transition-all h-16">
            <NavBarItem item={item} />
          </div>
        );
      })}
    </div>
  );
}
