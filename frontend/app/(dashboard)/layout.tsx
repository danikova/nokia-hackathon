import { ReactElement } from 'react';
import AppBar from '../_components/AppBar';
import TitleBar from '../_components/TitleBar';
import UserAvatar from '../_components/UserAvatar';
import UserUpdater from '../_components/UserUpdater';
import SideNavBar from '../_components/navigation/SideNavBar';
import BottomNavBar from '../_components/navigation/BottomNavBar';

export default async function MainLayout({ children }: { children: ReactElement }) {
  return (
    <>
      <UserUpdater />
      <div
        className="bg-background min-h-screen text-secondary-foreground grid overflow-hidden"
        style={{
          gridTemplateColumns: '[start] 4rem [sidebar-end] 1fr [end]',
          gridTemplateRows: '[start] 3rem [appbar-end] 1fr [content-end] 4rem [end]',
        }}
      >
        <div className="drop-shadow-default col-[start/end] row-[start/appbar-end] z-50">
          <AppBar title={process.env.APP_TITLE as string} subTitle={process.env.APP_SUB_TITLE as string}>
            <div className="flex flex-auto flex-row-reverse max-md:hidden">
              <div className="flex items-center justify-center">
                <UserAvatar />
              </div>
            </div>
          </AppBar>
        </div>
        <div className="max-md:hidden col-[start/sidebar-end] row-[appbar-end/end]">
          <SideNavBar />
        </div>
        <div className="md:row-[appbar-end/end] md:col-[sidebar-end/end] max-md:row-[appbar-end/content-end] max-md:col-[start/end] flex flex-col relative">
          <div className='content-with-scrollbar flex-auto h-0 overflow-y-auto overflow-x-hidden [--cm-titlebar-h:4rem] max-md:[--cm-titlebar-h:2rem]'>
            <div className='absolute top-0 left-0 right-0 z-40'>
              <TitleBar />
            </div>
            <div className='h-[--cm-titlebar-h]' />
            {children}
          </div>
        </div>
        <div className="md:hidden col-[start/end] row-[content-end/end]">
          <BottomNavBar />
        </div>
      </div>
    </>
  );
}
