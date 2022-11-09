import dayjs from 'dayjs';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';
import { createReplayApi } from '../../../pages/api/replay/create';
import { linksAtom } from '../../../store/replay';
import { STATUS_201 } from '../../../config/constants';
import FormContent from '../form/replay/Content';
import { useErrorContext } from '../../layouts/ErrorContext';
import type { MouseEvent } from 'react';
import type { Tag } from '../../../model/Tag';
import type { ReplayModel } from '../../../model/Replay';
import { fetchUploadImage } from '../../../pages/api/image';

export const Create = () => {
  const router = useRouter();
  const replayLinks = useAtomValue(linksAtom);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventTags, setEventTags] = useState<Tag[]>([]);

  // date
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  // image
  const [blob, setBlob] = useState<FormData | null>(null);

  const eventTagsName = eventTags.map(({ tag_name }) => tag_name);

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags: eventTagsName,
  });

  const changeTitle = (e: { target: { value: string } }) => {
    setTitle(e.target.value);
  };
  const changeDescription = (e: { target: { value: string } }) => {
    setDescription(e.target.value);
  };
  const changeOrganizer = (e: { target: { value: string } }) => {
    setOrganizer(e.target.value);
  };
  const changeEventLink = (e: { target: { value: string } }) => {
    setEventLink(e.target.value);
  };

  const uploadImage = async () => {
    if (blob === null) return '';

    const data = await fetchUploadImage({
      fileType: 'DEV_EVENT',
      body: blob,
    });

    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const convertTime = (time: Date | null) =>
    time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
  const convertStartTime = convertTime(startTime);
  const convertEndTime = convertTime(endTime);

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !eventTagsName)
      return validateForm();

    const coverImageUrl = await uploadImage();

    const body: ReplayModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      links: replayLinks,
      start_date_time: `${dayjs(startDate).format(
        'YYYY-MM-DD'
      )}${convertStartTime}`,
      end_date_time: `${dayjs(endDate).format('YYYY-MM-DD')}${convertEndTime}`,
      tags: eventTags,
      cover_image_link: coverImageUrl,
      use_start_date_time_yn: convertStartTime ? 'Y' : 'N',
      use_end_date_time_yn: convertEndTime ? 'Y' : 'N',
    };

    const data = await createReplayApi({ data: body });

    if (data.status_code === STATUS_201) return router.reload();
    return alert(data.message);
  };

  return (
    <div className="list">
      <FormContent
        title={title}
        changeTitle={changeTitle}
        error={error}
        description={description}
        changeDescription={changeDescription}
        organizer={organizer}
        changeOrganizer={changeOrganizer}
        eventLink={eventLink}
        changeEventLink={changeEventLink}
        tags={eventTagsName}
        setTags={setEventTags}
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        setBlob={setBlob}
        saveForm={createEvent}
      />
    </div>
  );
};

export default Create;
