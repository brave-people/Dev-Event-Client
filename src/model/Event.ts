import type { TagNameModel, TagModel } from './Tag';

interface Event {
  title: string;
  description: string;
  organizer: string;
  display_sequence: number;
  event_link: string;
  start_date_time: string;
  start_time: string;
  end_date_time: string;
  end_time: string;
  cover_image_link: string;
}

export interface EventModel extends Event {
  tags: TagNameModel[];
}

export interface EventResponseModel extends Event {
  id: number;
  tags: TagModel[];
}
