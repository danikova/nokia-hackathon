import { v4 as uuid4 } from "uuid";
import { atom, useAtom } from "jotai";
import { FaLink } from "react-icons/fa";
import { useEffect, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const floatingWindowPropsAtom = atom({
  url: undefined as string | undefined,
  key: uuid4(),
});

type WindowLinkProps = {
  url: string;
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export default function WindowLink({ url, ...props }: WindowLinkProps) {
  const [, setFloatingWindowProps] = useAtom(floatingWindowPropsAtom);
  const wasItClicked = useRef(false);

  useEffect(() => {
    return () => {
      if (wasItClicked.current) {
        setFloatingWindowProps({ url: undefined, key: uuid4() });
      }
    };
  }, [setFloatingWindowProps]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <FaLink
          className="text-primary opacity-30 hover:opacity-70 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            wasItClicked.current = true;
            setFloatingWindowProps({ url, key: uuid4() });
          }}
        />
      </TooltipTrigger>
      <TooltipContent {...props}>Open in new window</TooltipContent>
    </Tooltip>
  );
}

export function FloatingWindowService() {
  const windowRef = useRef<Window | null>();
  const [floatingWindowProps, setFloatingWindowProps] = useAtom(
    floatingWindowPropsAtom
  );

  useEffect(() => {
    if (floatingWindowProps.url) {
      windowRef.current = window.open(
        floatingWindowProps.url,
        "MsgWindow",
        "width=1200,height=800,toolbar=no,menubar=no,resizable=yes"
      );
    }
    return () => {
      windowRef.current?.close();
    };
  }, [floatingWindowProps]);

  useEffect(() => {
    const timer = setInterval(function () {
      if (windowRef.current?.closed) {
        clearInterval(timer);
        setFloatingWindowProps({ url: undefined, key: uuid4() });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [windowRef, setFloatingWindowProps]);

  useEffect(() => {
    return () => windowRef.current?.close();
  }, []);

  return null;
}
