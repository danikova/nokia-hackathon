import { cn } from "@/lib/utils";
import NavBarItemC from "./navBarItem";
import { NavBarItem, navBarItems, staffNavBarItems } from "@/lib/navBar";
import {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SideNavBar() {
  const role: string = "user";
  const lastItem = navBarItems[navBarItems.length - 1];

  return (
    <div className="flex flex-col justify-between min-h-full bg-background border-r-2 border-secondary">
      <div>
        {navBarItems.slice(0, -1).map((item) => (
          <NavBarItemWrapper key={item.title} item={item} />
        ))}
        {role === "staff" && (
          <>
            <Divider className="my-4" />
            {staffNavBarItems.map((item) => (
              <NavBarItemWrapper key={item.title} item={item} />
            ))}
          </>
        )}
      </div>
      <div>
        <Divider />
        <NavBarItemWrapper item={lastItem} />
      </div>
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t-2 border-secondary", className)} />;
}

function NavBarItemWrapper({ item }: { item: NavBarItem }) {
  return (
    <Tooltip delayDuration={600} key={item.title}>
      <TooltipTrigger className="hover:bg-secondary hover:cursor-pointer hover:shadow-inner transition-all h-16 w-16">
        <NavBarItemC item={item} />
      </TooltipTrigger>
      <TooltipContent side="right">
        {item.title}
        {!!item.shortDescription && (
          <TooltipDescription>{item.shortDescription}</TooltipDescription>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
