import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import YearAndMonthPicker from './YearAndMonthPicker';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

interface Picker {
  showPicker: boolean;
  closePicker: () => void;
  pickerRef: MutableRefObject<HTMLDivElement | null>;
  year: number;
  month?: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth?: Dispatch<SetStateAction<number>>;
}

const PickerLayer = ({
  showPicker,
  closePicker,
  pickerRef,
  year,
  month,
  setYear,
  setMonth,
}: Picker) => {
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
      <YearAndMonthPicker
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

export default PickerLayer;
