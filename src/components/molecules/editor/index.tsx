import './../../../style/lexical.css';
import './index.css';
import React, { ComponentProps, useEffect, useState } from 'react';
import styles from './editor.module.scss';
import classNames from 'classnames/bind';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalHistory } from './state/lexicalHistory/LexicalHistoryProvider';
import LexicalRichTextPlugin from './plugins/richTextPlugin';
import ShareStateSenderPlugin from './plugins/shareStateSenderPlugin';
// import ShareStateReceiverPlugin from './plugins/shareStateReceiverPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalNodes } from './nodes';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { validateUrl } from './utils';
import DEFAULT_THEME from './theme/PlaygroundEditorTheme';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import ImagesPlugin from './plugins/imagePlugin';
import DragDropPaste from './plugins/dragDropPastePlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import dynamic from 'next/dynamic';
import DraggableBlockPlugin from './plugins/draggableBlockPlugin';
import LexicalHTMLPlugin from './plugins/htmlPlugin';
import { useLexicalStateShare } from './state/lexicalStateShare/LexicalStateShareContext';
import MarkdownPlugin from './plugins/markdownPlugin';

const cx = classNames.bind(styles);

const DynamicToolBar = dynamic(() => import('./plugins/toolbarPlugin'), {
  ssr: false,
});

const Editor = () => {
  const [isView, setIsView] = useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const { stateHtml } = useLexicalStateShare();
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
            <div className={cx('toolbar-wrapper')}>
              <div className={cx('state-container')}>
                <button
                  className={cx('state-btn', { active: !isView })}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsView(false);
                  }}
                >
                  Write
                </button>
                <button
                  className={cx('state-btn', { active: isView })}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsView(true);
                  }}
                >
                  Preview
                </button>
              </div>
              <DynamicToolBar setIsLinkEditMode={setIsLinkEditMode} />
            </div>
            {!isView && <LexicalRichTextPlugin />}
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
            <MarkdownPlugin />
          </div>
          {isView && (
            <div className={cx('viewer')}>
              {stateHtml && (
                <div dangerouslySetInnerHTML={{ __html: stateHtml }} />
              )}
            </div>
          )}
        </LexicalComposer>
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
