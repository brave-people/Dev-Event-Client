import DatePicker from 'react-datepicker';
import type { Dispatch, SetStateAction } from 'react';

const TimeComponent = ({
  time,
  setTime,
}: {
  time: Date | null;
  setTime: Dispatch<SetStateAction<Date | null>>;
}) => {
  return (
    <DatePicker
      selected={time}
      onChange={(date) => setTime(date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption="Time"
      dateFormat="hh:mm aa"
      autoComplete="off"
      isClearable
      className="appearance-none w-52 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    />
  );
};

export default TimeComponent;
