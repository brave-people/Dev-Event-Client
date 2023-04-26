import { useEffect, useRef } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import LeftArrowIcon from '../../atoms/icon/LeftArrowIcon';
import RightArrowIcon from '../../atoms/icon/RightArrowIcon';

interface MonthPickerProps {
  currentYear: number;
  currentMonth?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
}

type MonthYearPickerProps = {
  isPickerVisible: boolean;
  closePicker: () => void;
  pickerContainerRef: MutableRefObject<HTMLDivElement | null>;
  currentYear: number;
  currentMonth?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
};

const MonthPicker = ({
  currentYear,
  currentMonth,
  setYear,
  setMonth,
}: MonthPickerProps) => {
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index,
    text: `${index + 1}월`,
  }));

  return (
    <nav className="month--picker rounded-lg px-3 pb-3">
      <div className="flex items-center justify-between py-3">
        <button
          onClick={() => setYear(currentYear - 1)}
          disabled={currentYear < 2020}
        >
          <RightArrowIcon />
        </button>
        <span className="month--picker__title">{currentYear}</span>
        <button onClick={() => setYear(currentYear + 1)}>
          <LeftArrowIcon />
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

const MonthYearLayer = ({
  isPickerVisible,
  closePicker,
  pickerContainerRef,
  currentYear,
  currentMonth,
  setYear,
  setMonth,
}: MonthYearPickerProps) => {
  const portalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    const isClickOutside = !pickerContainerRef.current?.contains(target);
    if (isClickOutside) handleRemovePicker();
  };

  const handleRemovePicker = () => {
    if (portalRef.current?.parentNode && portalRef.current) {
      pickerContainerRef.current?.removeChild(portalRef.current);
      document.removeEventListener('click', handleClickOutside);
      closePicker();
    }
  };

  useEffect(() => {
    if (portalRef.current) return;
    portalRef.current = document.createElement('div');
  }, []);

  useEffect(() => {
    if (isPickerVisible && portalRef.current) {
      pickerContainerRef.current?.appendChild(portalRef.current);
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (portalRef.current) handleRemovePicker();
    };
  }, [isPickerVisible]);

  if (!portalRef.current) return null;

  return createPortal(
    <MonthPicker
      currentYear={currentYear}
      currentMonth={currentMonth}
      setYear={setYear}
      setMonth={setMonth}
    />,
    portalRef.current
  );
};

export default MonthYearLayer;
