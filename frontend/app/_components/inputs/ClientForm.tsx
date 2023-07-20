'use client'

import { ReactElement } from "react";
import FocusLock from 'react-focus-lock';

export default function ClientForm({ children, ...rest }: { children: ReactElement | ReactElement[], [k: string]: any }) {
  return <FocusLock>
    <form {...rest}>
      {children}
    </form>
  </FocusLock>
}