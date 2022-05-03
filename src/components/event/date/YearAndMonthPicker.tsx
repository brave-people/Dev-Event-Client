import type { Dispatch, SetStateAction } from 'react';

const YearAndMonthPicker = ({
  year,
  setYear,
  setMonth,
}: {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
}) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    text: `${index + 1}월`,
  }));

  return (
    <div>
      <div>
        <button onClick={() => setYear(--year)} disabled={year < 2020}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <span>{year}</span>
        <button onClick={() => setYear(++year)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="table-fixed">
        {months.map((month) => (
          <button
            key={month.value}
            type="button"
            value={month.value}
            onClick={() => setMonth(month.value)}
          >
            {month.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearAndMonthPicker;
