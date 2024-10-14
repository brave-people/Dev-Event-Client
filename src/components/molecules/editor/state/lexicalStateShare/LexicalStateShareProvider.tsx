import { EditorState } from 'lexical';
import React, { ReactNode, useMemo, useState } from 'react';
import { LexicalStateShareContext } from './LexicalStateShareContext';

type Props = {
  children: ReactNode;
};

const LexicalStateShareProvider = ({ children }: Props) => {
  const [stateStr, setStateStr] = useState<string | null>(null);
  const [state, setState] = useState<EditorState | null>(null);
  const [stateHtml, setStateHtml] = useState<string | null>(null);

  const contextValue = useMemo(() => {
    return {
      stateStr,
      setStateStr,
      state,
      setState,
      stateHtml,
      setStateHtml,
    };
  }, [stateStr, state, stateHtml]);

  return (
    <LexicalStateShareContext.Provider value={contextValue}>
      {children}
    </LexicalStateShareContext.Provider>
  );
};

export default LexicalStateShareProvider;
