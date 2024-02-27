import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { BreadCrumbItem } from './types';
import {
  globalBreadCrumbAtom,
  globelBredCrumbChildrenAtom,
} from '@/atoms/breadcrumbs';

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
