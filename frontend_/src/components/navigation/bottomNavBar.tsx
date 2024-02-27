import NavBarItem from './navBarItem';
import UserButton from '../userButton';
import { navBarItems } from './navBarItems';

export default function BottomNavBar() {
  return (
    <div className="box-border flex h-16 border-t-2 border-secondary bg-background">
      {navBarItems.map(item => {
        return (
          <div
            key={item.title}
            className="flex-1 hover:cursor-pointer hover:bg-secondary hover:shadow-inner"
          >
            <NavBarItem item={item} />
          </div>
        );
      })}
      <div className="flex-1 hover:cursor-pointer hover:bg-secondary">
        <div className="flex min-h-full flex-wrap content-center justify-center">
          <div className="flex h-10 min-h-full w-10 flex-wrap content-center justify-center rounded-full shadow-primary ring-2">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
