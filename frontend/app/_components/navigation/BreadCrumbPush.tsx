'use client'

import { useAtom } from "jotai";
import { useEffect } from "react";
import { BreadCrumbItem } from "@/app/_constans/breadCrumb";
import { globalBreadCrumbAtom } from "@/app/_components/navigation/NavBarItem";

export default function BreadCrumbPush({ item }: { item: BreadCrumbItem }) {
  const [_, setGlobalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  useEffect(() => {
    setGlobalBreadCrumb((old) => {
      return [...old, { ...item }]
    });
    return () => {
      setGlobalBreadCrumb((old) => {
        return [...old.slice(0, old.length)]
      });
    }
  }, [setGlobalBreadCrumb, item]);

  return null;
}