import { ReactElement } from 'react';
import AppBar from '../_components/AppBar';
import SideNavBar from '../_components/navigation/SideNavBar';
import BottomNavBar from '../_components/navigation/BottomNavBar';
import UserAvatar from '../_components/UserAvatar';

export default async function MainLayout({ children }: { children: ReactElement }) {
  return (
    <div
      className="bg-secondary-bg min-h-screen text-primary_text grid overflow-hidden"
      style={{
        gridTemplateColumns: '[start] 4rem [sidebar-end] 1fr [end]',
        gridTemplateRows: '[start] 3rem [appbar-end] 1fr [content-end] 4rem [end]',
      }}
    >
      <div className="drop-shadow-default col-[start/end] row-[start/appbar-end]">
        <AppBar title={process.env.APP_TITLE as string} subTitle={process.env.APP_SUB_TITLE as string}>
          <div className="flex-auto max-md:hidden">
            <div className="flex justify-end">
              <UserAvatar />
            </div>
          </div>
        </AppBar>
      </div>
      <div className="max-md:hidden col-[start/sidebar-end] row-[appbar-end/end]">
        <SideNavBar />
      </div>
      <div className="md:row-[appbar-end/end] md:col-[sidebar-end/end] max-md:row-[appbar-end/content-end] max-md:col-[start/end]">
        {children}
      </div>
      <div className="md:hidden col-[start/end] row-[content-end/end]">
        <BottomNavBar />
      </div>
    </div>
  );
}