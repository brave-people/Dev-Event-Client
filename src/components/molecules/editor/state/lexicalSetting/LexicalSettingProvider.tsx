import { DEFAULT_SETTINGS, INITIAL_SETTINGS } from './../../constants/setting';
import {
  LexicalSettingKeyType,
  LexicalSettingType,
} from './../../types/setting';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { LexicalSettingContext } from './LexicalSettingContext';

type Props = {
  children: ReactNode;
};

const LexicalSettingProvider = ({ children }: Props) => {
  const [settings, setSettings] =
    useState<LexicalSettingType>(INITIAL_SETTINGS);

  const setOption = useCallback(
    (setting: LexicalSettingKeyType, value: boolean) => {
      setSettings((options) => ({
        ...options,
        [setting]: value,
      }));
      setURLParam(setting, value);
    },
    []
  );

  const setURLParam = useCallback(
    (param: LexicalSettingKeyType, value: null | boolean) => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      if (value !== DEFAULT_SETTINGS[param]) {
        params.set(param, String(value));
      } else {
        params.delete(param);
      }
      url.search = params.toString();
      window.history.pushState(null, '', url.toString());
    },
    []
  );

  const contextValue = useMemo(() => {
    return {
      settings,
      setOption,
    };
  }, [setOption, settings]);

  return (
    <LexicalSettingContext.Provider value={contextValue}>
      {children}
    </LexicalSettingContext.Provider>
  );
};

export const useLexicalSetting = () => {
  return useContext(LexicalSettingContext);
};

export default LexicalSettingProvider;
