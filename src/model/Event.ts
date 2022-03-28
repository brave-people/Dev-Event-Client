import type { Dispatch, SetStateAction, MouseEvent } from 'react';
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
  allTags: TagModel[];
  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;
  startTime: Date;
  setStartTime: Dispatch<SetStateAction<Date>>;
  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;
  endTime: Date;
  setEndTime: Dispatch<SetStateAction<Date>>;
  coverImageUrl?: string;
  setCoverImageUrl: Dispatch<SetStateAction<string>>;
  saveForm: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
}
