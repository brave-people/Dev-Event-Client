import classNames from 'classnames';
import ErrorContext from './ErrorContext';
import Tag from './Tag';
import DatePicker from 'react-datepicker';
import TimeComponent from '../date/Time';
import ImageUploadComponent from '../ImageUpload';
import { baseRouter } from '../../../config/constants';
import Input from '../../input/Input';
import type { EventFormModel } from '../../../model/Event';

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
  allTags,
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
}: EventFormModel) => {
  return (
    <form className="form--large">
      <div className="form__content">
        <Input
          text="제목"
          value={title}
          onChange={changeTitle}
          isRequired={true}
          customClass={{ 'border-red-400': error.title }}
        >
          {error.title && <ErrorContext />}
        </Input>
        <div className="form__content__input">
          <label
            htmlFor="description"
            className="form__content__title inline-block text-base font-medium text-gray-600"
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
            className="form__content__title inline-block text-base font-medium text-gray-600"
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
              { 'border-red-400': error.title }
            )}
          />
          {error.organizer && <ErrorContext />}
        </div>
        <div className="form__content__input">
          <label
            htmlFor="event_link"
            className="form__content__title inline-block text-base font-medium text-gray-600"
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
            className={classNames(
              'appearance-none w-full h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              { 'border-red-400': error.title }
            )}
          />
          {error.eventLink && <ErrorContext />}
        </div>
        <div className="form__content__input relative">
          <Tag tags={tags} setTags={setTags} allTags={allTags} />
        </div>
        <div className="form__content--date">
          <span className="form__content__title inline-block text-base font-medium text-gray-600">
            시작 날짜
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            className="appearance-none w-80 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <span className="w-40 inline-block text-base font-medium text-gray-600">
            시작 시간
          </span>
          <TimeComponent time={startTime} setTime={setStartTime} />
        </div>
        <div className="form__content--date">
          <span className="form__content__title inline-block text-base font-medium text-gray-600">
            종료 날짜
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selected={endDate}
            minDate={startDate}
            onChange={(date) => date && setEndDate(date)}
            className="appearance-none w-80 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
          <span className="w-40 inline-block text-base font-medium text-gray-600">
            종료 시간
          </span>
          <TimeComponent time={endTime} setTime={setEndTime} />
        </div>
        <div className="my-8" />
        <ImageUploadComponent
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
        />
      </div>
      <div className="relative">
        <button
          type="submit"
          onClick={saveForm}
          className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          확인
        </button>
        <a
          href={baseRouter() + '/admin/event'}
          className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          취소
        </a>
      </div>
    </form>
  );
};

export default FormContent;
