import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalStateShare } from '../../state/lexicalStateShare/LexicalStateShareContext';

const LexicalHTMLPlugin = () => {
  const { stateStr, setStateHtml } = useLexicalStateShare();
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      setStateHtml(htmlString);
    });
  }, [editor, stateStr]);
  return null;
};

export default LexicalHTMLPlugin;
