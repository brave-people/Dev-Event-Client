import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $setSelection,
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  PASTE_COMMAND,
} from 'lexical';
import React, { useEffect } from 'react';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createListItemNode, $createListNode } from '@lexical/list';

const MarkdownPlugin = () => {
  const [editor] = useLexicalComposerContext();

  // useEffect(() => {
  //   const removeListener = editor.registerTextContentListener((textContent) => {
  //     editor.update(() => {
  //       console.log('textContent:', textContent);
  //       console.log(textContent.length);
  //       const root = $getRoot();
  //       if (
  //         textContent.length > 4 &&
  //         textContent.slice(0, 2) === '``' &&
  //         textContent.slice(-2) === '``'
  //       ) {
  //         const selection = $getSelection();
  //         if (selection) {
  //           $setSelection(null); // 선택을 null로 설정하여 선택을 지움
  //         }
  //         const paragraphNode = $createParagraphNode();
  //         const textNode = $createTextNode(
  //           `${textContent.slice(2, -2)}`
  //         ).setFormat('code');
  //         paragraphNode.append(textNode);
  //         root?.append(paragraphNode);
  //       }
  //     });
  //   });

  //   return () => {
  //     removeListener();
  //   };
  // }, [editor]);

  useEffect(() => {
    const removePasteListener = editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        (async () => {
          const clipboardEvent = event as ClipboardEvent;

          clipboardEvent.preventDefault();

          console.log('clipboardEvent:', clipboardEvent);

          const clipboardData = clipboardEvent.clipboardData
            ?.getData('text/plain')
            .split('\n');

          if (clipboardData) {
            console.log('클립보드 데이터:', clipboardData);

            editor.update(async () => {
              if (
                clipboardData &&
                clipboardData.length !== 0 &&
                !isNaN(
                  parseInt(
                    clipboardData[0].substring(
                      clipboardData[0].indexOf(clipboardData[0].trimStart())
                    )
                  )
                )
              ) {
                const root = $getRoot();
                clipboardData.forEach((item: string) => {
                  const value = parseInt(
                    item.substring(item.indexOf(item.trimStart()))
                  );
                  const digit = value.toString().length;
                  if (!isNaN(value)) {
                    const listNode = $createListNode('number');
                    const listItem = $createListItemNode();

                    listItem.append($createTextNode(item.slice(digit + 1)));
                    listNode.append(listItem);
                    root.append(listNode);
                  } else {
                    return;
                  }
                });
              } else {
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
                    (item.slice(0, 2) === '**' && item.slice(-2) === '**') ||
                    (item.slice(0, 2) === '__' && item.slice(-2) === '__')
                  ) {
                    console.log('check');
                    const paragraphNode = $createParagraphNode();
                    const textNode = $createTextNode(
                      `${item.slice(2, -2)}`
                    ).setFormat('bold');
                    paragraphNode.append(textNode);
                    root.append(paragraphNode);
                  } else if (
                    item.slice(0, 2) === '``' &&
                    item.slice(-2) === '``'
                  ) {
                    const paragraphNode = $createParagraphNode();
                    const textNode = $createTextNode(
                      `${item.slice(2, -2)}`
                    ).setFormat('code');
                    paragraphNode.append(textNode);
                    root.append(paragraphNode);
                  } else {
                    const paragraphNode = $createParagraphNode();
                    paragraphNode.append($createTextNode(item));
                    root.append(paragraphNode);
                  }
                });
              }
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
