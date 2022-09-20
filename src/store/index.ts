import { userState } from './user';
import { layerState } from './layer';
import { eventTagsState } from './tags';

export const stores = {
  user: userState,
  layer: layerState,
  eventTags: eventTagsState,
};
