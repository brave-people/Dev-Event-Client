import type {
  Dispatch,
  SetStateAction,
  MouseEvent,
  ChangeEventHandler,
} from 'react';
import type { TagName, Tag } from './Tag';

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
  tags: TagName[];
}

export interface EventResponseModel extends Event {
  id: number;
  tags: Tag[];
}

export interface EventErrorFormProps {
  title: string;
  organizer: string;
  eventLink: string;
  tags: string[];
}

export interface EventErrorFormModel {
  title: boolean;
  organizer: boolean;
  eventLink: boolean;
  tags: boolean;
}

export interface EventFormModel {
  title: string;
  changeTitle: (e: { target: { value: string } }) => void;
  error: EventErrorFormModel;
  description: string;
  changeDescription: (e: { target: { value: string } }) => void;
  organizer: string;
  changeOrganizer: (e: { target: { value: string } }) => void;
  eventLink: string;
  changeEventLink: (e: { target: { value: string } }) => void;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  allTags: Tag[];
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

export type EventRouter = '/admin/event' | '/admin/replay' | '/admin/groups';
