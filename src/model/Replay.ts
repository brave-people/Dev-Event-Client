import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import type { EventErrorForm } from './Event';
import type { Tag } from './Tag';

export type LinkType = 'HOMEPAGE' | 'YOUTUBE';

type Replay = {
  title: string;
  organizer: string;
  description: string;
  display_sequence: number;
  event_link: string;
  start_date_time: string | null;
  end_date_time: string | null;
  cover_image_link: string;
  tags: Tag[];
  use_start_date_time_yn?: 'Y' | 'N';
  use_end_date_time_yn?: 'Y' | 'N';
};

export type ReplayLink = {
  link: string;
  link_type: LinkType;
};

export type ReplayModel = {
  links: ReplayLink[];
} & Replay;

export type Selected = {
  id: number;
  label: string;
  value: LinkType;
};

export type ReplayResponseModel = {
  id: number;
} & ReplayModel;

export type ReplayFormModel = {
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
  startDate: Date | null;
  changeStartDate: (date: Date | null) => void;
  startTime: Date | null;
  setStartTime: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  endTime: Date | null;
  setEndTime: Dispatch<SetStateAction<Date | null>>;
  coverImageUrl?: string;
  setBlob: Dispatch<SetStateAction<FormData | null>>;
  saveForm: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
  isModify?: boolean;
};
