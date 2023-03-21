'use client';

import classNames from 'classnames';
import { EventForm } from '../../../model/Event';
import DatePicker from '../../atoms/datepicker/Date';
import TimePicker from '../../atoms/datepicker/Time';

type ContentDateProps = Pick<
  EventForm,
  | 'tags'
  | 'startDate'
  | 'changeStartDate'
  | 'startTime'
  | 'setStartTime'
  | 'endDate'
  | 'setEndTime'
  | 'endTime'
  | 'setEndDate'
  | 'isModify'
>;

const ContentDate = ({
  tags,
  startDate,
  changeStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  isModify,
}: ContentDateProps) => {
  return (
    <>
      <div
        className={classNames('mb-6 flex items-center', {
          'mt-8': tags?.length && !isModify,
        })}
      >
        <span className="form__content__title inline-block text-base text-gray-600">
          시작 일자
        </span>
        <DatePicker selected={startDate} onChange={changeStartDate} />
        <div className="w-full inline-flex items-center justify-center">
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
          onChange={setEndDate}
          minDate={startDate}
        />
        <div className="w-full inline-flex items-center justify-center">
          <span className="w-20 inline-block text-base text-gray-600">
            종료 시간
          </span>
          <TimePicker selected={endTime} onChange={setEndTime} />
        </div>
      </div>
    </>
  );
};

export default ContentDate;
