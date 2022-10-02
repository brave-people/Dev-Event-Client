import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { modifyEventsApi } from '../../pages/api/events/modify';
import { fetchUploadImage } from '../../pages/api/image';
import { STATUS_200 } from '../../config/constants';
import FormContent from './form/Content';
import { useErrorContext } from '../ErrorContext';
import type { MouseEvent } from 'react';
import type {
  EventModel,
  EventResponseModel,
  EventTimeType,
} from '../../model/Event';
import type { Tag } from '../../model/Tag';

const Modify = ({ event }: { event: EventResponseModel }) => {
  const router = useRouter();
  const {
    query: { id = '' },
  } = router;
  const [title, setTitle] = useState(event?.title);
  const [description, setDescription] = useState(event?.description);
  const [organizer, setOrganizer] = useState(event?.organizer);
  const [eventLink, setEventLink] = useState(event?.event_link);
  const [eventTags, setEventTags] = useState<Tag[]>(event?.tags);
  const [eventTimeType, setEventTimeType] = useState<EventTimeType>(
    event?.event_time_type
  );

  // date
  const [startDate, setStartDate] = useState(new Date(event?.start_date_time));
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(event?.start_date_time)
  );
  const [endDate, setEndDate] = useState(new Date(event?.end_date_time));
  const [endTime, setEndTime] = useState<Date | null>(
    new Date(event?.end_date_time)
  );
  const [hasStartTime, setHasStartTime] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);

  // image
  const [coverImageUrl] = useState(event?.cover_image_link);
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

    const convertTime = (time: Date | null, type: 'start' | 'end') => {
      const hasType = type === 'start' ? hasStartTime : hasEndTime;
      if (!time || !hasType) return '00:00';
      return dayjs(time).format('HH:mm');
    };

    const coverImageUrl = await uploadImage();

    const body: EventModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: `${dayjs(startDate).format('YYYY-MM-DD')} ${convertTime(
        startTime,
        'start'
      )}`,
      start_time: convertTime(startTime, 'start'),
      end_date_time: `${dayjs(endDate).format('YYYY-MM-DD')} ${convertTime(
        endTime,
        'end'
      )}`,
      end_time: convertTime(endTime, 'end'),
      tags: eventTags,
      cover_image_link: coverImageUrl,
      event_time_type: eventTimeType,
    };

    const data = await modifyEventsApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) return router.reload();
    return alert(data.message);
  };

  return (
    <div className="list">
      <FormContent
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
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        hasStartTime={hasStartTime}
        setHasStartTime={changeHasStartTime}
        hasEndTime={hasEndTime}
        setHasEndTime={changeHasEndTime}
        error={error}
        coverImageUrl={coverImageUrl}
        setBlob={setBlob}
        saveForm={saveEvent}
        isModify={true}
      />
    </div>
  );
};

export default Modify;
