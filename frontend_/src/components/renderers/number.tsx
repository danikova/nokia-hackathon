import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function NumberRenderer({
  num,
  className,
  hideDecimal = false,
}: {
  num: number;
  className?: string;
  hideDecimal?: boolean;
}) {
  const [wholeNumber, decimal] = useMemo(
    () => num.toFixed(2).split(".") as [string, string],
    [num]
  );

  if (isNaN(num)) return <span className="opacity-50">-</span>;
  return (
    <div className={cn(className)}>
      <span className="font-bold text-base">{wholeNumber}</span>
      {!hideDecimal && (
        <>
          .
          <span className={cn(decimal === "00" && "text-xs opacity-50")}>
            {decimal}
          </span>
        </>
      )}
    </div>
  );
}
