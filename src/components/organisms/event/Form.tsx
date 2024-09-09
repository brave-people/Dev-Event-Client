'use client';

import { useAtomValue } from 'jotai';
import type { EventForm, EventTime } from '../../../model/Event';
import { eventTagsAtom } from '../../../store/tags';
import ErrorContext from '../../layouts/ErrorContext';
import EventType from '../../molecules/EventType';
import Editor from '../../molecules/editor';
import ContentDate from '../../molecules/form/ContentDate';
import ContentDescription from '../../molecules/form/ContentDescription';
import Tag from '../../molecules/form/Tag';
import ImageUpload from '../../molecules/image-upload';
import { MarkdownEditor } from '../../molecules/markdown';

const Form = ({
  title,
  changeTitle,
  error,
  description,
  setDescription,
  organizer,
  changeOrganizer,
  eventLink,
  changeEventLink,
  tags,
  setTags,
  eventTimeType,
  changeEventTimeType,
  startDate,
  changeStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  coverImageUrl = '',
  setBlob,
  saveForm,
  isModify = false,
}: EventForm & EventTime) => {
  const eventTags = useAtomValue(eventTagsAtom);

  return (
    <div className="list">
      <form className="form--large">
        <div className="form__content">
          <ContentDescription
            title={title}
            changeTitle={changeTitle}
            error={error}
            description={description}
            organizer={organizer}
            changeOrganizer={changeOrganizer}
            eventLink={eventLink}
            changeEventLink={changeEventLink}
          />
          <Tag tags={tags} setTags={setTags} storedTags={eventTags}>
            {error.tags && <ErrorContext />}
          </Tag>
          <EventType
            eventTimeType={eventTimeType}
            changeEventTimeType={changeEventTimeType}
          />
          <ContentDate
            tags={tags}
            startDate={startDate}
            changeStartDate={changeStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
            isModify={isModify}
          />
          <ImageUpload setBlob={setBlob} coverImageUrl={coverImageUrl} />
          <MarkdownEditor
            description={description}
            setDescription={setDescription}
          />
        </div>
        <div className="relative pt-8 pb-6">
          <button
            type="submit"
            onClick={saveForm}
            className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            확인
          </button>
          <a
            href={'/admin/event'}
            className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            취소
          </a>
        </div>
      </form>
    </div>
  );
};

export default Form;
