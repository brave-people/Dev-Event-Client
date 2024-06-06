import classNames from 'classnames';
import type { ReplayFormModel } from '../../../../model/Replay';
import DatePicker from '../../../atoms/datepicker/Date';
import TimePicker from '../../../atoms/datepicker/Time';
import Input from '../../../atoms/input/Input';
import BaseLabel from '../../../atoms/label/base';
import ErrorContext from '../../../layouts/ErrorContext';
import FormLink from '../../../molecules/DynamicDropboxInput';
import ImageUpload from '../../../molecules/image-upload';
import Tag from './Tag';

const FormContent = ({
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
  coverImageUrl,
  setBlob,
  saveForm,
  isModify = false,
}: ReplayFormModel) => {
  return (
    <form className="form--large">
      <div className="form__content">
        <Input
          text="제목"
          value={title}
          onChange={changeTitle}
          isRequired={true}
          customClass={{ 'border-red-400': !!(error.title && !title) }}
        >
          {error.title && !title && <ErrorContext />}
        </Input>
        <div className="form__content__input">
          <label
            htmlFor="description"
            className="form__content__title inline-block text-base text-gray-600"
          >
            행사 설명
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={changeDescription}
            className="appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
        <div className="form__content__input">
          <label
            htmlFor="organizer"
            className="form__content__title inline-block text-base text-gray-600"
          >
            주최
            <span className="text-red-500">*</span>
          </label>
          <input
            id="organizer"
            type="text"
            value={organizer}
            onChange={changeOrganizer}
            required
            className={classNames(
              'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              { 'border-red-400': error.organizer && !organizer }
            )}
          />
          {error.organizer && !organizer && <ErrorContext />}
        </div>
        <div className="form__content__input">
          <label
            htmlFor="event_link"
            className="form__content__title inline-block text-base text-gray-600"
          >
            행사 링크
            <span className="text-red-500">*</span>
          </label>
          <input
            id="event_link"
            type="text"
            value={eventLink}
            onChange={changeEventLink}
            required
            autoComplete="off"
            className={classNames(
              'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              { 'border-red-400': error.eventLink && !eventLink }
            )}
          />
          {error.eventLink && !eventLink && <ErrorContext />}
        </div>
        <div className="relative mb-8">
          <BaseLabel
            title="다시보기링크"
            htmlFor="event_link"
            required={true}
          />
          <FormLink />
        </div>
        <Tag tags={tags} setTags={setTags}>
          {error.tags && !tags.length ? <ErrorContext /> : <></>}
        </Tag>
        <div
          className={classNames('mb-6 flex items-center', {
            'mt-8': tags?.length && !isModify,
          })}
        >
          <span className="form__content__title inline-block text-base text-gray-600">
            시작 일자
          </span>
          <DatePicker selected={startDate} onChange={changeStartDate} />
          <div className="w-full inline-flex items-center justify-end">
            <span className="w-20 inline-block text-base text-gray-600">
              시작 시간
            </span>
            <TimePicker selected={startTime} onChange={setStartTime} />
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <span className="form__content__title inline-block text-base text-gray-600">
            종료 일자
          </span>
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            minDate={startDate}
          />
          <div className="w-full inline-flex items-center justify-end">
            <span className="w-20 inline-block text-base text-gray-600">
              종료 시간
            </span>
            <TimePicker selected={endTime} onChange={setEndTime} />
          </div>
        </div>
        <div className="my-8" />
        <div>
          <span className="form__content__title inline-block text-base text-gray-600">
            대표 이미지
          </span>
          <ImageUpload coverImageUrl={coverImageUrl} setBlob={setBlob} />
        </div>
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
          href={'/admin/replay'}
          className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          취소
        </a>
      </div>
    </form>
  );
};

export default FormContent;
