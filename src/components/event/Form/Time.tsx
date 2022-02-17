import DatePicker from 'react-datepicker';
import { Dispatch, SetStateAction } from 'react';

const TimeComponent = ({
  time,
  setTime,
}: {
  time: Date;
  setTime: Dispatch<SetStateAction<Date>>;
}) => {
  return (
    <>
      <DatePicker
        selected={time}
        onChange={(date) => date && setTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
    </>
  );
};

export default TimeComponent;
