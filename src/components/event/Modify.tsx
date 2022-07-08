import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { createTagApi } from '../../pages/api/events/tag';
import { modifyEventsApi } from '../../pages/api/events/modify';
import { STATUS_200 } from '../../config/constants';
import FormContent from './form/Content';
import { useErrorContext } from '../ErrorContext';
import type { MouseEvent } from 'react';
import type { EventModel, EventResponseModel } from '../../model/Event';

const Modify = ({ event }: { event: EventResponseModel }) => {
  const router = useRouter();
  const {
    query: { id = '' },
  } = router;
  const [title, setTitle] = useState(event?.title);
  const [description, setDescription] = useState(event?.description);
  const [organizer, setOrganizer] = useState(event?.organizer);
  const [eventLink, setEventLink] = useState(event?.event_link);
  const [tags, setTags] = useState<string[]>(
    event?.tags.map((tag) => tag.tag_name)
  );
  const [hasTime, setHasTime] = useState(false);

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags,
  });

  // date
  const [startDate, setStartDate] = useState(new Date(event?.start_date_time));
  const [startTime, setStartTime] = useState(new Date(event?.start_date_time));
  const [endDate, setEndDate] = useState(new Date(event?.end_date_time));
  const [endTime, setEndTime] = useState(new Date(event?.end_date_time));

  // image
  const [coverImageUrl, setCoverImageUrl] = useState(event?.cover_image_link);

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

  const saveEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      const allTags = event?.tags;
      if (!allTags.length) {
        await createTagApi({ tag_name: tag });
      } else if (allTags.every((prevTag) => prevTag.tag_name !== tag)) {
        await createTagApi({ tag_name: tag });
      }
    }

    const convertTime = (time: Date) =>
      hasTime ? dayjs(time).format('HH:MM') : '00:00';

    const body: EventModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: `${dayjs(startDate).format('YYYY-MM-DD')} ${convertTime(
        startTime
      )}`,
      start_time: convertTime(startTime),
      end_date_time: `${dayjs(endDate).format('YYYY-MM-DD')} ${convertTime(
        endTime
      )}`,
      end_time: convertTime(endTime),
      tags: tags?.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
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
        tags={tags}
        setTags={setTags}
        allTags={event?.tags}
        hasTime={hasTime}
        setHasTime={changeHasTime}
        changeTitle={changeTitle}
        changeDescription={changeDescription}
        changeOrganizer={changeOrganizer}
        changeEventLink={changeEventLink}
        startDate={startDate}
        setStartDate={setStartDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        error={error}
        coverImageUrl={coverImageUrl}
        setCoverImageUrl={setCoverImageUrl}
        saveForm={saveEvent}
        isModify={true}
      />
    </div>
  );
};

export default Modify;
