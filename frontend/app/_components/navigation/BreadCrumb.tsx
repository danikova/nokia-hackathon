'use client'

import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { BreadCrumbItem } from "@/app/_constans/breadCrumb";

export const globalBreadCrumbAtom = atom<BreadCrumbItem[]>([]);

export default function BreadCrumb({ items }: { items: BreadCrumbItem[] }) {
  const [_, setGlobalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  useEffect(() => {
    setGlobalBreadCrumb([...items]);
  }, [setGlobalBreadCrumb, items]);

  return null;
}