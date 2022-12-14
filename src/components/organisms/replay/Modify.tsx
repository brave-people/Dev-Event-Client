import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { linksAtom } from '../../../store/replay';
import { modifyReplayApi } from '../../../pages/api/replay/modify';
import { fetchUploadImage } from '../../../pages/api/image';
import { STATUS_200 } from '../../../config/constants';
import FormContent from '../form/replay/Content';
import { useErrorContext } from '../../layouts/ErrorContext';
import type { MouseEvent } from 'react';
import type { ReplayModel, ReplayResponseModel } from '../../../model/Replay';
import type { Tag } from '../../../model/Tag';

const Modify = ({ replay }: { replay: ReplayResponseModel }) => {
  const router = useRouter();
  const {
    query: { id = '' },
  } = router;

  const links = useAtomValue(linksAtom);

  const [title, setTitle] = useState(replay?.title);
  const [description, setDescription] = useState(replay?.description);
  const [organizer, setOrganizer] = useState(replay?.organizer);
  const [eventLink, setEventLink] = useState(replay?.event_link);
  const [replayTags, setReplayTags] = useState<Tag[]>(replay.tags);

  // date
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

  const { error, validateForm } = useErrorContext({
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
      links,
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
