import { LexicalSettingKeyType } from './../types/setting';

export const DEFAULT_SETTINGS = {
  disableBeforeInput: false,
  emptyEditor: false,
  isAutocomplete: false,
  isCharLimit: false,
  isCharLimitUtf8: false,
  isCollab: false,
  isMaxLength: false,
  isRichText: true,
  measureTypingPerf: false,
  shouldPreserveNewLinesInMarkdown: false,
  shouldUseLexicalContextMenu: false,
  showNestedEditorTreeView: false,
  showTableOfContents: false,
  showTreeView: true,
  tableCellBackgroundColor: true,
  tableCellMerge: true,
} as const;

export const INITIAL_SETTINGS: Record<LexicalSettingKeyType, boolean> = {
  ...DEFAULT_SETTINGS,
};
