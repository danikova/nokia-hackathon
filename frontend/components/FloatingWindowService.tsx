
'use client'

import { v4 as uuid4 } from "uuid";
import { atom, useAtom } from "jotai";
import { FaLink } from 'react-icons/fa'
import { useEffect, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const floatingWindowPropsAtom = atom({
  url: undefined as string | undefined,
  key: uuid4(),
});

type WindowLinkProps = {
  url: string;
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export default function WindowLink({ url, ...props }: WindowLinkProps) {
  const [, setsetFloatingWindowProps] = useAtom(floatingWindowPropsAtom);
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1}>
        <FaLink
          className="text-primary opacity-30 hover:opacity-70 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setsetFloatingWindowProps({ url, key: uuid4() });
          }}
        />
      </TooltipTrigger>
      <TooltipContent {...props}>
        Open in new window
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingWindowService() {
  const windowRef = useRef<Window | null>();
  const [setFloatingWindowProps, setsetFloatingWindowProps] = useAtom(floatingWindowPropsAtom);

  useEffect(() => {
    if (setFloatingWindowProps.url) {
      windowRef.current = window.open(
        setFloatingWindowProps.url,
        "MsgWindow",
        "width=1200,height=800,toolbar=no,menubar=no,resizable=yes"
      );
    }
    return () => {
      windowRef.current?.close();
    };
  }, [setFloatingWindowProps]);

  useEffect(() => {
    const timer = setInterval(function () {
      if (windowRef.current?.closed) {
        clearInterval(timer);
        setsetFloatingWindowProps({ url: undefined, key: uuid4() });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [windowRef, setsetFloatingWindowProps]);

  return null;
}
