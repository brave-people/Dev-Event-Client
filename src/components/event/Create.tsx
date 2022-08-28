import dayjs from 'dayjs';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createEventsApi } from '../../pages/api/events/create';
import { STATUS_201 } from '../../config/constants';
import FormContent from './form/Content';
import { useErrorContext } from '../ErrorContext';
import type { MouseEvent } from 'react';
import type { Tag } from '../../model/Tag';
import type { EventModel, EventTimeType } from '../../model/Event';

export const Create = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventTags, setEventTags] = useState<Tag[]>([]);
  const [eventTimeType, setEventTimeType] = useState<EventTimeType>(
    'DATE' as const
  );

  // date
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [hasStartTime, setHasStartTime] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);

  // image
  const [coverImageUrl, setCoverImageUrl] = useState('');

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
  const changeEventTimeType = (e: MouseEvent, type: EventTimeType) => {
    e.preventDefault();
    e.stopPropagation();
    setEventTimeType(type);
  };
  const changeHasStartTime = () => {
    setHasStartTime(!hasStartTime);
  };
  const changeHasEndTime = () => {
    setHasEndTime(!hasEndTime);
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !eventTagsName)
      return validateForm();

    const convertTime = (time: Date | null) =>
      time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
    const convertStartTime = convertTime(startTime);
    const convertEndTime = convertTime(endTime);

    const body: EventModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: `${dayjs(startDate).format(
        'YYYY-MM-DD'
      )}${convertStartTime}`,
      end_date_time: `${dayjs(endDate).format('YYYY-MM-DD')}${convertEndTime}`,
      tags: eventTags,
      cover_image_link: coverImageUrl,
      event_time_type: eventTimeType,
      use_start_date_time_yn: !!convertStartTime,
      use_end_date_time_yn: !!convertEndTime,
    };

    const data = await createEventsApi({ data: body });
    if (data.status_code === STATUS_201) return await router.reload();
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
        eventTimeType={eventTimeType}
        changeEventTimeType={changeEventTimeType}
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        hasStartTime={hasStartTime}
        setHasStartTime={changeHasStartTime}
        hasEndTime={hasEndTime}
        setHasEndTime={changeHasEndTime}
        setEndTime={setEndTime}
        setCoverImageUrl={setCoverImageUrl}
        saveForm={createEvent}
      />
    </div>
  );
};

export default Create;
