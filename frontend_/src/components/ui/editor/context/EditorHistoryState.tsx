import { ReactNode, useMemo } from 'react';

import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { EditorHistoryContext } from '@/lib/contexts';

export function EditorHistoryStateContext({
  children,
}: {
  children: ReactNode;
}) {
  const h = useMemo(() => ({ historyState: createEmptyHistoryState() }), []);
  return (
    <EditorHistoryContext.Provider value={h}>
      {children}
    </EditorHistoryContext.Provider>
  );
}
