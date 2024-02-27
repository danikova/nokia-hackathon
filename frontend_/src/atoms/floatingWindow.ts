import { atom } from 'jotai';
import { v4 as uuid4 } from 'uuid';

export const floatingWindowPropsAtom = atom({
  url: undefined as string | undefined,
  key: uuid4(),
});
