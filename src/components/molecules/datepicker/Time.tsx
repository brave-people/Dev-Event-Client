import type { Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';

const Time = ({
  selected,
  onChange,
}: {
  selected: Date | null;
  onChange: Dispatch<SetStateAction<Date | null>>;
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={(date) => onChange(date)}
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

export default Time;
