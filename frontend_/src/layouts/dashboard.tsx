import AppBar from '@/components/appBar';
import UserButton from '@/components/userButton';
import CountDownTimer from '@/components/countDowntimer';
import SideNavBar from '@/components/navigation/sideNavBar';
import BottomNavBar from '@/components/navigation/bottomNavBar';
import BredCrumbDisplay from '@/components/navigation/breadCrumbDisplay';
import { FloatingWindowService } from '@/components/floatingWindowService';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingWindowService />
      <div
        className="grid min-h-screen overflow-hidden bg-background text-secondary-foreground"
        style={{
          gridTemplateColumns: '[start] 4rem [sidebar-end] 1fr [end]',
          gridTemplateRows:
            '[start] 3rem [appbar-end] 1fr [content-end] 4rem [end]',
        }}
      >
        <div className="z-50 col-[start/end] row-[start/appbar-end] drop-shadow-default">
          <AppBar
            title={import.meta.env.VITE_APP_TITLE as string}
            subTitle={import.meta.env.VITE_APP_SUB_TITLE as string}
          >
            <div className="flex flex-auto flex-row-reverse gap-4 max-md:hidden">
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
              <div className="flex items-center justify-center">
                <CountDownTimer className="text-background" />
              </div>
            </div>
          </AppBar>
        </div>
        <div className="col-[start/sidebar-end] row-[appbar-end/end] max-md:hidden">
          <SideNavBar />
        </div>
        <div className="relative flex flex-col max-md:col-[start/end] max-md:row-[appbar-end/content-end] md:col-[sidebar-end/end] md:row-[appbar-end/end]">
          <div className="content-with-scrollbar h-0 flex-auto overflow-y-auto overflow-x-hidden [--cm-titlebar-h:4rem] max-md:[--cm-titlebar-h:2rem]">
            <div className="absolute left-0 right-0 top-0 z-40">
              <BredCrumbDisplay />
            </div>
            <div className="h-[--cm-titlebar-h]" />
            {children}
          </div>
        </div>
        <div className="col-[start/end] row-[content-end/end] md:hidden">
          <BottomNavBar />
        </div>
      </div>
    </>
  );
}
