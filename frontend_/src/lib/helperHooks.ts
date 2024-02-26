'use client';

import { MutableRefObject, useEffect } from 'react';

export function useOutsideClickObserver(ref: MutableRefObject<any>, onNotClick: (event: MouseEvent) => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onNotClick(event);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onNotClick]);
}
