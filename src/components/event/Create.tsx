import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { createTagApi } from '../../pages/api/events/tag';
import { createEventsApi } from '../../pages/api/events/create';
import getTags from '../../server/api/events/getTags';
import { STATUS_201 } from '../../config/constants';
import FormContent from './form/Content';
import { useErrorContext } from '../ErrorContext';
import type { MouseEvent } from 'react';
import type { Tag } from '../../model/Tag';
import type { EventModel } from '../../model/Event';
import type { TokenModel } from '../../model/User';

export const Create = ({ token }: { token: TokenModel }) => {
  const router = useRouter();
  const allTags = useRef<Tag[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags,
  });

  // date
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [hasStartTime, setHasStartTime] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);

  // image
  const [coverImageUrl, setCoverImageUrl] = useState('');

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
  const changeHasStartTime = () => {
    setHasStartTime(!hasStartTime);
  };
  const changeHasEndTime = () => {
    setHasEndTime(!hasEndTime);
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      if (!allTags.current?.length) {
        await createTagApi({ tag_name: tag });
      } else if (allTags.current.every((prevTag) => prevTag.tag_name !== tag)) {
        await createTagApi({ tag_name: tag });
      }
    }

    const convertTime = (time: Date | null, type: 'start' | 'end') => {
      const hasType = type === 'start' ? hasStartTime : hasEndTime;
      if (!time || !hasType) return '00:00';
      return dayjs(time).format('HH:mm');
    };

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
      tags: tags.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
    };

    const data = await createEventsApi({ data: body });
    if (data.status_code === STATUS_201) return router.reload();
    return alert(data.message);
  };

  useEffect(() => {
    if (allTags.current.length) return;

    const setAllTags = async () => {
      return (allTags.current = await getTags(token['access_token']));
    };

    setAllTags();
  }, []);

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
        tags={tags}
        setTags={setTags}
        allTags={allTags.current}
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
        saveForm={(e: MouseEvent<HTMLButtonElement>) => createEvent(e)}
      />
    </div>
  );
};

export default Create;
