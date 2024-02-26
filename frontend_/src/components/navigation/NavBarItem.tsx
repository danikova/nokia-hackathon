"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { NavBarItem } from "@/lib/navBar";
import { Link } from "@tanstack/react-router";

export default function NavBarItem({ item }: { item: NavBarItem }) {
  const pathname = "";

  const isActive = useMemo(() => {
    const isActive = pathname.startsWith(item.rootPath);
    return isActive;
  }, [item, pathname]);

  return (
    <Link
      href={item.rootPath}
      className={cn(
        "min-h-full flex items-center justify-center m-auto",
        isActive &&
          "bg-primary/20 text-primary md:border-l-4 max-md:border-b-4 border-primary shadow-inner"
      )}
    >
      {item.icon}
    </Link>
  );
}
