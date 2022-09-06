import { Tag } from './Tag';
import {
  ChangeEventHandler,
  Dispatch,
  MouseEvent,
  SetStateAction,
} from 'react';
import { EventErrorForm } from './Event';

interface Replay {
  title: string;
  description: string;
  display_sequence: number;
  event_link: string;
  start_date_time: string;
  end_date_time: string;
  cover_image_link: string;
  use_start_date_time_yn: 'Y' | 'N';
  use_end_date_time_yn: 'Y' | 'N';
}

export interface ReplayModel extends Replay {
  tags: Tag[];
}

export interface ReplayFormModel {
  title: string;
  changeTitle: (e: { target: { value: string } }) => void;
  error: EventErrorForm<boolean>;
  description: string;
  changeDescription: (e: { target: { value: string } }) => void;
  organizer: string;
  changeOrganizer: (e: { target: { value: string } }) => void;
  eventLink: string;
  changeEventLink: (e: { target: { value: string } }) => void;
  links: { link: string; link_type: string }[];
  changeLinks: (e: { target: { value: string } }) => void;
  tags: string[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
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
