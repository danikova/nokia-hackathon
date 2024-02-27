import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { isValidUrl } from "./utils/url";
import { ActionsPlugin } from "./plugins/Actions";
import { AutoLinkPlugin } from "./plugins/AutoLink";
import { EditLinkPlugin } from "./plugins/EditLink";
import { FloatingMenuPlugin } from "./plugins/FloatingMenu";
import { LocalStoragePlugin } from "./plugins/LocalStorage";
import { OpenLinkPlugin } from "./plugins/OpenLink";
import {
  EditorHistoryStateContext,
} from "./context/EditorHistoryState";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";
import { useEditorHistoryState } from "@/lib/hooks";

const EDITOR_NODES = [
  AutoLinkNode,
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

type EditorProps = {
  nameSpace: string;
  onSave?: (editorState: string) => void;
  content?: any;
  plugins?: ReactElement;
  className?: string;
};

export default function Editor(props: EditorProps) {
  const { historyState } = useEditorHistoryState();
  const content = props.content || localStorage.getItem(props.nameSpace);

  return (
    <div
      id="editor-wrapper"
      className={cn(
        props.className,
        "relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2"
      )}
    >
      <EditorHistoryStateContext>
        <LexicalComposer
          initialConfig={{
            namespace: props.nameSpace,
            nodes: EDITOR_NODES,
            editorState: content,
            theme: {
              root: "p-4 border-slate-500 border-2 rounded h-auto min-h-[200px] focus:outline-none focus-visible:border-black",
              link: "cursor-pointer",
              text: {
                bold: "font-semibold",
                underline: "underline",
                italic: "italic",
                strikethrough: "line-through",
                underlineStrikethrough: "underlined-line-through",
              },
            },
            onError: (error) => {
              console.error(error);
            },
          }}
        >
          {/* Official Plugins */}
          <RichTextPlugin
            contentEditable={<ContentEditable spellCheck={false} />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin externalHistoryState={historyState} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ListPlugin />
          <LinkPlugin validateUrl={isValidUrl} />
          {/* Custom Plugins */}
          <ActionsPlugin />
          <AutoLinkPlugin />
          <EditLinkPlugin />
          <FloatingMenuPlugin />
          <LocalStoragePlugin namespace={props.nameSpace} />
          <OpenLinkPlugin />
          {/* Other Custom Plugins */}
          {props.plugins || <></>}
        </LexicalComposer>
      </EditorHistoryStateContext>
    </div>
  );
}

const Placeholder = () => {
  return (
    <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
      Start writing...
    </div>
  );
};
