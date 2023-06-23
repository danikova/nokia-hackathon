import { navBarItems } from '@/app/constans/navBar';
import NavBarItem from './NavBarItem';

export default function BottomNavBar() {
  return (
    <div className="box-border h-16 bg-secondary-menu border-t-2 border-secondary-divider flex">
      {navBarItems.map((item) => {
        return <NavBarItem key={item.title} icon={item.icon} title={item.title} />;
      })}
    </div>
  );
}
