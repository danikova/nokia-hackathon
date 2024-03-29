import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Extension, useCodeMirror } from '@uiw/react-codemirror';
import {
  vscodeDark,
  defaultSettingsVscodeDark,
} from '@uiw/codemirror-theme-vscode';

export default function Code({
  children,
  extensions,
  className,
}: {
  children: string;
  extensions?: Extension[];
  className?: string;
}) {
  const editor = useRef<HTMLDivElement>(null);
  const { setContainer } = useCodeMirror({
    container: editor.current,
    value: children,
    theme: vscodeDark,
    editable: false,
    height: '100%',
    width: '100%',
    extensions: extensions || [],
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor, setContainer]);

  return (
    <div
      className={cn(
        'high-vis-scrollbar relative box-border h-full w-full overflow-auto rounded-md',
        className
      )}
      style={{
        backgroundColor: defaultSettingsVscodeDark.background,
        border: `1px solid ${defaultSettingsVscodeDark.background}`,
      }}
    >
      <div ref={editor} className="absolute h-full w-full break-words" />
    </div>
  );
}
