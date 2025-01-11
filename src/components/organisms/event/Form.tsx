'use client';

import { useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import type { EventForm, EventTime } from '../../../model/Event';
import { MarkdownInputState } from '../../../model/Event';
import { eventTagsAtom } from '../../../store/tags';
import ErrorContext from '../../layouts/ErrorContext';
import EventType from '../../molecules/EventType';
import MarkdownEventInputModal from '../../molecules/MarkdownEventInputModal';
import ContentDate from '../../molecules/form/ContentDate';
import ContentDescription from '../../molecules/form/ContentDescription';
import Tag from '../../molecules/form/Tag';
import ImageUpload from '../../molecules/image-upload';

const Form = ({
  title,
  setTitle,
  changeTitle,
  error,
  description,
  changeDescription,
  organizer,
  setOrganizer,
  changeOrganizer,
  eventLink,
  setEventLink,
  changeEventLink,
  tags,
  setTags,
  eventTimeType,
  changeEventTimeType,
  setEventTimeType,
  startDate,
  setStartDate,
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
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<MarkdownInputState>({
    showLayer: false,
  });

  const updateActiveLayer = async () => {
    setState((prevState) => ({
      ...prevState,
      showLayer: !state.showLayer,
    }));
  };

  const closeLayer = () => setState({ ...state, showLayer: !state.showLayer });

  return (
    <>
      <div ref={layerRef}>
        <MarkdownEventInputModal
          state={state}
          layerRef={layerRef}
          closeLayer={closeLayer}
          setTitle={setTitle}
          setOrganizer={setOrganizer}
          setEventLink={setEventLink}
          setStartDate={setStartDate}
          setStartTime={setStartTime}
          setEndDate={setEndDate}
          setEndTime={setEndTime}
          setEventTimeType={setEventTimeType}
        />
      </div>
      <div className="list">
        <form className="form--large">
          <div className="form__content">
            <button
              onClick={(e) => {
                e.preventDefault();
                updateActiveLayer();
              }}
              className="mr-2 mb-6 py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
            >
              마크다운으로 입력
            </button>
            <ContentDescription
              title={title}
              changeTitle={changeTitle}
              error={error}
              description={description}
              changeDescription={changeDescription}
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
    </>
  );
};

export default Form;
