import './../../../style/lexical.css';
import './index.css';
import React, { ComponentProps, useEffect, useState } from 'react';
import styles from './editor.module.scss';
import classNames from 'classnames/bind';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalHistory } from './state/lexicalHistory/LexicalHistoryProvider';
import LexicalRichTextPlugin from './plugins/richTextPlugin';
import ShareStateSenderPlugin from './plugins/shareStateSenderPlugin';
import ShareStateReceiverPlugin from './plugins/shareStateReceiverPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalNodes } from './nodes';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { validateUrl } from './utils';
import { TRANSFORMERS } from '@lexical/markdown';
import DEFAULT_THEME from './theme/PlaygroundEditorTheme';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import ImagesPlugin from './plugins/imagePlugin';
import DragDropPaste from './plugins/dragDropPastePlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import { useLexicalSetting } from './state/lexicalSetting/LexicalSettingProvider';
import dynamic from 'next/dynamic';
import DraggableBlockPlugin from './plugins/draggableBlockPlugin';
import LexicalHTMLPlugin from './plugins/htmlPlugin';
import { useLexicalStateShare } from './state/lexicalStateShare/LexicalStateShareContext';

const cx = classNames.bind(styles);

const DynamicToolBar = dynamic(() => import('./plugins/toolbarPlugin'), {
  ssr: false,
});

const Editor = () => {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const { stateHtml } = useLexicalStateShare();
  const { settings } = useLexicalSetting();
  const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] =
    {
      namespace: 'resister-lexical',
      nodes: [...LexicalNodes],
      onError: (error: Error) => {
        console.error(error);
      },
      theme: DEFAULT_THEME,
    };
  const { historyState } = useLexicalHistory();

  useEffect(() => {
    const domParser = new DOMParser();
    const htmlString = '<p>Hello World!</p>';
    const mimeType = 'text/xml';
    domParser.parseFromString(htmlString, mimeType);
  }, [stateHtml]);

  return (
    <section className={cx('lexical-shell')}>
      <div className={cx('wrapper')}>
        <LexicalComposer initialConfig={initialConfig}>
          <div className={cx('content-editable')}>
            {settings.isRichText && (
              <DynamicToolBar setIsLinkEditMode={setIsLinkEditMode} />
            )}

            <LexicalRichTextPlugin />
            <ShareStateSenderPlugin />
            <AutoFocusPlugin />
            <CheckListPlugin />
            <HorizontalRulePlugin />
            <HashtagPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoFocusPlugin />
            <LinkPlugin validateUrl={validateUrl} />
            <ImagesPlugin />
            <DragDropPaste />
            <DraggableBlockPlugin />
            <HistoryPlugin externalHistoryState={historyState} />
            <InlineImagePlugin />
            <LexicalHTMLPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </LexicalComposer>
      </div>
      <div>
        {stateHtml && <div dangerouslySetInnerHTML={{ __html: stateHtml }} />}
      </div>
      {/* <div className={cx('wrapper')}>
        <LexicalComposer initialConfig={initialConfig}>
          <div className={cx('content-editable')}>
            <LexicalRichTextPlugin />
            <ShareStateReceiverPlugin />
            <AutoFocusPlugin />
            <CheckListPlugin />
            <HorizontalRulePlugin />
            <HashtagPlugin />
            <LinkPlugin validateUrl={validateUrl} />
          </div>
        </LexicalComposer>
      </div> */}
    </section>
  );
};

export default Editor;
