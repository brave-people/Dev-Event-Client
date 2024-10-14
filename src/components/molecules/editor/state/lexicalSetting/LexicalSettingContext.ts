import { INITIAL_SETTINGS } from './../../constants/setting';
import { LexicalSettingKeyType } from './../../types/setting';
import { Context, createContext } from 'react';

type LexicalSettingContextShape = {
  setOption: (name: LexicalSettingKeyType, value: boolean) => void;
  settings: Record<LexicalSettingKeyType, boolean>;
};

const defaultValue: LexicalSettingContextShape = {
  setOption: (name: LexicalSettingKeyType, value: boolean) => {},
  settings: INITIAL_SETTINGS,
};

export const LexicalSettingContext: Context<LexicalSettingContextShape> =
  createContext<LexicalSettingContextShape>(defaultValue);
