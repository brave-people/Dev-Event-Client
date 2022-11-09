import { atom } from 'jotai';
import type { Tag } from '../model/Tag';

export const eventTagsAtom = atom<Tag[]>([]);
export const replayTagsAtom = atom<Tag[]>([]);
