import { userState } from './user';
import { layerState } from './layer';
import { eventTagsState, replayTagsState } from './tags';

export const stores = {
  user: userState,
  layer: layerState,
  eventTags: eventTagsState,
  replayTags: replayTagsState,
};
