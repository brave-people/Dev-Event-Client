import { HistoryState } from '@lexical/react/LexicalHistoryPlugin';
import { Context, createContext } from 'react';

type LexicalHistoryContextShape = {
  historyState?: HistoryState;
};

const defaultValue: LexicalHistoryContextShape = {
  historyState: undefined,
};

export const LexicalHistoryContext: Context<LexicalHistoryContextShape> =
  createContext<LexicalHistoryContextShape>(defaultValue);
