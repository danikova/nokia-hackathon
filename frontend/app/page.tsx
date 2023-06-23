import AppBar from './components/AppBar';
import BottomNavBar from './components/NavBar/BottomNavBar';
import ContentContainer from './components/ContentContainer';
import SideNavBar from './components/NavBar/SideNavBar';

export default function Home() {
  return (
    <main>
      <div className="bg-secondary-bg min-h-screen text-primary_text grid grid-cols-main grid-rows-main overflow-hidden">
        <div className="col-span-2">
          <AppBar
            title="Hackathon"
            // subTitle="2023.10"
          />
        </div>
        <div className="max-md:hidden col-span-1 row-span-2">
          <SideNavBar />
        </div>
        <div className="max-md:col-span-2 md:row-span-2">
          <ContentContainer />
        </div>
        <div className="md:hidden col-span-2 row-start-3">
          <BottomNavBar />
        </div>
      </div>
    </main>
  );
}
