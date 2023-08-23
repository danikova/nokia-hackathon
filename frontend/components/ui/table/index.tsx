'use client';

import React from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

import './style.css';

export function FullPageAgGridReact<TData = any>(props: AgGridReactProps<TData>) {
  const { rowData } = props;

  return (
    <div className='-mt-[var(--cm-titlebar-h)] h-full w-full box-border' style={{ '--row-data-count': rowData?.length || 0 } as React.CSSProperties}>
      <div className='ag-theme-alpine h-full w-full scoreboard-grid'>
        <AgGridReact<TData>
          {...props} />
      </div>
    </div>
  );
}
