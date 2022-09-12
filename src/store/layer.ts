import { atom } from 'recoil';

// 팝업 레이어 펼침 유무
const layerKey = 'LAYER_KEY';
export const layerState = atom({
  key: layerKey,
  default: false,
});
