import { useRef, useState } from 'react';
import type { Dispatch, MouseEvent, SetStateAction } from 'react';
import MonthYearLayer from '../../../molecules/layer/MonthYear';

interface ContentHeader {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month?: number;
  setMonth?: Dispatch<SetStateAction<number>>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}

const ContentHeader = ({
  year,
  setYear,
  month,
  setMonth,
  keyword,
  setKeyword,
}: ContentHeader) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const closePicker = () => setShowPicker(false);

  const changeShowPicker = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowPicker(!showPicker);
  };

  return (
    <div className="list__header">
      <div className="list__header-left">
        <div className="relative">
          <button
            className="list__header__button"
            onClick={changeShowPicker}
            aria-label="날짜 선택"
          >
            <svg
              className="list__header__button-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="list__header__button-text">
              {year}년{month !== undefined && ` ${month + 1}월`}
            </span>
            <svg
              className="list__header__button-chevron"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div ref={pickerRef}>
            <MonthYearLayer
              isPickerVisible={showPicker}
              closePicker={closePicker}
              pickerContainerRef={pickerRef}
              currentYear={year}
              currentMonth={month}
              setYear={setYear}
              setMonth={setMonth}
            />
          </div>
        </div>
      </div>

      <div className="list__search">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="제목으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="검색"
        />
      </div>
    </div>
  );
};

export default ContentHeader;
