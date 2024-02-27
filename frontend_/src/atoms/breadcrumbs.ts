import { BreadCrumbItem } from '@/components/navigation/types';
import { atom } from 'jotai';

export const globalBreadCrumbAtom = atom<BreadCrumbItem[]>([]);
export const globelBredCrumbChildrenAtom = atom<
  JSX.Element | JSX.Element[] | undefined
>(undefined);
