import { ReactElement } from 'react';
import AppBar from '../_components/AppBar';
import SideNavBar from '../_components/navigation/SideNavBar';
import BottomNavBar from '../_components/navigation/BottomNavBar';
import UserAvatar from '../_components/UserAvatar';

export default async function MainLayout({ children }: { children: ReactElement }) {
  return (
    <div className="bg-secondary-bg min-h-screen text-primary_text grid grid-cols-main grid-rows-main overflow-hidden">
      <div className="col-span-2 drop-shadow-default">
        <AppBar title={process.env.APP_TITLE as string} subTitle={process.env.APP_SUB_TITLE as string}>
          <div className="flex-auto max-md:hidden">
            <div className="flex justify-end">
              <UserAvatar />
            </div>
          </div>
        </AppBar>
      </div>
      <div className="max-md:hidden col-span-1 row-span-2 shadow-inner shadow-slate-400">
        <SideNavBar />
      </div>
      <div className="max-md:col-span-2 md:row-span-2">{children}</div>
      <div className="md:hidden col-span-2 row-start-3">
        <BottomNavBar />
      </div>
    </div>
  );
}
