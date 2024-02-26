"use client";

import { useEffect } from "react";
import { atom, useSetAtom } from "jotai";
import { BreadCrumbItem } from "./breadCrumb";

export const globalBreadCrumbAtom = atom<BreadCrumbItem[]>([]);
export const globelBredCrumbChildrenAtom = atom<
  JSX.Element | JSX.Element[] | undefined
>(undefined);

export default function BreadCrumb({ items }: { items: BreadCrumbItem[] }) {
  const setGlobalBreadCrumb = useSetAtom(globalBreadCrumbAtom);

  useEffect(() => {
    setGlobalBreadCrumb([...items]);
  }, [setGlobalBreadCrumb, items]);

  return null;
}

export function BreadCrumbChildren({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const setChildren = useSetAtom(globelBredCrumbChildrenAtom);

  useEffect(() => {
    setChildren(children);
    return () => {
      setChildren(undefined);
    };
  }, [setChildren, children]);

  return null;
}
