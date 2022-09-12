import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import Input from '../../input/Input';
import TimeComponent from '../../input/date/Time';
import ImageUploadComponent from '../../ImageUpload';
import ErrorContext from '../../ErrorContext';
import Tag from './Tag';
import Checkbox from '../../input/Checkbox';
import FormLink from '../form/link';
import type { ReplayFormModel } from '../../../model/Replay';

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
  hasStartTime = false,
  setHasStartTime,
  hasEndTime = false,
  setHasEndTime,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  coverImageUrl,
  setCoverImageUrl,
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
          customClass={{ 'border-red-400': error.title && !title }}
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
          <label
            htmlFor="event_link"
            className="form__content__title inline-block text-base text-gray-600 absolute top-1"
          >
            다시보기링크
            <span className="text-red-500">*</span>
          </label>
          <FormLink />
        </div>
        <Tag tags={tags} setTags={setTags}>
          {error.tags && !tags.length ? <ErrorContext /> : <></>}
        </Tag>
        <div
          className={classNames('mb-6', {
            'mt-8': tags.length && !isModify,
          })}
        >
          <span className="form__content__title inline-block text-base text-gray-600">
            시작 일자
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            className="appearance-none w-50 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <div className="inline-block">
            <span className="w-20 inline-block text-base text-gray-600 ml-4">
              시작 시간
            </span>
            <TimeComponent
              time={startTime}
              setTime={setStartTime}
              disabled={!hasStartTime}
            />
            {setHasStartTime && (
              <div className="checkbox--blue inline-block ml-4">
                <Checkbox
                  value={hasStartTime}
                  onChange={setHasStartTime}
                  label="시간 표시"
                />
              </div>
            )}
          </div>
        </div>
        <div className="">
          <span className="form__content__title inline-block text-base text-gray-600">
            종료 일자
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={endDate}
            minDate={startDate}
            onChange={(date) => date && setEndDate(date)}
            className="appearance-none w-50 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <div className="inline-block">
            <span className="w-20 inline-block text-base text-gray-600 ml-4">
              종료 시간
            </span>
            <TimeComponent
              time={endTime}
              setTime={setEndTime}
              disabled={!hasEndTime}
            />
            {setHasEndTime && (
              <div className="checkbox--blue inline-block ml-4">
                <Checkbox
                  value={hasEndTime}
                  onChange={setHasEndTime}
                  label="시간 표시"
                />
              </div>
            )}
          </div>
        </div>
        <div className="my-8" />
        <div>
          <span className="form__content__title inline-block text-base text-gray-600">
            대표 이미지
          </span>
          <ImageUploadComponent
            coverImageUrl={coverImageUrl}
            setCoverImageUrl={setCoverImageUrl}
          />
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
          href={'/admin/event'}
          className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          취소
        </a>
      </div>
    </form>
  );
};

export default FormContent;
