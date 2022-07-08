import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { createTagApi } from '../../pages/api/events/tag';
import { createEventsApi } from '../../pages/api/events/create';
import { STATUS_201 } from '../../config/constants';
import FormContent from './form/Content';
import { useErrorContext } from '../ErrorContext';
import type { MouseEvent } from 'react';
import type { TagModel } from '../../model/Tag';
import type { EventModel } from '../../model/Event';

export const Create = ({ allTags }: { allTags: TagModel[] }) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [hasTime, setHasTime] = useState(false);

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags,
  });

  // date
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

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
  const changeHasTime = () => {
    setHasTime(!hasTime);
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      if (!allTags?.length) {
        await createTagApi({ tag_name: tag });
      } else if (allTags.every((prevTag) => prevTag.tag_name !== tag)) {
        await createTagApi({ tag_name: tag });
      }
    }

    const body: EventModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: dayjs(startDate).format('YYYY-MM-DD') + ' 00:00',
      start_time: hasTime ? dayjs(startTime).format('HH:MM') : '00:00',
      end_date_time: dayjs(endDate).format('YYYY-MM-DD') + ' 00:00',
      end_time: hasTime ? dayjs(endTime).format('HH:MM') : '00:00',
      tags: tags.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
    };

    const data = await createEventsApi({ data: body });
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
        tags={tags}
        setTags={setTags}
        allTags={allTags}
        hasTime={hasTime}
        setHasTime={changeHasTime}
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        setCoverImageUrl={setCoverImageUrl}
        saveForm={(e: MouseEvent<HTMLButtonElement>) => createEvent(e)}
      />
    </div>
  );
};

export default Create;
