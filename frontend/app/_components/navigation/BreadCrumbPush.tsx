'use client'

import { useAtom } from "jotai";
import { useEffect } from "react";
import { BreadCrumbItem } from "@/app/_constans/breadCrumb";
import { globalBreadCrumbAtom } from "@/app/_components/navigation/NavBarItem";

export default function BreadCrumbPush({ item }: { item: BreadCrumbItem }) {
  const [_, setGlobalBreadCrumb] = useAtom(globalBreadCrumbAtom);

  useEffect(() => {
    setGlobalBreadCrumb((old) => [...old, { ...item }]);
    return () => {
      setGlobalBreadCrumb((old) => {
        const newArr = [...old];
        newArr.splice(-1);
        return newArr;
      });
    }
  }, [setGlobalBreadCrumb, item]);

  return null;
}