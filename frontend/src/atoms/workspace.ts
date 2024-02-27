import { ReviewDialogProps } from '@/routes/_private/ranking/-components/reviewDialog/type';
import { atom } from 'jotai';

export const workspaceDialogStateAtom = atom({
  open: false,
  props: null as null | ReviewDialogProps,
});
export const workspaceInfoOpenAtom = atom(false);
