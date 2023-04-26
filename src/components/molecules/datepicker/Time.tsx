import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';

const Time = ({
  selected,
  onChange,
  disabled = false,
  className,
}: {
  selected: Date | null;
  onChange: Dispatch<SetStateAction<Date | null>>;
  disabled?: boolean;
  className?: string;
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
      disabled={disabled}
      className={classNames(
        'appearance-none w-52 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
        className
      )}
    />
  );
};

export default Time;
