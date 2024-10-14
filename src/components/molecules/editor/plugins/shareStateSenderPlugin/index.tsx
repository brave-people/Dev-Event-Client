import React, { useEffect } from 'react';
import { useLexicalStateShare } from './../../state/lexicalStateShare/LexicalStateShareContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const ShareStateSenderPlugin = () => {
  const { setStateStr } = useLexicalStateShare();
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const listener = editor.registerUpdateListener(() => {
      editor.update(() => {
        const _state = JSON.stringify(editor.getEditorState().toJSON());
        setStateStr(_state);
      });
    });

    return () => {
      listener();
    };
  }, [editor]);

  return null;
};

export default ShareStateSenderPlugin;
