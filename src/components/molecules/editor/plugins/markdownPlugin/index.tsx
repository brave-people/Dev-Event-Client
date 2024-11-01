import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  PASTE_COMMAND,
} from 'lexical';
import React, { useEffect } from 'react';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createListItemNode, $createListNode } from '@lexical/list';

const MarkdownPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removePasteListener = editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        (async () => {
          const clipboardEvent = event as ClipboardEvent;

          clipboardEvent.preventDefault();

          const clipboardData = clipboardEvent.clipboardData
            ?.getData('text/plain')
            .split('\n');

          if (clipboardData) {
            console.log('클립보드 데이터:', clipboardData);

            editor.update(async () => {
              clipboardData.forEach((item: string) => {
                const root = $getRoot();
                if (item.slice(0, 1) === '#') {
                  const idx = item.indexOf(' ');
                  const headingNode = $createHeadingNode(`h${idx}` as any);
                  headingNode.append($createTextNode(item.slice(idx + 1)));
                  root.append(headingNode);
                } else if (item.slice(0, 1) === '>') {
                  const blockquoteNode = $createQuoteNode();
                  blockquoteNode.append($createTextNode(item.slice(2)));
                  root.append(blockquoteNode);
                } else if (item.slice(0, 1) === '-') {
                  const listNode = $createListNode('bullet');
                  const listItem = $createListItemNode();
                  listItem.append($createTextNode(item.slice(2)));
                  listNode.append(listItem);
                  root.append(listNode);
                } else if (parseInt(item.slice(0, 1)) === 1) {
                  const listNode = $createListNode('number');
                  const listItem = $createListItemNode();
                  listItem.append($createTextNode(item.slice(2)));
                  listNode.append(listItem);
                  root.append(listNode);
                } else if (
                  item.slice(0, 2) === '**' &&
                  item.slice(-2) === '**'
                ) {
                  const paragraphNode = $createParagraphNode();
                  const textNode = $createTextNode(`${item.slice(2, -2)}`);
                  paragraphNode.append(textNode);
                  root.append(paragraphNode);
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                } else {
                  const paragraphNode = $createParagraphNode();
                  paragraphNode.append($createTextNode(item));
                  root.append(paragraphNode);
                }
              });
            });
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removePasteListener();
    };
  }, [editor]);
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
};

export default MarkdownPlugin;
