import { ReactElement } from 'react';
import AppBar from '../_components/AppBar';
import SideNavBar from '../_components/navigation/SideNavBar';
import BottomNavBar from '../_components/navigation/BottomNavBar';

export default async function MainLayout({ children }: { children: ReactElement }) {
  return (
    <div className="bg-secondary-bg min-h-screen text-primary_text grid grid-cols-main grid-rows-main overflow-hidden">
      <div className="col-span-2 drop-shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.40)]">
        <AppBar title={process.env.APP_TITLE as string} subTitle={process.env.APP_SUB_TITLE as string} />
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
