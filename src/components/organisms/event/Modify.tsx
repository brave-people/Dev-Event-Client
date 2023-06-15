import dayjs from 'dayjs';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { modifyEventsApi } from '../../../api/events/modify';
import { fetchUploadImage } from '../../../api/image';
import { STATUS_200 } from '../../../config/constants';
import type {
  EventType,
  EventResponse,
  EventTimeType,
} from '../../../model/Event';
import type { Tag } from '../../../model/Tag';
import { useErrorContext } from '../../layouts/ErrorContext';
import Form from './Form';

const Modify = ({ event }: { event: EventResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const [title, setTitle] = useState(event?.title);
  const [description, setDescription] = useState(event?.description);
  const [organizer, setOrganizer] = useState(event?.organizer);
  const [eventLink, setEventLink] = useState(event?.event_link);
  const [eventTags, setEventTags] = useState<Tag[]>(event?.tags);
  const [eventTimeType, setEventTimeType] = useState<EventTimeType>(
    event?.event_time_type || 'DATE'
  );

  // datepicker
  const [startDate, setStartDate] = useState(
    event.start_date_time ? new Date(event.start_date_time) : null
  );
  const [startTime, setStartTime] = useState<Date | null>(
    event.start_date_time && event.use_start_date_time_yn === 'Y'
      ? new Date(event.start_date_time)
      : null
  );
  const [endDate, setEndDate] = useState(
    event.end_date_time ? new Date(event.end_date_time) : null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    event.end_date_time && event.use_end_date_time_yn === 'Y'
      ? new Date(event.end_date_time)
      : null
  );

  // image
  const [coverImageUrl] = useState(event?.cover_image_link);
  const [blob, setBlob] = useState<FormData | null>(null);

  const eventTagsName = eventTags?.map(({ tag_name }) => tag_name);

  const { formErrors, validateForm } = useErrorContext({
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
  const changeStartDate = (startDate: Date | null) => {
    setStartDate(startDate);
    if (!startDate || !endDate) return;
    if (endDate < startDate) setEndDate(startDate);
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

  const saveEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !eventTags.length)
      return validateForm();

    const convertTime = (time: Date | null) =>
      time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
    const convertStartTime = convertTime(startTime);
    const convertEndTime = convertTime(endTime);

    const newCoverImageUrl = await uploadImage();

    const body: EventType = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: startDate
        ? `${dayjs(startDate).format('YYYY-MM-DD')}${convertStartTime}`
        : null,
      end_date_time: endDate
        ? `${dayjs(endDate).format('YYYY-MM-DD')}${convertEndTime}`
        : null,
      tags: eventTags,
      cover_image_link: newCoverImageUrl || coverImageUrl,
      event_time_type: eventTimeType,
      ...(startDate && { use_start_date_time_yn: startTime ? 'Y' : 'N' }),
      ...(endDate && { use_end_date_time_yn: endTime ? 'Y' : 'N' }),
    };

    const data = await modifyEventsApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) return router.refresh();
    return alert(data.message);
  };

  return (
    <Form
      title={title}
      description={description}
      organizer={organizer}
      eventLink={eventLink}
      tags={eventTagsName}
      setTags={setEventTags}
      changeTitle={changeTitle}
      changeDescription={changeDescription}
      changeOrganizer={changeOrganizer}
      changeEventLink={changeEventLink}
      eventTimeType={eventTimeType}
      changeEventTimeType={changeEventTimeType}
      startDate={startDate}
      changeStartDate={changeStartDate}
      startTime={startTime}
      setStartTime={setStartTime}
      endDate={endDate}
      setEndDate={setEndDate}
      endTime={endTime}
      setEndTime={setEndTime}
      error={formErrors}
      coverImageUrl={coverImageUrl}
      setBlob={setBlob}
      saveForm={saveEvent}
      isModify={true}
    />
  );
};

export default Modify;
