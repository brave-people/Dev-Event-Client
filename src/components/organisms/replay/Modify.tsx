import dayjs from 'dayjs';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { fetchUploadImage } from '../../../api/image';
import { modifyReplayApi } from '../../../api/replay/modify';
import { STATUS_200 } from '../../../config/constants';
import type { EventResponse } from '../../../model/Event';
import type { ReplayModel } from '../../../model/Replay';
import type { Tag } from '../../../model/Tag';
import { linksAtom } from '../../../store/replay';
import { useErrorContext } from '../../layouts/ErrorContext';
import Form from './Form';

const Modify = ({ replay }: { replay: EventResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  const replayLinks = useAtomValue(linksAtom);

  const [title, setTitle] = useState(replay?.title);
  const [description, setDescription] = useState(replay?.description);
  const [organizer, setOrganizer] = useState(replay?.organizer);
  const [eventLink, setEventLink] = useState(replay?.event_link);
  const [replayTags, setReplayTags] = useState<Tag[]>(replay.tags);

  // datepicker
  const [startDate, setStartDate] = useState(
    replay.start_date_time ? new Date(replay.start_date_time) : null
  );
  const [startTime, setStartTime] = useState<Date | null>(
    replay.start_date_time && replay.use_start_date_time_yn === 'Y'
      ? new Date(replay.start_date_time)
      : null
  );
  const [endDate, setEndDate] = useState(
    replay.end_date_time ? new Date(replay.end_date_time) : null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    replay.end_date_time && replay.use_end_date_time_yn === 'Y'
      ? new Date(replay.end_date_time)
      : null
  );

  // image
  const [coverImageUrl] = useState(replay?.cover_image_link);
  const [blob, setBlob] = useState<FormData | null>(null);

  const replayTagsName = replayTags?.map(({ tag_name }) => tag_name);

  const { formErrors, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags: replayTagsName,
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

    if (!title || !organizer || !eventLink || !replayTags.length)
      return validateForm();

    const convertTime = (time: Date | null) =>
      time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
    const convertStartTime = convertTime(startTime);
    const convertEndTime = convertTime(endTime);

    const newCoverImageUrl = await uploadImage();

    const body: ReplayModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      links: replayLinks,
      start_date_time: startDate
        ? `${dayjs(startDate).format('YYYY-MM-DD')}${convertStartTime}`
        : null,
      end_date_time: endDate
        ? `${dayjs(endDate).format('YYYY-MM-DD')}${convertEndTime}`
        : null,
      tags: replayTags,
      cover_image_link: newCoverImageUrl || coverImageUrl,
      ...(startDate && { use_start_date_time_yn: startTime ? 'Y' : 'N' }),
      ...(endDate && { use_end_date_time_yn: endTime ? 'Y' : 'N' }),
    };

    const data = await modifyReplayApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) return router.refresh();
    return alert(data.message);
  };

  return (
    <div className="list">
      <Form
        title={title}
        description={description}
        organizer={organizer}
        eventLink={eventLink}
        tags={replayTagsName}
        setTags={setReplayTags}
        changeTitle={changeTitle}
        changeDescription={changeDescription}
        changeOrganizer={changeOrganizer}
        changeEventLink={changeEventLink}
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
    </div>
  );
};

export default Modify;
