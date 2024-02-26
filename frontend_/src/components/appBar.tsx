import { Link } from "@tanstack/react-router";
import { ReactElement } from "react";

export default function AppBar({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children?: ReactElement;
}) {
  return (
    <div className="h-full bg-primary px-4">
      <div className="min-h-full flex items-center">
        <Link href="/" className="inline-block">
          <img src="/nokia.svg" height={30} width={90} alt="Nokia logo" />
        </Link>
        <h1 className="ml-4 text-background text-xl">{title}</h1>
        {subTitle && (
          <p className="ml-4 text-background text-xl opacity-70 font-light">
            {subTitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
