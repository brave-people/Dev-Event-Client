import dayjs from 'dayjs';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { createEventsApi } from '../../../api/events/create';
import { fetchUploadImage } from '../../../api/image';
import { STATUS_201 } from '../../../config/constants';
import type { EventType, EventTimeType } from '../../../model/Event';
import type { Tag } from '../../../model/Tag';
import Form from './Form';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
}

const MarkdownModal = ({ isOpen, onClose, onApply }: MarkdownModalProps) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 흐릿한 배경 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="마크다운 텍스트를 입력하세요"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onApply(text)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            적용
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventTags, setEventTags] = useState<Tag[]>([]);
  const [eventTimeType, setEventTimeType] = useState<EventTimeType>(
    'DATE' as const
  );

  const [error, setError] = useState({
    title: false,
    organizer: false,
    eventLink: false,
    tags: false,
  });

  // datepicker
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  // image
  const [blob, setBlob] = useState<FormData | null>(null);

  const eventTagsName = eventTags?.map(({ tag_name }) => tag_name) || [];

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

  const validateForm = () => {
    if (!title) setError((prev) => ({ ...prev, title: true }));
    if (!organizer) setError((prev) => ({ ...prev, organizer: true }));
    if (!eventLink) setError((prev) => ({ ...prev, eventLink: true }));
    if (!eventTags) setError((prev) => ({ ...prev, tags: true }));
    return window.scrollTo({ top: 0 });
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !eventTags?.length) {
      return validateForm();
    }

    const convertTime = (time: Date | null) =>
      time ? 'T' + dayjs(time).format('HH:mm') : 'T00:00';
    const convertStartTime = convertTime(startTime);
    const convertEndTime = convertTime(endTime);

    const coverImageUrl = await uploadImage();

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
      cover_image_link: coverImageUrl,
      event_time_type: eventTimeType,
      ...(startDate && { use_start_date_time_yn: startTime ? 'Y' : 'N' }),
      ...(endDate && { use_end_date_time_yn: endTime ? 'Y' : 'N' }),
    };

    const data = await createEventsApi({ data: body });
    if (data.status_code === STATUS_201) return window.location.reload();
    return alert(data.message);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = (text: string) => {
    //   changeDescription(text);
    //   setIsModalOpen(false);
  };

  return (
    <>
      <Form
        title={title}
        setTitle={setTitle}
        changeTitle={changeTitle}
        error={error}
        description={description}
        changeDescription={changeDescription}
        organizer={organizer}
        setOrganizer={setOrganizer}
        changeOrganizer={changeOrganizer}
        eventLink={eventLink}
        setEventLink={setEventLink}
        changeEventLink={changeEventLink}
        tags={eventTagsName}
        setTags={setEventTags}
        eventTimeType={eventTimeType}
        changeEventTimeType={changeEventTimeType}
        startDate={startDate}
        setStartDate={setStartDate}
        changeStartDate={changeStartDate}
        setEventTimeType={setEventTimeType}
        startTime={startTime}
        setStartTime={setStartTime}
        endDate={endDate}
        setEndDate={setEndDate}
        endTime={endTime}
        setEndTime={setEndTime}
        setBlob={setBlob}
        saveForm={createEvent}
      />

      <MarkdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApply}
      />
    </>
  );
};

export default Create;
