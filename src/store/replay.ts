import { atom } from 'jotai';
import type { ReplayLink } from '../model/Replay';

// 다시보기링크
export const linksAtom = atom<ReplayLink[]>([]);
