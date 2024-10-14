import { useAtomValue } from 'jotai';
import type { EventForm } from '../../../model/Event';
import { replayTagsAtom } from '../../../store/tags';
import BaseLabel from '../../atoms/label/base';
import ErrorContext from '../../layouts/ErrorContext';
import FormLink from '../../molecules/DynamicDropboxInput';
import ImageUpload from '../../molecules/image-upload';
import ContentDate from '../../molecules/form/ContentDate';
import ContentDescription from '../../molecules/form/ContentDescription';
import Tag from '../../molecules/form/Tag';
import Editor from '../../molecules/editor';
import LexicalSettingProvider from '../../molecules/editor/state/lexicalSetting/LexicalSettingProvider';
import LexicalHistoryProvider from '../../molecules/editor/state/lexicalHistory/LexicalHistoryProvider';
import LexicalStateShareProvider from '../../molecules/editor/state/lexicalStateShare/LexicalStateShareProvider';

const Form = ({
  title,
  changeTitle,
  error,
  description,
  changeDescription,
  organizer,
  changeOrganizer,
  eventLink,
  changeEventLink,
  tags,
  setTags,
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
}: EventForm) => {
  const replayTags = useAtomValue(replayTagsAtom);

  return (
    <div className="list">
      <form className="form--large">
        <div className="form__content">
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
          <div className="relative mb-8">
            <BaseLabel
              title="다시보기링크"
              htmlFor="event_link"
              required={true}
            />
            <FormLink />
          </div>
          <Tag tags={tags} setTags={setTags} storedTags={replayTags}>
            {error.tags && <ErrorContext />}
          </Tag>
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
          <LexicalSettingProvider>
            <LexicalHistoryProvider>
              <LexicalStateShareProvider>
                <Editor />
              </LexicalStateShareProvider>
            </LexicalHistoryProvider>
          </LexicalSettingProvider>
        </div>
      </form>
      <div className="relative pt-8 pb-6">
        <button
          type="submit"
          onClick={saveForm}
          className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          확인
        </button>
        <a
          href={'/admin/replay'}
          className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          취소
        </a>
      </div>
    </div>
  );
};

export default Form;
