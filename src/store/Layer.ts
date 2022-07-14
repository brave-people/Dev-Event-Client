import { atom } from 'recoil';

// 팝업 레이어 펼침 유무
const alertLayerKey = 'ALERT_LAYER_KEY';
export const alertLayerState = atom({
  key: alertLayerKey,
  default: false,
});
