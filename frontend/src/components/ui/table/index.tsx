import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";

import "./style.css";
import { useDebounce, useWindowSize } from "@uidotdev/usehooks";

interface FullPageAgGridReactProps<TData = any>
  extends AgGridReactProps<TData> {
  gridRef?: any;
  className?: string;
}

export function FullPageAgGridReact<TData = any>({
  gridRef,
  className,
  ...props
}: FullPageAgGridReactProps<TData>) {
  const { rowData } = props;
  const size = useWindowSize();
  const debouncedSize = useDebounce(size, 100);

  useEffect(() => {
    if (gridRef?.current) {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, [debouncedSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={cn(
        "-mt-[var(--cm-titlebar-h)] h-full w-full box-border",
        className
      )}
      style={
        { "--row-data-count": rowData?.length || 0 } as React.CSSProperties
      }
    >
      <div className="ag-theme-alpine h-full w-full full-page-grid">
        <AgGridReact<TData> ref={gridRef} {...props} />
      </div>
    </div>
  );
}
