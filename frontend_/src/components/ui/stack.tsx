import { cn } from "@/lib/utils";

export function Stack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex -space-x-2", className)}>{children}</div>;
}
