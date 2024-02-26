import NavBarItem from "./NavBarItem";
import { navBarItems } from "@/lib/navBar";
import UserButton from "../../components/UserButton";

export default function BottomNavBar() {
  return (
    <div className="box-border h-16 bg-background border-t-2 border-secondary flex">
      {navBarItems.map((item) => {
        return (
          <div
            key={item.title}
            className="hover:bg-secondary hover:cursor-pointer flex-1 hover:shadow-inner"
          >
            <NavBarItem item={item} />
          </div>
        );
      })}
      <div className="hover:bg-secondary hover:cursor-pointer flex-1">
        <div className="flex min-h-full content-center justify-center flex-wrap">
          <div className="flex min-h-full content-center justify-center flex-wrap h-10 w-10 rounded-full ring-2 shadow-primary">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
