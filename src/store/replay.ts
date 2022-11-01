import { atom } from 'jotai';
import type { ReplayLink, ReplayResponseModel } from '../model/Replay';

export const replayAtom = atom<ReplayResponseModel>({
  id: 0,
  title: '',
  organizer: '',
  description: '',
  event_link: '',
  cover_image_link: '',
  display_sequence: 0,
  start_date_time: null,
  end_date_time: null,
  links: [],
  tags: [],
});

// 다시보기링크
export const linksAtom = atom<ReplayLink[]>([]);
