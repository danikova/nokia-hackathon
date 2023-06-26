import { ReactElement } from 'react';
import { IconType } from 'react-icons';

export default function NavBarItem({ icon: Icon, title }: { icon: IconType; title: string; isActive?: boolean }) {
  return (
    <div
      className="
    h-16 w-16 flex items-center justify-center m-auto"
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}
