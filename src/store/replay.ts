import { atom } from 'recoil';
import type { ReplayLink } from '../model/Replay';

// 다시보기링크
const linksKey = 'LINKS_KEY';
export const linksState = atom<ReplayLink[]>({
  key: linksKey,
  default: [],
});
