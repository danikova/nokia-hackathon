'use client'

import { useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import {
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

import { useEditorHistoryState } from "../context/EditorHistoryState";
import { IconButton } from "../IconButton";
import { Button } from "../../button";

export function ActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const { historyState } = useEditorHistoryState();

  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const { undoStack, redoStack } = historyState ?? {};
  const [hasUndo, setHasUndo] = useState(undoStack?.length !== 0);
  const [hasRedo, setHasRedo] = useState(redoStack?.length !== 0);

  const MandatoryPlugins = useMemo(() => {
    return <ClearEditorPlugin />;
  }, []);

  useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
            return;
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        });
      });
    },
    [editor]
  );

  useEffect(
    function checkEditorHistoryActions() {
      return editor.registerUpdateListener(() => {
        setHasRedo(redoStack?.length !== 0);
        setHasUndo(undoStack?.length !== 0);
      });
    },
    [editor, undoStack, redoStack]
  );

  return (
    <>
      {MandatoryPlugins}
      <div className="flex gap-3 my-4">
        <IconButton
          icon="clear"
          disabled={isEditorEmpty}
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
          }}
        />
        <div className="flex gap-1">
          <IconButton
            icon="undo"
            disabled={!hasUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
          />
          <IconButton
            icon="redo"
            disabled={!hasRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
          />
        </div>
      </div>
    </>
  );
}
