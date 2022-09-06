import type {
  Dispatch,
  SetStateAction,
  MouseEvent,
  ChangeEventHandler,
} from 'react';
import type { Tag } from './Tag';

export type EventTimeType = 'DATE' | 'RECRUIT';

interface Event {
  title: string;
  description: string;
  organizer: string;
  display_sequence: number;
  event_link: string;
  start_date_time: string;
  end_date_time: string;
  cover_image_link: string;
  event_time_type: EventTimeType;
  use_start_date_time_yn: boolean;
  use_end_date_time_yn: boolean;
}

export interface EventModel extends Event {
  tags: Tag[];
}

export interface EventResponseModel extends Event {
  id: number;
  tags: Tag[];
}

export interface EventErrorForm<T> {
  title: T;
  organizer: T;
  eventLink: T;
  replayLink?: T;
  tags: T extends string ? string[] : boolean;
}

export interface EventFormModel {
  title: string;
  changeTitle: (e: { target: { value: string } }) => void;
  error: EventErrorForm<boolean>;
  description: string;
  changeDescription: (e: { target: { value: string } }) => void;
  organizer: string;
  changeOrganizer: (e: { target: { value: string } }) => void;
  eventLink: string;
  changeEventLink: (e: { target: { value: string } }) => void;
  tags: string[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
  eventTimeType: EventTimeType;
  changeEventTimeType: (e: MouseEvent, type: EventTimeType) => void;
  hasStartTime?: boolean;
  hasEndTime?: boolean;
  setHasStartTime?: ChangeEventHandler<HTMLInputElement>;
  setHasEndTime?: ChangeEventHandler<HTMLInputElement>;
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date>>;
  startTime: Date | null;
  setStartTime: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date>>;
  endTime: Date | null;
  setEndTime: Dispatch<SetStateAction<Date | null>>;
  coverImageUrl?: string;
  setCoverImageUrl: Dispatch<SetStateAction<string>>;
  saveForm: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  isModify?: boolean;
}

export type EventRouter =
  | '/admin/event'
  | '/admin/replay'
  | '/admin/groups'
  | '/admin/event/tag';
