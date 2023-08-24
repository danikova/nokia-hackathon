'use client'

import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { BreadCrumbItem } from "@/app/_constans/breadCrumb";
import { ReactElement } from "react-markdown/lib/react-markdown";

export const globalBreadCrumbAtom = atom<BreadCrumbItem[]>([]);
export const globelBredCrumbChildrenAtom = atom<ReactElement | ReactElement[] | undefined>(undefined);

export default function BreadCrumb({ items }: { items: BreadCrumbItem[] }) {
  const [_, setGlobalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  useEffect(() => {
    setGlobalBreadCrumb([...items]);
  }, [setGlobalBreadCrumb, items]);

  return null;
}

export function BreadCrumbChildren({ children }: { children: ReactElement | ReactElement[] }) {
  const [_, setChildren] = useAtom(globelBredCrumbChildrenAtom);

  useEffect(() => {
    setChildren(children);
    return () => {
      setChildren(undefined);
    }
  }, [setChildren, children]);

  return null;
}