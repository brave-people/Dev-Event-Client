import { Fragment, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { getEventsApi } from '../../pages/api/events';
import { deleteEventApi } from '../../pages/api/events/delete';
import YearAndMonthPicker from './date/YearAndMonthPicker';
import CenterAlert from '../alert/CenterAlert';
import type {
  MouseEvent,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from 'react';
import type { EventResponseModel } from '../../model/Event';

interface Picker {
  showPicker: boolean;
  closePicker: () => void;
  pickerRef: MutableRefObject<HTMLDivElement | null>;
  year: number;
  month: number;
  setYear: Dispatch<SetStateAction<number>>;
  setMonth: Dispatch<SetStateAction<number>>;
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

const List = () => {
  const router = useRouter();

  const pickerRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate] = useState<Date>(new Date());
  const [list, setList] = useState<EventResponseModel[]>([]);
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [showAlert, setShowAlert] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const { data, refetch } = useQuery(
    ['fetchEvents', { year, month }],
    async () => await getEventsApi({ year, month: month + 1 }),
    { refetchOnWindowFocus: false }
  );

  const deleteEvent = async () => {
    if (!currentId) return;
    await deleteEventApi({ id: currentId });
    setShowAlert(false);
    await refetch();
  };

  const changeShowPicker = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowPicker(!showPicker);
  };
  const closePicker = () => setShowPicker(false);

  useEffect(() => {
    if (!data) return setList([]);
    if (!keyword) return setList(data);

    const findKeywordList = data.filter((eventList) =>
      eventList.title.includes(keyword)
    );
    return setList(findKeywordList);
  }, [keyword, data]);

  return (
    <>
      <div className="list">
        <div className="list__header">
          <div className="relative">
            <button className="list__header__button" onClick={changeShowPicker}>
              <span>{year}년&nbsp;</span>
              <span>{month + 1}월</span>
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
        {!list.length ? (
          <div>
            <p>이달의 이벤트가 없어요! 이벤트를 만들어주세요</p>
          </div>
        ) : (
          <div className="list__table relative mt-8 border rounded">
            <table className="w-full p-4">
              <thead className="list__table--thead">
                <tr>
                  <td className="list__table--title">No</td>
                  <td className="list__table--title">제목</td>
                  <td className="list__table--title">링크</td>
                  <td className="list__table--title">시작 일시</td>
                  <td className="list__table--title">종료 일시</td>
                </tr>
              </thead>
              <tbody>
                {list.length > 0 &&
                  list.map((value: EventResponseModel, index: number) => (
                    <Fragment key={value.id}>
                      <tr>
                        <td className="list__table--sub-title">{index + 1}</td>
                        <td>{value.title}</td>
                        <td>
                          <a
                            href={value.event_link}
                            className="list__table__tag list__table--link"
                          >
                            홈페이지
                          </a>
                        </td>
                        <td>{value.start_date_time}</td>
                        <td>{value.end_date_time}</td>
                        <td>
                          <div className="list--group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                            <div className="list--group__button">
                              <button
                                className="text-blue-500 font-bold"
                                onClick={() =>
                                  router.push(
                                    `/admin/event/modify?id=${value.id}`,
                                    undefined,
                                    { shallow: true }
                                  )
                                }
                              >
                                수정
                              </button>
                              <button
                                className="text-red-500 font-bold"
                                onClick={() => {
                                  setCurrentId(value.id);
                                  setShowAlert(true);
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
              </tbody>
            </table>
            <button
              type="button"
              className="list__button--pop"
              onClick={() => router.push('/admin/event/create')}
            >
              이벤트 생성
            </button>
          </div>
        )}
        {showAlert && (
          <CenterAlert
            title="정말 삭제할까요?"
            description="돌이킬 수 없어요!"
            showAlert={setShowAlert}
            save={deleteEvent}
          />
        )}
      </div>
    </>
  );
};

export default List;
