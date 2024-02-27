'use client'

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { InfoCard } from "../page";
import { LexicalEditor } from 'lexical';
import { useEffect, useState } from 'react';
import Editor from "@/components/ui/editor";
import { Button } from '@/components/ui/button';
import { snackbarWrapper, usePocketBase } from '@/lib/clientPocketbase';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";


function SetEditorContextPlugin({ setEditor }: { setEditor: (editor: any) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);

  return null;
}

export default function InfoCardEditor({ infoCard }: { infoCard: InfoCard }) {
  const [editor, setEditor] = useState<LexicalEditor | null>(null);
  return <>
    <Editor
      nameSpace={infoCard.id}
      content={() => $convertFromMarkdownString(infoCard.text, TRANSFORMERS)}
      plugins={<SetEditorContextPlugin setEditor={setEditor} />}
    />
    {editor && <SaveButton editor={editor} infoCard={infoCard} />}
  </>
}

function SaveButton({ editor, infoCard }: { editor: LexicalEditor, infoCard: InfoCard }) {
  const pb = usePocketBase();
  return <div className='flex flex-row-reverse'>
    <Button onClick={() => {
      if (editor) {
        editor.getEditorState().read(async () => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          const data = {
            "text": markdown,
          };
          await snackbarWrapper(pb.collection('info_cards').update(infoCard.id, data), 'Card text updated');
        });
      }
    }}>Save</Button>
  </div>
}