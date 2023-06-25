import { navBarItems } from '@/app/constans/navBar';
import NavBarItem from './NavBarItem';

export default function SideNavBar() {
  return (
    <div className="min-h-full bg-secondary-menu border-r-2 border-secondary-divider">
      {navBarItems.map((item) => {
        return (
          <div className="hover:bg-secondary-divider hover:cursor-pointer">
            <NavBarItem key={item.title} icon={item.icon} title={item.title} />
          </div>
        );
      })}
    </div>
  );
}
