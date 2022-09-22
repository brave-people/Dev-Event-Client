import { atom } from 'recoil';
import type { Tag } from '../model/Tag';

const eventTagsKey = 'EVENT_TAGS_KEY';
export const eventTagsState = atom<Tag[]>({
  key: eventTagsKey,
  default: [],
});

const replayTagsKey = 'REPLAY_TAGS_KEY';
export const replayTagsState = atom<Tag[]>({
  key: replayTagsKey,
  default: [],
});
