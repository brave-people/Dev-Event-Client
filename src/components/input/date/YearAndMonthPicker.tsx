import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';

const YearAndMonthPicker = ({
  currentYear,
  currentMonth,
  setYear,
  setMonth,
}: {
  currentYear: number;
  currentMonth?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
}) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    text: `${index + 1}월`,
  }));

  return (
    <nav className="month--picker rounded-lg px-3 pb-3">
      <div className="flex items-center justify-between py-3">
        <button
          onClick={() => setYear(--currentYear)}
          disabled={currentYear < 2020}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
          >
            <path
              fill="#797B86"
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span className="month--picker__title">{currentYear}</span>
        <button onClick={() => setYear(++currentYear)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
          >
            <path
              fill="#797B86"
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {setMonth && (
        <div className="grid grid-cols-3">
          {months.map((month) => (
            <button
              key={month.value}
              type="button"
              value={month.value}
              onClick={() => setMonth(month.value)}
              className={classNames('p-3 text-sm text-gray-700', {
                'bg-blue-500 text-white rounded': month.value === currentMonth,
              })}
              data-label="picker-month"
            >
              {month.text}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default YearAndMonthPicker;
