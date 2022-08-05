import { atom } from 'recoil';
import type { Tag } from '../model/Tag';

// 팝업 레이어 펼침 유무
const tagsKey = 'TAGS_KEY';
export const tagsState = atom<Tag[]>({
  key: tagsKey,
  default: [],
});
