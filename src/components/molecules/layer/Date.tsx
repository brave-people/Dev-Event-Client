import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import classNames from 'classnames';

interface Layer {
  currentYear: number;
  currentMonth?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
}
interface Date {
  showPicker: boolean;
  closePicker: () => void;
  pickerRef: MutableRefObject<HTMLDivElement | null>;
  year: number;
  month?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
}

const Layer = ({ currentYear, currentMonth, setYear, setMonth }: Layer) => {
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

const DateLayer = ({
  showPicker,
  closePicker,
  pickerRef,
  year,
  month,
  setYear,
  setMonth,
}: Date) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const removePicker = () => {
    if (pickerRef.current?.parentNode && divRef.current?.parentNode) {
      pickerRef.current?.removeChild(divRef.current);
      closePicker();
    }
  };

  useEffect(() => {
    divRef.current = document.createElement('div');

    document.addEventListener('click', (e) => {
      const path = e.composedPath();
      const target = e.target as Element;
      const clickPicker = [...path].find((node) => node === pickerRef.current);
      const clickPickerMonth =
        target.getAttribute('data-label') === 'picker-month';
      (clickPickerMonth && removePicker()) || (!clickPicker && removePicker());
    });
  }, []);

  if (!divRef.current) return null;

  if (showPicker) {
    pickerRef.current?.appendChild(divRef.current);

    return createPortal(
      <Layer
        currentYear={year}
        currentMonth={month}
        setYear={setYear}
        setMonth={setMonth}
      />,
      divRef.current
    );
  }

  if (pickerRef.current?.children?.length) closePicker();

  return null;
};

export default DateLayer;
