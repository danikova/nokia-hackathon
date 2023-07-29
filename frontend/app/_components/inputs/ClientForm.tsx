'use client'

import { useOutsideClickObserver } from "@/app/_lib/helperHooks";
import { ReactElement, useCallback, useRef, useState } from "react";
import FocusLock from 'react-focus-lock';

export default function ClientForm({ children, ...rest }: { children: ReactElement | ReactElement[], [k: string]: any }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const onClick = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const onNotClick = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);
  useOutsideClickObserver(formRef, onNotClick);

  return <FocusLock disabled={!isFocused}>
    <form {...rest} ref={formRef} onClick={onClick}>
      {children}
    </form>
  </FocusLock>
}