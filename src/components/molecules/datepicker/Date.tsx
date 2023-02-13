import DatePicker from 'react-datepicker';

const Date = ({
  selected,
  onChange,
  minDate,
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date | null;
}) => {
  return (
    <DatePicker
      dateFormat="yyyy/MM/dd"
      selected={selected}
      onChange={(date) => onChange(date)}
      isClearable={true}
      placeholderText=""
      className="appearance-none w-52 h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      {...(minDate && { minDate })}
    />
  );
};

export default Date;
