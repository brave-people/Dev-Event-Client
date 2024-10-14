import React, { useCallback, useMemo } from 'react';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import styles from './RichTextPlugin.module.scss';
import classNames from 'classnames/bind';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const cx = classNames.bind(styles);

type Props = {
  placeholder?: string;
};

const LexicalRichTextPlugin = ({ placeholder }: Props) => {
  const [editor] = useLexicalComposerContext();
  const value = useMemo(() => {
    return placeholder ?? 'Type something awesome here!';
  }, [placeholder]);
  const handleFocus = useCallback(() => {
    editor.focus();
  }, []);
  return (
    <RichTextPlugin
      contentEditable={
        <div className={cx('richtext-container')}>
          <ContentEditable
            contentEditable
            className={cx('richtext')}
            role="textbox"
          />
        </div>
      }
      placeholder={
        <div className={cx('placeholder-container')} onClick={handleFocus}>
          <span className={cx('placeholder')}>{value}</span>
        </div>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  );
};

export default LexicalRichTextPlugin;
