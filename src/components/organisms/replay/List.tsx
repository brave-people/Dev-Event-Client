import { useRef, useState } from 'react';
import PickerLayer from '../../molecules/layer/Date';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';

interface List {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month?: number;
  setMonth?: Dispatch<SetStateAction<number>>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}

const List = ({
  year,
  setYear,
  month,
  setMonth,
  keyword,
  setKeyword,
}: List) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const closePicker = () => setShowPicker(false);

  const changeShowPicker = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowPicker(!showPicker);
  };

  return (
    <div className="list__header">
      <div className="relative">
        <button className="list__header__button" onClick={changeShowPicker}>
          <span>{year}년&nbsp;</span>
          {month && <span>{month + 1}월</span>}
        </button>
        <div ref={pickerRef}>
          <PickerLayer
            showPicker={showPicker}
            closePicker={closePicker}
            pickerRef={pickerRef}
            year={year}
            month={month}
            setYear={setYear}
            setMonth={setMonth}
          />
        </div>
      </div>
      <div className="list__search">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#6E6E6E"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="모임명으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
    </div>
  );
};

export default List;
