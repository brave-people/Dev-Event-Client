import React, { ReactNode, useContext, useMemo } from 'react';
import { LexicalHistoryContext } from './LexicalHistoryContext';
import { createEmptyHistoryState } from '@lexical/react/LexicalHistoryPlugin';

type Props = {
  children: ReactNode;
};

const LexicalHistoryProvider = ({ children }: Props) => {
  const contextValue = useMemo(
    () => ({ historyState: createEmptyHistoryState() }),
    []
  );
  return (
    <LexicalHistoryContext.Provider value={contextValue}>
      {children}
    </LexicalHistoryContext.Provider>
  );
};

export const useLexicalHistory = () => {
  return useContext(LexicalHistoryContext);
};

export default LexicalHistoryProvider;
